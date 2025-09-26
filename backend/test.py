import google.generativeai as genai

# --- IMPORTANT ---
# Paste the same API key you are using in your app.py file
API_KEY = "AIzaSyAV9tbwKNq1GYWpUkh0-dkzTineECCDXUI" 

print("Configuring API key...")
genai.configure(api_key=API_KEY)

try:
    print("Initializing model: gemini-2.5-flash-latest...")
    # Use the correct model name
    model = genai.GenerativeModel('gemini-2.5-flash')

    print("Sending a test prompt to the model...")
    response = model.generate_content("Explain what a large language model is in one sentence.")

    print("\n--- SUCCESS ---")
    print(response.text)
    print("-----------------\n")
    print("✅ Your environment and API key are working correctly!")

except Exception as e:
    print("\n--- ERROR ---")
    print(f"An error occurred: {e}")
    print("-----------------\n")
    print("❌ There is an issue with your API key, project setup, or network connection.")
