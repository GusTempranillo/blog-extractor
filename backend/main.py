import os
from flask import Flask
from routes import blog_extractor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(blog_extractor.bp)

@app.route('/')
def home():
    return "API de extracción de blogs funcionando."

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
