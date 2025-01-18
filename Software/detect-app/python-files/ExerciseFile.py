import streamlit as st
import cv2
import mediapipe as mp
import numpy as np
import pymongo
from datetime import datetime
import warnings
import os
import requests
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
# Suppress warnings
warnings.filterwarnings("ignore")
# MongoDB connection setup
uri = "mongodb+srv://MidnightGamer:Tester123@cluster0.wqmrn.mongodb.net/ChatSpace?retryWrites=true&w=majority&appName=Cluster0"
client = pymongo.MongoClient(uri)
db = client['ChatSpace']
collection = db['feedbacks']

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

if 'workout_finished' not in st.session_state:
    st.session_state.workout_finished = False
if 'Squat_counter' not in st.session_state:
    st.session_state.Squat_counter = 0
if 'bicep_counter_left' not in st.session_state:
    st.session_state.bicep_counter_left = 0
if 'bicep_counter_right' not in st.session_state:
    st.session_state.bicep_counter_right = 0
if 'pushup_counter' not in st.session_state:
    st.session_state.pushup_counter = 0
if 'stage_pushup' not in st.session_state:
    st.session_state.stage_pushup = None
if 'stage_left' not in st.session_state:
    st.session_state.stage_left = None
if 'stage_right' not in st.session_state:
    st.session_state.stage_right = None
if 'stage_squat' not in st.session_state:
    st.session_state.stage_squat = None
if 'stage_crunch' not in st.session_state:
    st.session_state.stage_crunch = None
if 'stage_jumping_jack' not in st.session_state:
    st.session_state.stage_jumping_jack = None
if 'crunch_count' not in st.session_state:
    st.session_state.crunch_counter = 0
if 'jumping_jack_counter' not in st.session_state:
    st.session_state.jumping_jack_counter = 0
def get_user():
    url = "http://localhost:8001/getUsername"
    response = requests.get(url)
    data = response.json()
    print(data['username']) 
    return data['username']
username = get_user() or st.text_input("Enter your username", "")
def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def save_exercise_summary():
    total_bicep_curls = st.session_state.bicep_counter_left + st.session_state.bicep_counter_right
    exercise_data = {
        'username': username,
        'BicepCurlCnt': total_bicep_curls,
        'SquatCnt': st.session_state.Squat_counter,
        'PushUpCnt': st.session_state.pushup_counter,
        'CrunchCnt': st.session_state.crunch_counter,
        'JumpingJackCnt': st.session_state.jumping_jack_counter,
        'timestamp': datetime.now().date().isoformat()
    }
    
    try:
        collection.insert_one(exercise_data)
        st.success("Workout summary saved successfully!")
        st.session_state.workout_finished = True
        return True
    except Exception as e:
        st.error(f"Error saving to database: {str(e)}")
        return False

# Setup Mediapipe instance
selectExercise = st.selectbox("Select an Exercise",
                               ['Bicep Curl', 'Squats', 'Push-ups', 'Crunches', 'Jumping Jacks'])
st.title(f"Selected Exercise: {selectExercise}")

# Control buttons
col1, col2 = st.columns(2)
with col1:
    run_video = st.checkbox("Start Workout")
with col2:
    if st.button("Finish Workout") and username and not st.session_state.workout_finished:
        if save_exercise_summary():
            run_video = False

# Create a video capture object
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    st.error("Failed to open video capture. Please check your camera.")
else:
    st.markdown("""
        <style>
            .video-frame {
                display: flex;
                justify-content: center;
                width: 100%;
                margin-right:50px;
                border-radius:8px;
            }
            .video-frame img {
                width: 100%;
                border-radius:8px;
            }
        </style>
    """, unsafe_allow_html=True)

    if run_video:
        left_col, right_col = st.columns(2)
        
        # Display stats in left column
        with left_col:
            st.markdown("### Workout Summary")
            placeholder_stats = st.empty()
        
        # Create video frame placeholder
        frame_placeholder = right_col.empty()
        
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
                ret, frame = cap.read()

                if not ret or frame is None:
                    st.warning("Failed to capture image from the camera.")
                    break

                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                results = pose.process(image)
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                if results.pose_landmarks is not None:
                    landmarks = results.pose_landmarks.landmark

                    try:
                        if selectExercise == 'Bicep Curl':
                            # Bicep curl tracking
                            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                             landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                            left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                                          landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                            left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                                          landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                                              landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                            right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
                                           landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                            right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
                                           landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

                            angle_left = calculate_angle(left_shoulder, left_elbow, left_wrist)
                            angle_right = calculate_angle(right_shoulder, right_elbow, right_wrist)

                            if angle_left > 160:
                                st.session_state.stage_left = "down"
                            if angle_left < 30 and st.session_state.stage_left == "down":
                                st.session_state.stage_left = "up"
                                st.session_state.bicep_counter_left += 1

                            if angle_right > 160:
                                st.session_state.stage_right = "down"
                            if angle_right < 30 and st.session_state.stage_right == "down":
                                st.session_state.stage_right = "up"
                                st.session_state.bicep_counter_right += 1

                            cv2.putText(image, 'LEFT CURLS', (10, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.bicep_counter_left), (10, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                            cv2.putText(image, 'RIGHT CURLS', (120, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.bicep_counter_right), (120, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                        elif selectExercise == 'Squats':
                            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                                   landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                            angle_squat = calculate_angle(hip, knee, ankle)

                            if angle_squat > 160:
                                st.session_state.stage_squat = "up"
                            if angle_squat < 90 and st.session_state.stage_squat == "up":
                                st.session_state.stage_squat = "down"
                                st.session_state.Squat_counter += 1

                            cv2.putText(image, 'SQUATS', (240, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.Squat_counter), (240, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                        elif selectExercise == 'push-ups':
                            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                            elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                            wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                            angle_pushup = calculate_angle(shoulder, elbow, wrist)

                            if angle_pushup > 160:
                                st.session_state.stage_pushup = "up"
                            if angle_pushup < 90 and st.session_state.stage_pushup == "up":
                                st.session_state.stage_pushup = "down"
                                st.session_state.pushup_counter += 1

                            cv2.putText(image, 'Push-Ups', (240, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.pushup_counter), (240, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                        
                        elif selectExercise == 'Crunches':
                            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                                        landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

   
                            angle_crunch = calculate_angle(shoulder, hip, knee)
                            print(f"crunch_angle: {angle_crunch}")

                            if angle_crunch > 120: 
                                st.session_state.stage_crunch = "down"
                            elif angle_crunch < 90 and st.session_state.stage_crunch == "down":  
                                st.session_state.stage_crunch = "up"
                                st.session_state.crunch_counter += 1  

                            cv2.putText(image, 'Crunches:', (240, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.crunch_counter), (240, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)



                        elif selectExercise == 'Jumping Jacks':


                            left_hand = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,

                                     landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                            right_hand = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,

                                      landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

                            left_foot = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,

                                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                            right_foot = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,

                                      landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]


                            arm_spread = np.abs(left_hand[0] - right_hand[0])  # Horizontal spread for arms

                            leg_spread = np.abs(left_foot[0] - right_foot[0])  # Horizontal spread for legs



                            if arm_spread > 0.2 and leg_spread > 0.18:  # Adjust based on testing

                                st.session_state.stage_jumping_jack = "open"

                            if arm_spread < 0.18 and leg_spread < 0.15 and st.session_state.stage_jumping_jack == "open":
                                st.session_state.stage_jumping_jack = "close"

                                st.session_state.jumping_jack_counter += 1

                        # Display jumping jack count

                            cv2.putText(image, 'Jumping Jacks ', (240, 20),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
                            cv2.putText(image, str(st.session_state.jumping_jack_counter), (240, 60),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                        
                        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                                  mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                                                  mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2))
                        # Update stats
                        placeholder_stats.write(f"""
                        Total Bicep Curls: {st.session_state.bicep_counter_left + st.session_state.bicep_counter_right}
                        Squats: {st.session_state.Squat_counter}
                        Push-ups: {st.session_state.pushup_counter}
                        Crunches: {st.session_state.crunch_counter}
                        Jumping Jacks: {st.session_state.jumping_jack_counter}
                        """)
                        
                    except Exception as e:
                        st.error(f"Error processing video frame: {str(e)}")

                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                frame_placeholder.image(image, channels="RGB", use_container_width=True)

                # Check for workout finish
                if st.session_state.workout_finished or not run_video:
                    break

        cap.release()
    else:
        st.warning("Please enable video feed to start.")

# Display final stats if workout is finished
if st.session_state.workout_finished:
    st.markdown("### Final Workout Summary")
    st.write(f"Total Bicep Curls: {st.session_state.bicep_counter_left + st.session_state.bicep_counter_right}")
    st.write(f"Squats: {st.session_state.Squat_counter}")
    st.write(f"Push-ups: {st.session_state.pushup_counter}")
    st.write(f"Crunches: {st.session_state.crunch_counter}")
    st.write(f"Jumping Jacks : {st.session_state.jumping_jack_counter}")

# Add a reset button
if st.button("Reset Workout"):
    st.session_state.workout_finished = False
    st.session_state.Squat_counter = 0
    st.session_state.bicep_counter_left = 0
    st.session_state.bicep_counter_right = 0
    st.session_state.pushup_counter = 0
    st.session_state.stage_pushup = None
    st.session_state.stage_left = None
    st.session_state.stage_right = None
    st.session_state.stage_squat = None
    st.session_state.crunch_counter = 0; 
    st.session_state.jumping_jack_counter=0; 
    st.session_state.stage_jumping_jack = None
    st.experimental_rerun()