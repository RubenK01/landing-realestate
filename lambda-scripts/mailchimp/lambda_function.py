import json
import os
import requests
import hashlib
import logging

# Configuración del logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

MAILCHIMP_API_KEY = os.environ.get("MAILCHIMP_API_KEY")
MAILCHIMP_SERVER_PREFIX = MAILCHIMP_API_KEY.split("-")[-1] if MAILCHIMP_API_KEY else None
MAILCHIMP_LIST_ID = os.environ.get("MAILCHIMP_LIST_ID")

def lambda_handler(event, context):
    logger.info("Lambda function started.")
    logger.info(f"MAILCHIMP_SERVER_PREFIX: {MAILCHIMP_SERVER_PREFIX}")
    logger.info(f"MAILCHIMP_LIST_ID: {MAILCHIMP_LIST_ID}")
    
    # Validación inicial de variables de entorno
    if not MAILCHIMP_API_KEY:
        logger.error("MAILCHIMP_API_KEY environment variable is not set.")
        return response(500, {"message": "Server configuration error: Mailchimp API Key missing."})
    
    if not MAILCHIMP_LIST_ID:
        logger.error("MAILCHIMP_LIST_ID environment variable is not set.")
        return response(500, {"message": "Server configuration error: Mailchimp List ID missing."})

    try:
        logger.info(f"Received event: {json.dumps(event)}")
        body = json.loads(event.get("body", "{}"))
        logger.info(f"Parsed request body: {body}")

        email = body.get("email")
        name = body.get("name", "")
        phone = body.get("phone", "")
        operation = body.get("operation", "")
        zone = body.get("zone", "")

        logger.info(f"Extracted data - Email: {email}, Name: {name}, Phone: {phone}, Operation: {operation}, Zone: {zone}")

        if not email:
            logger.warning("Email is missing from the request body.")
            return response(400, {"message": "Email is required."})

        # Preparar payload para Mailchimp
        member_id = hashlib.md5(email.lower().encode()).hexdigest()
        logger.info(f"Generated Mailchimp member_id: {member_id}")

        url = f"https://{MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/{MAILCHIMP_LIST_ID}/members/{member_id}"
        logger.info(f"Mailchimp API URL: {url}")

        data = {
            "email_address": email,
            "status_if_new": "subscribed",
            "merge_fields": {
                "FNAME": name,
                "PHONE": phone,
                "OPERACION": operation,
                "ZONA": zone
            }
        }
        logger.info(f"Mailchimp payload prepared: {json.dumps(data)}")

        headers = {
            "Authorization": f"apikey {MAILCHIMP_API_KEY}",
            "Content-Type": "application/json"
        }
        logger.info(f"Mailchimp request headers (partial): Authorization: apikey [...], Content-Type: application/json")

        logger.info(f"Sending PUT request to Mailchimp API...")
        res = requests.put(url, headers=headers, json=data)
        logger.info(f"Mailchimp API response status code: {res.status_code}")
        logger.info(f"Mailchimp API response body: {res.text}")

        if res.status_code not in (200, 201):
            logger.error(f"Mailchimp API call failed with status {res.status_code}. Response: {res.text}")
            return response(500, {"message": "Failed to subscribe user."})

        logger.info("Subscription successful.")
        return response(200, {"message": "Subscription successful."})

    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding error: {e}")
        return response(400, {"message": "Invalid JSON in request body."})
    except requests.exceptions.RequestException as e:
        logger.error(f"Network or Mailchimp API request error: {e}")
        return response(500, {"message": "Failed to connect to Mailchimp API."})
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        return response(500, {"message": "Internal server error."})

def response(status_code, body):
    logger.info(f"Returning response with status code {status_code} and body: {json.dumps(body)}")
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }