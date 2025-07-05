import requests
import json
import os
from typing import Dict, Any

# Configuración de reCAPTCHA
RECAPTCHA_CONFIG = {
    'development': {
        'site_key': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        'secret_key': '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    },
    'production': {
        'site_key': '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL',
        'secret_key': 'TU_SECRET_KEY_AQUI'  # Reemplazar con tu secret key real
    }
}

def verify_recaptcha(token: str, environment: str = 'production') -> Dict[str, Any]:
    """
    Verifica el token de reCAPTCHA con Google
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
        
        return {
            'success': result.get('success', False),
            'score': result.get('score', 0.0),
            'action': result.get('action', ''),
            'challenge_ts': result.get('challenge_ts', ''),
            'hostname': result.get('hostname', ''),
            'error_codes': result.get('error-codes', [])
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': f'Error de verificación: {str(e)}'
        }

def lambda_handler(event, context):
    """
    Tu endpoint submit-form modificado para incluir validación de reCAPTCHA
    """
    try:
        # Parsear el body
        if isinstance(event['body'], str):
            body = json.loads(event['body'])
        else:
            body = event['body']
        
        # Extraer datos del formulario
        form_data = {
            'name': body.get('name', ''),
            'email': body.get('email', ''),
            'phone': body.get('phone', ''),
            'operation': body.get('operation', ''),
            'zone': body.get('zone', ''),
            'barrio': body.get('barrio', ''),  # Campo adicional que usas
            'recaptchaToken': body.get('recaptchaToken', '')
        }
        
        # ===== VALIDACIÓN DE reCAPTCHA =====
        if not form_data['recaptchaToken']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Token de reCAPTCHA requerido'
                })
            }
        
        # Verificar reCAPTCHA
        recaptcha_result = verify_recaptcha(
            form_data['recaptchaToken'],
            environment='production'  # Cambiar según el entorno
        )
        
        if not recaptcha_result['success']:
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
        
        # ===== TU LÓGICA EXISTENTE =====
        # Aquí va todo tu código actual de procesamiento del formulario
        
        # Ejemplo: Validar campos requeridos
        required_fields = ['name', 'email', 'operation', 'zone']
        missing_fields = [field for field in required_fields if not form_data[field]]
        
        if missing_fields:
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
        
        # ===== PROCESAMIENTO DEL FORMULARIO =====
        # Aquí va tu lógica actual:
        # - Enviar email
        # - Guardar en base de datos
        # - Enviar a Mailchimp
        # - etc.
        
        # Ejemplo de procesamiento:
        try:
            # Tu código existente aquí...
            # send_email(form_data)
            # save_to_database(form_data)
            # send_to_mailchimp(form_data)
            
            print(f"✅ Formulario procesado exitosamente para: {form_data['email']}")
            print(f"✅ reCAPTCHA verificado para hostname: {recaptcha_result.get('hostname', '')}")
            
        except Exception as e:
            print(f"❌ Error procesando formulario: {str(e)}")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'error': 'Error procesando el formulario'
                })
            }
        
        # ===== RESPUESTA EXITOSA =====
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
                'recaptcha_verified': True,
                'hostname': recaptcha_result.get('hostname', '')
            })
        }
        
    except Exception as e:
        print(f"💥 Error general en lambda_handler: {str(e)}")
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

# Ejemplo de cómo integrar con tu código existente
def your_existing_email_function(form_data):
    """
    Aquí va tu función existente de envío de email
    """
    # Tu código actual aquí
    pass

def your_existing_mailchimp_function(form_data):
    """
    Aquí va tu función existente de Mailchimp
    """
    # Tu código actual aquí
    pass

def your_existing_database_function(form_data):
    """
    Aquí va tu función existente de base de datos
    """
    # Tu código actual aquí
    pass 