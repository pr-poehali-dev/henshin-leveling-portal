import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления услугами прокачки, заявками и настройками сайта
    Args: event - HTTP запрос, context - контекст выполнения
    Returns: JSON ответ с данными
    '''
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('queryStringParameters', {}).get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    
    try:
        if path == 'settings' and method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, site_name, site_description FROM site_settings ORDER BY id DESC LIMIT 1')
                settings = cur.fetchone()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(settings) if settings else {}),
                    'isBase64Encoded': False
                }
        
        elif path == 'settings' and method == 'PUT':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE site_settings SET site_name = %s, site_description = %s, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
                    (body_data.get('site_name'), body_data.get('site_description'))
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'services' and method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, title, description, requirements, price, is_active FROM services WHERE is_active = true ORDER BY id')
                services = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(s) for s in services]),
                    'isBase64Encoded': False
                }
        
        elif path == 'services' and method == 'POST':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO services (title, description, requirements, price) VALUES (%s, %s, %s, %s)',
                    (body_data.get('title'), body_data.get('description'), body_data.get('requirements'), body_data.get('price'))
                )
                conn.commit()
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'services/update' and method == 'PUT':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE services SET title = %s, description = %s, requirements = %s, price = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (body_data.get('title'), body_data.get('description'), body_data.get('requirements'), body_data.get('price'), body_data.get('id'))
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'orders' and method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO orders (service_id, phone, game_uid, telegram, status) VALUES (%s, %s, %s, %s, %s)',
                    (body_data.get('service_id'), body_data.get('phone'), body_data.get('game_uid'), body_data.get('telegram'), 'pending')
                )
                conn.commit()
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'orders' and method == 'GET':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    SELECT o.id, o.service_id, o.phone, o.game_uid, o.telegram, o.status, s.title as service_title 
                    FROM orders o 
                    JOIN services s ON o.service_id = s.id 
                    ORDER BY o.id DESC
                ''')
                orders = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(o) for o in orders]),
                    'isBase64Encoded': False
                }
        
        elif path == 'orders/status' and method == 'PUT':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE orders SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (body_data.get('status'), body_data.get('order_id'))
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'services/delete' and method == 'PUT':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            body_data = json.loads(event.get('body', '{}'))
            with conn.cursor() as cur:
                cur.execute(
                    'UPDATE services SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                    (body_data.get('id'),)
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif path == 'services/all' and method == 'GET':
            headers = event.get('headers', {})
            if headers.get('x-admin-auth') != 'skzry:568876Qqq':
                return {'statusCode': 403, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Unauthorized'}), 'isBase64Encoded': False}
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, title, description, requirements, price, is_active FROM services ORDER BY id')
                services = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(s) for s in services]),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()