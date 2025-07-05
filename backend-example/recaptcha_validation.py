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
    
    Args:
        token: Token de reCAPTCHA enviado desde el frontend
        environment: 'development' o 'production'
    
    Returns:
        Dict con el resultado de la verificación
    """
    try:
        # Obtener la secret key según el entorno
        secret_key = RECAPTCHA_CONFIG[environment]['secret_key']
        
        # Verificar con Google reCAPTCHA API
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
            'score': result.get('score', 0.0),  # Para reCAPTCHA v3
            'action': result.get('action', ''),  # Para reCAPTCHA v3
            'challenge_ts': result.get('challenge_ts', ''),
            'hostname': result.get('hostname', ''),
            'error_codes': result.get('error-codes', [])
        }
        
    except requests.RequestException as e:
        return {
            'success': False,
            'error': f'Error de conexión: {str(e)}'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error inesperado: {str(e)}'
        }

def lambda_handler(event, context):
    """
    Ejemplo de Lambda function para procesar el formulario con validación de reCAPTCHA
    """
    try:
        # Parsear el body de la request
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
            'recaptchaToken': body.get('recaptchaToken', '')
        }
        
        # Validar que todos los campos requeridos estén presentes
        required_fields = ['name', 'email', 'operation', 'zone', 'recaptchaToken']
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
        
        # Si llegamos aquí, reCAPTCHA es válido
        # Aquí puedes procesar el formulario (enviar email, guardar en BD, etc.)
        
        # Ejemplo: Enviar email
        # send_email(form_data)
        
        # Ejemplo: Guardar en base de datos
        # save_to_database(form_data)
        
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

# Ejemplo de uso
if __name__ == "__main__":
    # Test con token de prueba
    test_token = "test_token"
    result = verify_recaptcha(test_token, 'development')
    print(f"Resultado de verificación: {result}") 