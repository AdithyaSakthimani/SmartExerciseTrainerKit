import streamlit as st
import cv2
import mediapipe as mp
import numpy as np

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
if 'stage_plank' not in st.session_state:
    st.session_state.stage_plank = None
if 'plank_time' not in st.session_state:
    st.session_state.plank_time = 0
if 'stage_jumping_jack' not in st.session_state:
    st.session_state.stage_plank = None
if 'jumping_jack_counter' not in st.session_state:
    st.session_state.jumping_jack_counter = 0


# Function to calculate the angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle


# Streamlit UI setup
st.title("AI-Powered Exercise Tracker")
select_exercise = st.selectbox("Select an Exercise",
                               ['Bicep Curl', 'Squats', 'Push-ups', 'Plank', 'Jumping Jacks'])
run_video = st.checkbox("Start Camera")

# Create a video capture object
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    st.error("Failed to open the camera. Please check your device settings.")
else:
    # Placeholder for displaying the video frame
    video_placeholder = st.empty()

    # Mediapipe Pose detection setup
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while run_video and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                st.warning("Failed to capture the video frame. Check the camera connection.")
                break

            # Preprocess frame
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)

            # Recolor back to BGR for rendering
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                if results.pose_landmarks:
                    landmarks = results.pose_landmarks.landmark

                    # Exercise-specific logic
                    if select_exercise == 'Bicep Curl':
                        # Calculate angles for left and right arms
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

                        # Bicep Curl Counter Logic
                        if angle_left > 160:
                            stage_left = "down"
                        if angle_left < 30 and stage_left == "down":
                            stage_left = "up"
                            st.session_state.bicep_counter_left += 1

                        if angle_right > 160:
                            stage_right = "down"
                        if angle_right < 30 and stage_right == "down":
                            stage_right = "up"
                            st.session_state.bicep_counter_right += 1

                        # Display count on frame
                        cv2.putText(image, f"Left Bicep Curls: {st.session_state.bicep_counter_left}",
                                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        cv2.putText(image, f"Right Bicep Curls: {st.session_state.bicep_counter_right}",
                                    (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

                    elif select_exercise == 'Squats':
                        # Calculate angle for squats
                        hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                               landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                        ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                        angle_squat = calculate_angle(hip, knee, ankle)

                        if angle_squat > 160:
                            stage_squat = "up"
                        if angle_squat < 90 and stage_squat == "up":
                            stage_squat = "down"
                            st.session_state.Squat_counter += 1

                        cv2.putText(image, f"Squats: {st.session_state.Squat_counter}",
                                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

                    elif select_exercise == 'Push-ups':
                        # Calculate angle for push-ups
                        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                        angle_pushup = calculate_angle(shoulder, elbow, wrist)

                        if angle_pushup > 160:
                            stage_pushup = "up"
                        if angle_pushup < 90 and stage_pushup == "up":
                            stage_pushup = "down"
                            st.session_state.pushup_counter += 1

                        cv2.putText(image, f"Push-ups: {st.session_state.pushup_counter}",
                                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 255), 2)

                    elif select_exercise == 'Plank':
                        # Maintain straight body angle > 170
                        hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                               landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                        ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                        angle_plank = calculate_angle(hip, shoulder, ankle)

                        if angle_plank > 170:
                            stage_plank = "straight"
                            st.session_state.plank_time += 1  # Increment plank time
                        else:
                            stage_plank = "not straight"

                        cv2.putText(image, f"Plank Time: {st.session_state.plank_time} sec",
                                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)


                    elif select_exercise == 'Jumping Jacks':

                        # Debugging print statements

                        print("Landmarks detected for Jumping Jacks")

                        # Jumping jacks based on arm and leg spread

                        left_hand = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,

                                     landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

                        right_hand = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,

                                      landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

                        left_foot = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,

                                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                        right_foot = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,

                                      landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

                        # Calculate arm and leg spreads

                        arm_spread = np.abs(left_hand[0] - right_hand[0])  # Horizontal spread for arms

                        leg_spread = np.abs(left_foot[0] - right_foot[0])  # Horizontal spread for legs

                        print(f"Arm Spread: {arm_spread}, Leg Spread: {leg_spread}, Stage: {stage_jumping_jack}")

                        # Adjust thresholds as needed

                        if arm_spread > 0.3 and leg_spread > 0.2:  # Adjust based on testing

                            stage_jumping_jack = "open"

                        if arm_spread < 0.15 and leg_spread < 0.15 and stage_jumping_jack == "open":
                            stage_jumping_jack = "close"

                            st.session_state.jumping_jack_counter += 1

                        # Display jumping jack count

                        cv2.putText(image, f"Jumping Jacks: {st.session_state.jumping_jack_counter}",

                                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)


            except Exception as e:
                st.error(f"An error occurred: {e}")

            # Draw landmarks on the frame
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # Display the frame in the Streamlit app
            video_placeholder.image(image, channels="BGR")

        cap.release()
