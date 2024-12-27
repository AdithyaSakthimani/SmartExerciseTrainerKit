from flask import Flask, jsonify, request
import subprocess
import threading
import psutil
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow cross-origin requests

# Initialize an in-memory variable to store the summary
exercise_summary = {}

# Function to run the Streamlit app in a separate process
def run_streamlit():
    os.system("streamlit run ExerciseFile.py")  # Adjust the path if necessary

@app.route('/start_video', methods=['POST'])
def start_video():
    # Start Streamlit in a separate thread
    threading.Thread(target=run_streamlit).start()
    return jsonify({"status": "Streamlit app started"}), 200

@app.route('/stop_video', methods=['POST'])
def stop_video():
    # Find and terminate the Streamlit process
    for proc in psutil.process_iter():
        if "streamlit" in proc.name().lower():
            proc.terminate()  # Terminates the Streamlit process
            return jsonify({"status": "Streamlit app stopped"}), 200
    return jsonify({"status": "No running Streamlit process found"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Ensure Flask is running on port 5000
