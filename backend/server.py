import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

def get_response(user_query):
    template = """

    You are a doctor AI assistant. Your main task is to provide medical diagnosis, recommend lab tests and investigations,
      and prescribe the appropriate drugs based on the user's input reply in English only.
    User's input: {user_query}
    Based on the user's input, provide a helpful and detailed response your answers must be always in English only in English regardless of the user's input language.
    follow the following format :
    based on the descrbied case
    The diagnosis : 
    The recommended lab test and investigation: list them 
    Drug prescriptions: prescribe the appropriate drugs based on the diagnosis
    Recommendations to The Doctor: recommend the doctor with regards to case what they supposed to do ?
    Treatment plan : set the appropriate treatment plan for the doctor including the steps to treat the Patient
    Please stricly adhere to the above format wherever asked , be more specific and detailed in your answers 

    """

    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatOpenAI(model="gpt-4o")
    chain = prompt | llm | StrOutputParser()

    return chain.invoke({
        "user_query": user_query,
    })

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_query = data.get("input")

    if not user_query:
        return jsonify({"error": "User input is required"}), 400

    try:
        response = get_response(user_query)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
