import json
import os
import requests
import hashlib
import time
import re
import logging

# Configuración del logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuración de reCAPTCHA
RECAPTCHA_CONFIG = {
    'development': {
        'site_key': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        'secret_key': '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    },
    'production': {
        'site_key': '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL',
        'secret_key': os.environ.get('RECAPTCHA_SECRET_KEY', 'TU_SECRET_KEY_AQUI')
    }
}

# Configuración de Mailchimp
MAILCHIMP_API_KEY = os.environ.get("MAILCHIMP_API_KEY")
MAILCHIMP_SERVER_PREFIX = MAILCHIMP_API_KEY.split("-")[-1] if MAILCHIMP_API_KEY else None
MAILCHIMP_LIST_ID = os.environ.get("MAILCHIMP_LIST_ID")

# Configuración de Meta CAPI
PIXEL_ID = os.environ.get("PIXEL_ID")
ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")

def verify_recaptcha(token: str, environment: str = 'production') -> dict:
    """
    Verifica el token de reCAPTCHA v3 con Google
    """
    try:
        secret_key = RECAPTCHA_CONFIG[environment]['secret_key']
        
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': secret_key,
                'response': token
            },
            timeout=10
        )
        
        result = response.json()
        
        # Para reCAPTCHA v3, verificamos el score (0.0 = bot, 1.0 = humano)
        success = result.get('success', False)
        score = result.get('score', 0.0)
        action = result.get('action', '')
        
        # Consideramos exitoso si score >= 0.5 (puedes ajustar este umbral)
        is_valid = success and score >= 0.5 and action == 'submit'
        
        return {
            'success': is_valid,
            'score': score,
            'action': action,
            'challenge_ts': result.get('challenge_ts', ''),
            'hostname': result.get('hostname', ''),
            'error_codes': result.get('error-codes', []),
            'raw_success': success
        }
        
    except Exception as e:
        logger.error(f"Error verificando reCAPTCHA v3: {str(e)}")
        return {
            'success': False,
            'error': f'Error de verificación: {str(e)}'
        }

def hash_user_data(data: str) -> str:
    """Normaliza y hashea datos según las especificaciones de Meta."""
    return hashlib.sha256(data.strip().lower().encode()).hexdigest()

