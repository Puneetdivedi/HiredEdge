import os
from dotenv import load_dotenv
import google.generativeai as genai

base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)
