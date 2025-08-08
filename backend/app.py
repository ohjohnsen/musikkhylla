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
    # Sample album data with more variety
    albums = [
        {
            'id': 1,
            'title': 'Abbey Road',
            'artist': 'The Beatles',
            'year': 1969,
            'coverUrl': 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Abbey+Road',
            'spotifyUrl': 'https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 2,
            'title': 'Dark Side of the Moon',
            'artist': 'Pink Floyd',
            'year': 1973,
            'coverUrl': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Dark+Side',
            'spotifyUrl': 'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 3,
            'title': 'Thriller',
            'artist': 'Michael Jackson',
            'year': 1982,
            'coverUrl': 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=Thriller',
            'spotifyUrl': 'https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 4,
            'title': 'Nevermind',
            'artist': 'Nirvana',
            'year': 1991,
            'coverUrl': 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Nevermind',
            'spotifyUrl': 'https://open.spotify.com/album/2UJcKiJxNryhL050F5Z1Fk',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 5,
            'title': 'Kind of Blue',
            'artist': 'Miles Davis',
            'year': 1959,
            'coverUrl': 'https://via.placeholder.com/300x300/0066CC/FFFFFF?text=Kind+of+Blue',
            'spotifyUrl': 'https://open.spotify.com/album/1weenld61qoidwYuZ1GESA',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 6,
            'title': 'OK Computer',
            'artist': 'Radiohead',
            'year': 1997,
            'coverUrl': 'https://via.placeholder.com/300x300/008000/FFFFFF?text=OK+Computer',
            'spotifyUrl': 'https://open.spotify.com/album/6dVIqQ8qmQ5GBnJ9shOYGE',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 7,
            'title': 'The Wall',
            'artist': 'Pink Floyd',
            'year': 1979,
            'coverUrl': 'https://via.placeholder.com/300x300/8B0000/FFFFFF?text=The+Wall',
            'spotifyUrl': 'https://open.spotify.com/album/5Dbax7G8SWrP9xyzkOvy2F',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        },
        {
            'id': 8,
            'title': 'Back to Black',
            'artist': 'Amy Winehouse',
            'year': 2006,
            'coverUrl': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Back+to+Black',
            'spotifyUrl': 'https://open.spotify.com/album/17VdZ8XLcbNZheyNDjRzPo',
            'appleMusicUrl': '#',
            'tidalUrl': '#'
        }
    ]
    return jsonify({'albums': albums})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(debug=True, host='0.0.0.0', port=port)
