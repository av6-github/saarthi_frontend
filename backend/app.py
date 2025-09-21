import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

import chat_manager
from prompts import get_prompt

# --- MODEL INITIALIZATION ---
print("Initializing models...")
genai.configure(api_key="AIzaSyCLiDLe--z9ihkwmIh8-V8gLOpo7HGQ2g4")
embedding_model = SentenceTransformer("all-mpnet-base-v2")
generative_model = genai.GenerativeModel("gemini-1.5-flash")

print("Loading FAISS index and documents...")
faiss_index = faiss.read_index("faiss_index.bin")
with open("documents_for_faiss.json", "r", encoding="utf-8") as f:
    documents = json.load(f)
print("✅ Initialization complete.")
# --- END INITIALIZATION ---

app = Flask(__name__)
# More specific CORS setup to ensure DELETE is allowed
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "DELETE"]}})

def retrieve_context(user_query, top_k=5):
    query_embedding = embedding_model.encode(user_query)
    query_vector = np.array([query_embedding]).astype("float32")
    distances, indices = faiss_index.search(query_vector, top_k)
    return [documents[i]['content'] for i in indices[0]]

@app.route('/api/chats', methods=['GET'])
def get_chats():
    return jsonify(chat_manager.get_all_chats())

# --- CORRECTED ROUTE FOR GET AND DELETE ---
@app.route('/api/chats/<chat_id>', methods=['GET', 'DELETE'])
def handle_specific_chat(chat_id):
    if request.method == 'GET':
        return jsonify(chat_manager.get_chat_history(chat_id))
    
    elif request.method == 'DELETE':
        result = chat_manager.delete_chat(chat_id)
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 500

@app.route('/api/new_chat', methods=['POST'])
def new_chat():
    new_chat_meta = chat_manager.create_new_chat()
    return jsonify(new_chat_meta)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_query = data.get('message')
    chat_id = data.get('chatId')
    persona = data.get('persona')
    
    if not all([user_query, chat_id, persona]):
        return jsonify({"error": "Missing data"}), 400

    # User message is saved without a persona in the message object itself
    chat_manager.save_message(chat_id, 'user', user_query, persona) 
    
    chat_history = chat_manager.get_chat_history(chat_id)
    
    history_text = ""
    for turn in chat_history[-10:]:
        role = "User" if turn['role'] == 'user' else "Assistant"
        history_text += f"{role}: {turn['content']}\n"
        
    context_chunks = retrieve_context(user_query)
    context_text = "\n\n".join(context_chunks)
    
    prompt = get_prompt(persona, history_text, context_text, user_query)
    
    response = generative_model.generate_content(prompt)
    bot_reply = response.text
    
    # Assistant message is saved WITH the persona in the message object
    chat_manager.save_message(chat_id, 'assistant', bot_reply, persona)
    
    # --- KEY CHANGE: Return the persona with the live message ---
    return jsonify({"role": "assistant", "content": bot_reply, "persona": persona})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)