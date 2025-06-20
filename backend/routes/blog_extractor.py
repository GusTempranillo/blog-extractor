from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from io import StringIO

bp = Blueprint('blog_extractor', __name__)

@bp.route('/extract', methods=['POST'])
def extract():
    data = request.get_json()
    url = data.get('url')
    n = int(data.get('max', 5))

    if not url.endswith('/'):
        url += '/'
    feed_url = url + 'feed/'

    try:
        r = requests.get(feed_url)
        soup = BeautifulSoup(r.content, 'xml')
        items = soup.find_all('item')[:n]

        posts = []
        for item in items:
            titulo = item.title.get_text(strip=True)
            fecha = item.pubDate.get_text(strip=True)
            fecha_formateada = datetime.strptime(fecha, '%a, %d %b %Y %H:%M:%S %z').date()
            link = item.link.get_text(strip=True)
            contenido = item.find('content:encoded') or item.find('description')
            contenido_texto = BeautifulSoup(contenido.get_text(), 'html.parser').get_text(strip=True) if contenido else ""
            resumen = " ".join(contenido_texto.split()[:60]) + "..."
            posts.append({
                "Fecha": fecha_formateada,
                "Título": titulo,
                "Contenido": contenido_texto,
                "Resumen": resumen
            })

        df = pd.DataFrame(posts)
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False, encoding='utf-8')
        return csv_buffer.getvalue()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
