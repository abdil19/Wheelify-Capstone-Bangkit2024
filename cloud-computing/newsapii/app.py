from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# API Key untuk layanan berita
NEWS_API_KEY = "98a2c61bc3d840c9853a8d1754607bd3"
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

@app.route('/', methods=['GET'])
def home():
    """
    Endpoint untuk root. Menyediakan informasi penggunaan API.
    """
    return jsonify({
        'message': 'Welcome to the News API! Use /news endpoint to fetch news.',
        'endpoints': {
            '/news': {
                'description': 'Get the latest news.',
                'query_parameters': {
                    'country': 'Country code (e.g., us, id). Default: us.',
                    'category': 'News category (e.g., technology, sports). Default: general.'
                }
            }
        }
    })

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    """
    Menghandle permintaan favicon.ico agar tidak memberikan error 404.
    """
    return '', 204  # Mengembalikan respons kosong dengan status code 204 (No Content)

@app.route('/news', methods=['GET'])
def get_news():
    """
    Endpoint untuk mengambil berita terbaru.
    Query parameters:
      - country: Kode negara (e.g., 'us', 'id'). Default: 'us'
      - category: Kategori berita (e.g., 'technology', 'sports'). Default: 'general'
    Response:
      - Berita dengan judul, deskripsi, URL gambar, dan URL artikel.
    """
    try:
        # Ambil parameter dari URL
        country = request.args.get('country', 'us')  # Default: US
        category = request.args.get('category', 'general')  # Default: General

        # Kirim request ke News API
        response = requests.get(NEWS_API_URL, params={
            'apiKey': NEWS_API_KEY,
            'country': country,
            'category': category,
        })

        # Cek status code dari response
        if response.status_code == 200:
            news_data = response.json()
            articles = news_data.get('articles', [])

            # Jika tidak ada artikel ditemukan
            if not articles:
                return jsonify({'status': 'success', 'message': 'No articles found.'})

            # Format ulang data artikel
            formatted_articles = []
            for article in articles:
                title = article.get('title', 'No title available')
                description = article.get('description', 'No description available')
                image = article.get('urlToImage', 'No image available')
                url = article.get('url', 'No URL available')

                formatted_articles.append({
                    'title': title,
                    'description': description,
                    'image': image,
                    'url': url
                })

            # Kirim respons JSON ke client
            return jsonify({'status': 'success', 'articles': formatted_articles})
        else:
            # Jika response dari News API tidak OK
            error_message = response.json()
            return jsonify({'status': 'error', 'message': error_message}), response.status_code
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Jalankan aplikasi
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
