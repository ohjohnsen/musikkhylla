from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health():
    return jsonify({'message': 'Musikkhylla API is running!'})

@app.route('/api/albums')
def get_albums():
    # TODO: Implement album fetching
    albums = [
        {
            'id': 1,
            'title': 'Sample Album',
            'artist': 'Sample Artist',
            'year': 2023,
            'coverUrl': 'https://via.placeholder.com/300x300',
            'spotifyUrl': '#',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        }
    ]
    return jsonify({'albums': albums})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(debug=True, host='0.0.0.0', port=port)