def is_valid_email(email: str) -> bool:
    """Valida formato de email."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def generate_recaptcha_report(recaptcha_result: dict) -> dict:
    """
    Genera un reporte detallado de la evaluación de reCAPTCHA
    """
    score = recaptcha_result.get('score', 0.0)
    action = recaptcha_result.get('action', '')
    hostname = recaptcha_result.get('hostname', '')
    
    # Evaluación del score
    if score >= 0.9:
        score_category = "EXCELLENT"
        score_description = "Very likely human"
        score_emoji = "🔵"
    elif score >= 0.7:
        score_category = "GOOD"
        score_description = "Likely human"
        score_emoji = "🟢"
    elif score >= 0.5:
        score_category = "MEDIUM"
        score_description = "Possibly human"
        score_emoji = "🟡"
    elif score >= 0.3:
        score_category = "LOW"
        score_description = "Possibly bot"
        score_emoji = "🟠"
    else:
        score_category = "VERY_LOW"
        score_description = "Very likely bot"
        score_emoji = "🔴"
    
    # Evaluación de la acción
    action_correct = action == 'submit'
    action_emoji = "✅" if action_correct else "⚠️"
    
    # Evaluación del hostname
    hostname_correct = hostname == 'metodovende.es'
    hostname_emoji = "✅" if hostname_correct else "⚠️"
    
    return {
        'score': {
            'value': score,
            'category': score_category,
            'description': score_description,
            'emoji': score_emoji
        },
        'action': {
            'value': action,
            'expected': 'submit',
            'correct': action_correct,
            'emoji': action_emoji
        },
        'hostname': {
            'value': hostname,
            'expected': 'metodovende.es',
            'correct': hostname_correct,
            'emoji': hostname_emoji
        },
        'timestamp': recaptcha_result.get('challenge_ts', ''),
        'raw_success': recaptcha_result.get('raw_success', False),
        'error_codes': recaptcha_result.get('error_codes', [])
    }

def send_to_mailchimp(form_data: dict) -> dict:
    """
    Envía datos a Mailchimp
    """
    try:
        if not MAILCHIMP_API_KEY or not MAILCHIMP_LIST_ID:
            logger.warning("Mailchimp configuration missing")
            return {"success": False, "error": "Mailchimp not configured"}

        email = form_data.get("email")
        name = form_data.get("name", "")
        phone = form_data.get("phone", "")
        operation = form_data.get("operation", "")
        zone = form_data.get("zone", "")

        member_id = hashlib.md5(email.lower().encode()).hexdigest() if email else ""
        url = f"https://{MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/{MAILCHIMP_LIST_ID}/members/{member_id}"

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

        headers = {
            "Authorization": f"apikey {MAILCHIMP_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.put(url, headers=headers, json=data)
        
        if response.status_code in (200, 201):
            logger.info("Mailchimp subscription successful")
            return {"success": True}
        else:
            logger.error(f"Mailchimp API error: {response.status_code} - {response.text}")
            return {"success": False, "error": f"Mailchimp API error: {response.status_code}"}

    except Exception as e:
        logger.error(f"Error sending to Mailchimp: {str(e)}")
        return {"success": False, "error": str(e)}

def send_to_meta_capi(form_data: dict) -> dict:
    """
    Envía datos a Meta Conversion API
    """
    try:
        if not PIXEL_ID or not ACCESS_TOKEN:
            logger.warning("Meta CAPI configuration missing")
            return {"success": False, "error": "Meta CAPI not configured"}

        email = form_data.get("email")
        name = form_data.get("name", "")
        operation = form_data.get("operation", "")
        zone = form_data.get("zone", "")
        phone = form_data.get("phone", "")
        fbp = form_data.get("fbp")
        fbc = form_data.get("fbc")
        event_source_url = form_data.get("event_source_url")
        client_ip_address = form_data.get("client_ip_address")
        client_user_agent = form_data.get("client_user_agent")

        # Construir user_data
        user_data = {
            "em": [hash_user_data(email)] if email else []
        }

        if phone:
            user_data["ph"] = [hash_user_data(str(phone))]
        if fbp:
            user_data["fbp"] = fbp
        if fbc:
            user_data["fbc"] = fbc
        if client_ip_address:
            user_data["client_ip_address"] = client_ip_address
        if client_user_agent:
            user_data["client_user_agent"] = client_user_agent

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

        url = f"https://graph.facebook.com/v18.0/{PIXEL_ID}/events?access_token={ACCESS_TOKEN}"
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            logger.info("Meta CAPI event sent successfully")
            return {"success": True, "meta_response": response.json()}
        else:
            logger.error(f"Meta CAPI error: {response.status_code} - {response.text}")
            return {"success": False, "error": f"Meta CAPI error: {response.status_code}"}

    except Exception as e:
        logger.error(f"Error sending to Meta CAPI: {str(e)}")
        return {"success": False, "error": str(e)}

def lambda_handler(event, context):
    """
    Lambda unificado que maneja submit-form con validación de reCAPTCHA
    """
    logger.info("Lambda function started")
    
    try:
        # Parsear el body
        if isinstance(event.get("body"), str):
            body = json.loads(event.get("body", "{}"))
        else:
            body = event.get("body", {})
        
        logger.info(f"Received request body: {json.dumps(body)}")
        
        # Extraer datos del formulario
        form_data = {
            'name': body.get('name', ''),
            'email': body.get('email', ''),
            'phone': body.get('phone', ''),
            'operation': body.get('operation', ''),
            'zone': body.get('zone', ''),
            'recaptchaToken': body.get('recaptchaToken', ''),
            'consentCookies': body.get('consentCookies', 'false'),
            # Campos para Meta CAPI
            'fbp': body.get('fbp'),
            'fbc': body.get('fbc'),
            'event_source_url': body.get('event_source_url'),
            'client_ip_address': body.get('client_ip_address'),
            'client_user_agent': body.get('client_user_agent')
        }
        
        # ===== VALIDACIÓN DE CAMPOS REQUERIDOS =====
        required_fields = ['name', 'email', 'operation', 'zone', 'recaptchaToken']
        missing_fields = [field for field in required_fields if not form_data[field]]
        
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'
                })
            }
        
        # ===== VALIDACIÓN DE EMAIL =====
        if not is_valid_email(form_data['email']):
            logger.warning(f"Invalid email format: {form_data['email']}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Formato de email inválido'
                })
            }
        
        # ===== VALIDACIÓN Y EVALUACIÓN DE reCAPTCHA =====
        logger.info("Validating and evaluating reCAPTCHA...")
        recaptcha_result = verify_recaptcha(
            form_data['recaptchaToken'],
            environment='production'  # Cambiar según el entorno
        )
        
        # ===== EVALUACIÓN DETALLADA DE reCAPTCHA =====
        logger.info("=== reCAPTCHA EVALUATION DETAILS ===")
        logger.info(f"Raw success: {recaptcha_result.get('raw_success', False)}")
        logger.info(f"Score: {recaptcha_result.get('score', 0.0)}")
        logger.info(f"Action: {recaptcha_result.get('action', 'N/A')}")
        logger.info(f"Hostname: {recaptcha_result.get('hostname', 'N/A')}")
        logger.info(f"Challenge timestamp: {recaptcha_result.get('challenge_ts', 'N/A')}")
        logger.info(f"Error codes: {recaptcha_result.get('error_codes', [])}")
        
        # Evaluación del score
        score = recaptcha_result.get('score', 0.0)
        if score >= 0.9:
            logger.info("🔵 reCAPTCHA Score: EXCELLENT (≥0.9) - Very likely human")
        elif score >= 0.7:
            logger.info("🟢 reCAPTCHA Score: GOOD (0.7-0.9) - Likely human")
        elif score >= 0.5:
            logger.info("🟡 reCAPTCHA Score: MEDIUM (0.5-0.7) - Possibly human")
        elif score >= 0.3:
            logger.info("🟠 reCAPTCHA Score: LOW (0.3-0.5) - Possibly bot")
        else:
            logger.info("🔴 reCAPTCHA Score: VERY LOW (<0.3) - Very likely bot")
        
        # Evaluación de la acción
        action = recaptcha_result.get('action', '')
        if action == 'submit':
            logger.info("✅ Action: CORRECT ('submit')")
        else:
            logger.warning(f"⚠️ Action: UNEXPECTED ('{action}') - Expected 'submit'")
        
        # Evaluación del hostname
        hostname = recaptcha_result.get('hostname', '')
        expected_hostname = 'metodovende.es'
        if hostname == expected_hostname:
            logger.info(f"✅ Hostname: CORRECT ('{hostname}')")
        else:
            logger.warning(f"⚠️ Hostname: MISMATCH ('{hostname}') - Expected '{expected_hostname}'")
        
        logger.info("=== END reCAPTCHA EVALUATION ===")
        
        # Generar reporte detallado
        recaptcha_report = generate_recaptcha_report(recaptcha_result)
        logger.info(f"reCAPTCHA Report: {json.dumps(recaptcha_report, indent=2)}")
        
        # Validación básica (mantener la lógica actual)
        if not recaptcha_result['success']:
            logger.warning(f"reCAPTCHA validation failed: {recaptcha_result.get('error_codes', [])}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Verificación de reCAPTCHA fallida',
                    'recaptcha_errors': recaptcha_result.get('error_codes', [])
                })
            }
        
        logger.info(f"reCAPTCHA validation successful for hostname: {recaptcha_result.get('hostname', '')}")
        
        # ===== PROCESAMIENTO PRINCIPAL =====
        # Aquí puedes agregar tu lógica de procesamiento principal
        # Por ejemplo: enviar email, guardar en base de datos, etc.
        
        # ===== ENVÍO A SERVICIOS EXTERNOS =====
        results = {
            'recaptcha_verified': True,
            'hostname': recaptcha_result.get('hostname', ''),
            'mailchimp': None,
            'meta_capi': None
        }
        
        # Verificar consentimiento de cookies
        consent_cookies = form_data.get('consentCookies', 'false')
        logger.info(f"User consent for cookies: {consent_cookies}")
        
        # Enviar a Mailchimp (siempre que esté configurado)
        logger.info("Sending to Mailchimp...")
        mailchimp_result = send_to_mailchimp(form_data)
        results['mailchimp'] = mailchimp_result
        
        # Enviar a Meta CAPI SOLO si el usuario aceptó las cookies
        if consent_cookies == 'true':
            logger.info("User accepted cookies - sending to Meta CAPI...")
            meta_result = send_to_meta_capi(form_data)
            results['meta_capi'] = meta_result
        else:
            logger.info("User did not accept cookies - skipping Meta CAPI")
            results['meta_capi'] = {
                'success': False, 
                'skipped': True, 
                'reason': 'User did not accept cookies'
            }
        
        # ===== RESPUESTA EXITOSA =====
        logger.info("Form processing completed successfully")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'message': 'Formulario enviado exitosamente',
                'results': results,
                'recaptcha_evaluation': recaptcha_report
            })
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': 'JSON inválido en el body de la request'
            })
        }
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': f'Error interno del servidor: {str(e)}'
            })
        }

# Función para manejar OPTIONS requests (CORS)
def lambda_handler_options(event, context):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        'body': json.dumps({'message': 'OK'})
    } 