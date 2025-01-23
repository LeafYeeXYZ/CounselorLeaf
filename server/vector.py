from flask import Flask, request, jsonify
from transformers import AutoModel

app = Flask(__name__)

model = AutoModel.from_pretrained('jinaai/jina-embeddings-v3', trust_remote_code=True)

@app.route('/v1/embeddings', methods=['POST'])
def embed_text():
  data = request.json
  texts = data.get('input', [])
  
  if not texts:
    return jsonify({
      'error': 'No input text provided'
    }), 400

  embeddings = model.encode(
    texts, 
    task='text-matching',
  )

  return jsonify({
    'data': [
      {
        'embedding': emb.tolist()
      } for emb in embeddings
    ]
  })

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5090)
