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
        recommended_action = "ALLOW"
        action_description = "Permitir acceso completo"
    elif score >= 0.7:
        score_category = "GOOD"
        score_description = "Likely human"
        score_emoji = "🟢"
        recommended_action = "ALLOW"
        action_description = "Permitir acceso completo"
    elif score >= 0.5:
        score_category = "MEDIUM"
        score_description = "Possibly human"
        score_emoji = "🟡"
        recommended_action = "ALLOW_WITH_MONITORING"
        action_description = "Permitir pero monitorear"
    elif score >= 0.3:
        score_category = "LOW"
        score_description = "Possibly bot"
        score_emoji = "🟠"
        recommended_action = "CHALLENGE"
        action_description = "Solicitar verificación adicional"
    else:
        score_category = "VERY_LOW"
        score_description = "Very likely bot"
        score_emoji = "🔴"
        recommended_action = "BLOCK"
        action_description = "Bloquear acceso"
    
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
            'emoji': score_emoji,
            'recommended_action': recommended_action,
            'action_description': action_description
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

def execute_recaptcha_action(recaptcha_report: dict, form_data: dict) -> dict:
    """
    Ejecuta acciones automáticas basadas en la evaluación de reCAPTCHA
    """
    score = recaptcha_report['score']
    recommended_action = score['recommended_action']
    score_value = score['value']
    
    logger.info(f"=== EXECUTING reCAPTCHA ACTION: {recommended_action} ===")
    logger.info(f"Score: {score_value} - {score['category']}")
    logger.info(f"Action Description: {score['action_description']}")
    
    actions_taken = {
        'recommended_action': recommended_action,
        'action_description': score['action_description'],
        'actions_executed': [],
        'blocked': False,
        'monitored': False,
        'challenged': False
    }
    
    # ===== ACCIONES AUTOMÁTICAS =====
    
    if recommended_action == "BLOCK":
        # Score muy bajo - Bloquear completamente
        logger.warning(f"🚫 BLOCKING: Score too low ({score_value}) - Very likely bot")
        actions_taken['actions_executed'].append("BLOCKED_ACCESS")
        actions_taken['blocked'] = True
        
        # No enviar a servicios externos
        return {
            'success': False,
            'blocked': True,
            'reason': f"reCAPTCHA score too low: {score_value}",
            'actions_taken': actions_taken
        }
    
    elif recommended_action == "CHALLENGE":
        # Score bajo - Añadir verificación adicional
        logger.warning(f"⚠️ CHALLENGE: Score low ({score_value}) - Additional verification needed")
        actions_taken['actions_executed'].append("FLAGGED_FOR_REVIEW")
        actions_taken['challenged'] = True
        
        # Enviar a servicios pero marcar para revisión
        # Aquí podrías implementar lógica adicional como:
        # - Enviar email de alerta al admin
        # - Guardar en base de datos para revisión manual
        # - Añadir delay artificial
        
    elif recommended_action == "ALLOW_WITH_MONITORING":
        # Score medio - Permitir pero monitorear
        logger.info(f"👁️ MONITORING: Score medium ({score_value}) - Allowing with monitoring")
        actions_taken['actions_executed'].append("MONITORING_ENABLED")
        actions_taken['monitored'] = True
        
        # Enviar a servicios pero con logging adicional
        # Aquí podrías implementar:
        # - Logging detallado
        # - Métricas de monitoreo
        # - Alertas si hay patrones sospechosos
    
    elif recommended_action == "ALLOW":
        # Score alto - Permitir sin restricciones
        logger.info(f"✅ ALLOWING: Score good ({score_value}) - Full access granted")
        actions_taken['actions_executed'].append("FULL_ACCESS_GRANTED")
    
    # ===== ACCIONES ESPECÍFICAS POR SERVICIO =====
    
    # Mailchimp - Enviar siempre (excepto si está bloqueado)
    if not actions_taken['blocked']:
        logger.info("📧 Sending to Mailchimp...")
        mailchimp_result = send_to_mailchimp(form_data)
        actions_taken['actions_executed'].append(f"MAILCHIMP_{'SUCCESS' if mailchimp_result['success'] else 'FAILED'}")
    else:
        logger.info("📧 Skipping Mailchimp - User blocked")
        actions_taken['actions_executed'].append("MAILCHIMP_SKIPPED")
    
    # Meta CAPI - Solo si aceptó cookies Y no está bloqueado
    if not actions_taken['blocked'] and form_data.get('consentCookies') == 'true':
        logger.info("📊 Sending to Meta CAPI...")
        meta_result = send_to_meta_capi(form_data)
        actions_taken['actions_executed'].append(f"META_CAPI_{'SUCCESS' if meta_result['success'] else 'FAILED'}")
    else:
        logger.info("📊 Skipping Meta CAPI - User blocked or no consent")
        actions_taken['actions_executed'].append("META_CAPI_SKIPPED")
    
    # ===== ACCIONES DE MONITOREO =====
    
    if actions_taken['monitored']:
        # Implementar acciones de monitoreo
        logger.info("🔍 Adding monitoring data...")
        actions_taken['actions_executed'].append("MONITORING_DATA_LOGGED")
        
        # Aquí podrías:
        # - Guardar en CloudWatch Metrics
        # - Enviar a sistema de alertas
        # - Registrar en base de datos de monitoreo
    
    if actions_taken['challenged']:
        # Implementar acciones de challenge
        logger.info("🚨 Adding challenge data...")
        actions_taken['actions_executed'].append("CHALLENGE_DATA_LOGGED")
        
        # Aquí podrías:
        # - Enviar email de alerta
        # - Guardar para revisión manual
        # - Implementar rate limiting
    
    logger.info(f"=== COMPLETED reCAPTCHA ACTIONS ===")
    logger.info(f"Actions taken: {actions_taken['actions_executed']}")
    
    return {
        'success': not actions_taken['blocked'],
        'blocked': actions_taken['blocked'],
        'actions_taken': actions_taken
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
        
        # ===== EJECUTAR ACCIONES AUTOMÁTICAS BASADAS EN reCAPTCHA =====
        logger.info("Executing automatic actions based on reCAPTCHA evaluation...")
        action_result = execute_recaptcha_action(recaptcha_report, form_data)
        
        # Si está bloqueado, retornar error
        if action_result['blocked']:
            logger.warning(f"🚫 User blocked due to reCAPTCHA score")
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Access denied due to security check',
                    'recaptcha_evaluation': recaptcha_report,
                    'actions_taken': action_result['actions_taken']
                })
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
                'success': True,
                'message': 'Formulario enviado exitosamente',
                'recaptcha_evaluation': recaptcha_report,
                'actions_taken': action_result['actions_taken']
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