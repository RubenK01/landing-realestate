import json
import os
import hashlib
import time
import urllib3
import re

http = urllib3.PoolManager()

def hash_user_data(data: str) -> str:
    """Normaliza y hashea datos según las especificaciones de Meta."""
    return hashlib.sha256(data.strip().lower().encode()).hexdigest()

def is_valid_email(email: str) -> bool:
    """Valida formato de email."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        # Campos obligatorios
        email = body.get("email")
        name = body.get("name")
        operation = body.get("operation")
        zone = body.get("zone")

        # Opcionales
        phone = body.get("phone")
        fbp = body.get("fbp")
        fbc = body.get("fbc")
        event_source_url = body.get("event_source_url") or None

        # Validación mínima
        if not email or not is_valid_email(email):
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Email invalido o faltante"})
            }

        # Cargar variables de entorno
        pixel_id = os.environ["PIXEL_ID"]
        access_token = os.environ["ACCESS_TOKEN"]

        # Construir user_data
        user_data = {
            "em": [hash_user_data(email)]
        }

        if phone:
            user_data["ph"] = [hash_user_data(phone)]
        if fbp:
            user_data["fbp"] = fbp
        if fbc:
            user_data["fbc"] = fbc

        # Se puede incluir ip_address y user_agent si se pasa desde el frontend
        if "client_ip_address" in body:
            user_data["client_ip_address"] = body["client_ip_address"]
        if "client_user_agent" in body:
            user_data["client_user_agent"] = body["client_user_agent"]

        # Payload para Meta Conversion API
        payload = {
            "data": [
                {
                    "event_name": "Lead",
                    "event_time": int(time.time()),
                    "action_source": "website",
                    "event_source_url": event_source_url,
                    "user_data": user_data,
                    "custom_data": {
                        "name": name,
                        "operation": operation,
                        "zone": zone
                    }
                }
            ]
        }

        # Envío a Meta
        url = f"https://graph.facebook.com/v18.0/{pixel_id}/events?access_token={access_token}"
        headers = {"Content-Type": "application/json"}

        response = http.request("POST", url, headers=headers, body=json.dumps(payload).encode("utf-8"))

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Evento enviado correctamente",
                "meta_response": json.loads(response.data.decode("utf-8"))
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
