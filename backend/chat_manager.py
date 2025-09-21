import os
import json
import time

CHAT_SESSIONS_DIR = "chat_sessions"
METADATA_FILE = os.path.join(CHAT_SESSIONS_DIR, "metadata.json")

os.makedirs(CHAT_SESSIONS_DIR, exist_ok=True)

def get_all_chats():
    if not os.path.exists(METADATA_FILE):
        return []
    try:
        with open(METADATA_FILE, 'r') as f:
            metadata = json.load(f)
        return sorted(metadata, key=lambda x: x.get('timestamp', 0), reverse=True)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def get_chat_history(chat_id):
    chat_file = os.path.join(CHAT_SESSIONS_DIR, f"{chat_id}.json")
    if not os.path.exists(chat_file):
        return []
    with open(chat_file, 'r') as f:
        return json.load(f)

def create_new_chat():
    chat_id = f"chat_{int(time.time())}"
    chat_file = os.path.join(CHAT_SESSIONS_DIR, f"{chat_id}.json")
    
    with open(chat_file, 'w') as f:
        json.dump([], f)
        
    all_chats = get_all_chats()
    new_chat_metadata = {
        "id": chat_id,
        "title": "New Chat",
        "timestamp": int(time.time()),
        "last_persona": "empathizer"
    }
    # Bugfix: Use insert(0, ...) to add to the top of the list
    all_chats.insert(0, new_chat_metadata)
    
    with open(METADATA_FILE, 'w') as f:
        json.dump(all_chats, f, indent=2)
        
    return new_chat_metadata

def save_message(chat_id, role, content, persona):
    chat_history = get_chat_history(chat_id)
    
    # --- KEY CHANGE: Add persona to the message object if role is assistant ---
    new_message = {"role": role, "content": content}
    if role == 'assistant':
        new_message['persona'] = persona
    
    chat_history.append(new_message)
    
    chat_file = os.path.join(CHAT_SESSIONS_DIR, f"{chat_id}.json")
    with open(chat_file, 'w') as f:
        json.dump(chat_history, f, indent=2)

    all_chats = get_all_chats()
    # Check if this is the very first message from the user to set the title
    is_first_user_message = len(chat_history) == 1 and role == 'user'

    for chat in all_chats:
        if chat['id'] == chat_id:
            # Only update the chat's last_persona on an assistant's reply
            if role == 'assistant':
                chat['last_persona'] = persona
            if is_first_user_message:
                chat['title'] = content[:35] + '...' if len(content) > 35 else content
            break
            
    with open(METADATA_FILE, 'w') as f:
        json.dump(all_chats, f, indent=2)

# --- UPDATED DELETE FUNCTION WITH ERROR HANDLING ---
def delete_chat(chat_id):
    try:
        chat_file = os.path.join(CHAT_SESSIONS_DIR, f"{chat_id}.json")
        if os.path.exists(chat_file):
            os.remove(chat_file)

        all_chats = get_all_chats()
        updated_chats = [chat for chat in all_chats if chat['id'] != chat_id]
        
        with open(METADATA_FILE, 'w') as f:
            json.dump(updated_chats, f, indent=2)
            
        return {"status": "success", "message": f"Chat {chat_id} deleted."}
    except (IOError, OSError) as e:
        print(f"Error deleting chat {chat_id}: {e}")
        return {"status": "error", "message": "Could not delete chat files. Check server permissions."}