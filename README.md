# Smart Exercise Trainer Kit - Setup and Usage

This README provides instructions for setting up and running the Smart Exercise Trainer Kit, including the backend, frontend, and microcontroller code.

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (LTS version recommended)  
   Download: [https://nodejs.org/](https://nodejs.org/)

2. **Python** (version 3.8 or higher)  
   Download: [https://www.python.org/](https://www.python.org/)

3. Necessary dependencies listed in `requirements.txt` (for Python) and `package.json` (for Node.js).

4. Microcontroller development tools (specific to your hardware):
   - Code for the **master device** and **slave device** needs to be flashed onto the microcontrollers.

## Project Structure

The project is organized as follows:

```
project-root/
|-- my-backend/         # Backend directory (Node.js)
|   |-- package.json    # Backend dependencies
|
|-- python-files/       # Python scripts directory
|   |-- Streamlitfile.py  # Python file for visualization
|
|-- frontend/           # Frontend directory (React)
    |-- package.json    # Frontend dependencies

|-- microcontrollers/   # Microcontroller code
    |-- master/         # Code for the master device
    |-- slave/          # Code for the slave device
```

## Setup Instructions

### Step 1: Clone the Repository

Clone this repository to your local machine:
```bash
git clone <repository-url>
cd project-root
```

### Step 2: Install Dependencies

#### For Backend:
Navigate to the `my-backend` directory and install dependencies:
```bash
cd my-backend
npm install
```

#### For Python Scripts:
Navigate to the `python-files` directory and install dependencies:
```bash
cd python-files
pip install -r requirements.txt
```

#### For Frontend:
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

## Running the Application

### Step 1: Start the Backend
Navigate to the `my-backend` directory and run the backend in development mode:
```bash
cd my-backend
npm run dev
```

### Step 2: Start the Python Streamlit File
Navigate to the `python-files` directory and run the Python visualization script:
```bash
cd python-files
python Streamlitfile.py
```

### Step 3: Start the Frontend
Navigate to the `frontend` directory and start the React development server:
```bash
cd frontend
npm start
```

### Step 4: Deploy Microcontroller Code
1. **Master Device:** Flash the master device(Esp32) code located in `masterDevice_copy folder` to the appropriate microcontroller .
2. **Slave Device:** Flash the slave device(Esp8266) code located in `slaveDevice_copy folder` to the corresponding microcontroller.
3.**change the ssid , password , serverUrl:** change  the ssid , password to your wifi username and password and change the  serverUrl to "http://<your-ip-address>/sensordata"

The microcontrollers will handle:
- **Calorie Counting**
- **Heartbeat Monitoring**
- **Gyroscopic Values**

### Step 5: Connect and Run
Ensure that the microcontrollers are properly connected to the sensors and are communicating with each other.

## Accessing the Application
- Open your browser and navigate to `http://localhost:3000` to view the frontend.

## Notes
- Ensure that all microcontroller connections are secure and properly configured.
- Make sure to start all services in the correct order to avoid communication issues.
- If any service fails, check the terminal output for error messages and resolve missing dependencies or conflicts.

## Troubleshooting
- **Backend Issues:** Delete the `node_modules` folder in `my-backend` and run `npm install` again.
- **Python Issues:** Verify the Python version and ensure all dependencies are installed using `pip install -r requirements.txt`.
- **Frontend Issues:** Clear the cache by running `npm cache clean --force` and reinstall dependencies.
- **Microcontroller Issues:** Verify that the correct firmware is flashed and the devices are powered on.

---

Feel free to customize this README further based on your specific project requirements!

