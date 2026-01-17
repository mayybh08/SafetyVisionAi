import cv2
import math
import pandas as pd
import streamlit as st
import plotly.express as px
from ultralytics import YOLO

# =============================
# CONFIG
# =============================
VIDEO_INPUT ="C:\\Users\\MAYURI\\Desktop\\site.mp4"
PPE_MODEL_PATH = "yolov8n.pt"
HAZARD_MODEL_PATH = "yolov8n.pt"

CONF_THRESHOLD = 0.5
HAZARD_DISTANCE_THRESHOLD = 150

# =============================
# LOAD MODELS
# =============================
ppe_model = YOLO(PPE_MODEL_PATH)
hazard_model = YOLO(HAZARD_MODEL_PATH)

# =============================
# UTILS
# =============================
def center(box):
    x1, y1, x2, y2 = box
    return ((x1 + x2) // 2, (y1 + y2) // 2)

def distance(box1, box2):
    c1 = center(box1)
    c2 = center(box2)
    return math.dist(c1, c2)

# =============================
# STREAMLIT SETUP
# =============================
st.title("SafetyVision AI - Real-time Dashboard")

video_placeholder = st.empty()
kpi_placeholder = st.empty()
chart_placeholder = st.empty()

# Store metrics for plotting
metrics_data = []

# =============================
# VIDEO PROCESSING
# =============================
cap = cv2.VideoCapture(VIDEO_INPUT)
if not cap.isOpened():
    st.error("Cannot open video")
    st.stop()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # -----------------------------
    # PPE + PERSON TRACKING
    # -----------------------------
    ppe_results = ppe_model(frame, conf=CONF_THRESHOLD)[0]

    persons = {}
    ppe_items = []

    if ppe_results.boxes.id is not None:
        for box, track_id, cls in zip(
            ppe_results.boxes.xyxy,
            ppe_results.boxes.id,
            ppe_results.boxes.cls
        ):
            x1, y1, x2, y2 = map(int, box)
            track_id = int(track_id)
            class_name = ppe_model.names[int(cls)]

            if class_name == "person":
                persons[track_id] = {
                    "bbox": (x1, y1, x2, y2),
                    "helmet": False,
                    "mask": False
                }
            else:
                ppe_items.append((class_name, (x1, y1, x2, y2)))

    # Map PPE to person
    for pid, pdata in persons.items():
        for item, ibox in ppe_items:
            if distance(pdata["bbox"], ibox) < 80:
                if item == "helmet":
                    pdata["helmet"] = True
                if item == "mask":
                    pdata["mask"] = True

    # -----------------------------
    # HAZARD DETECTION
    # -----------------------------
    hazard_results = hazard_model(frame, conf=CONF_THRESHOLD)[0]
    hazards = []

    for box, cls in zip(hazard_results.boxes.xyxy, hazard_results.boxes.cls):
        x1, y1, x2, y2 = map(int, box)
        hazards.append({
            "type": hazard_model.names[int(cls)],
            "bbox": (x1, y1, x2, y2)
        })

    # -----------------------------
    # DRAW PERSONS & PPE STATUS
    # -----------------------------
    for pid, pdata in persons.items():
        x1, y1, x2, y2 = pdata["bbox"]
        color = (0, 255, 0)
        label = f"ID {pid}"

        if not pdata["helmet"]:
            color = (0, 0, 255)
            label += " | NO HELMET"

        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # -----------------------------
    # DRAW HAZARDS & RISK LOGIC
    # -----------------------------
    num_risks = 0
    for hazard in hazards:
        hx1, hy1, hx2, hy2 = hazard["bbox"]
        htype = hazard["type"]

        cv2.rectangle(frame, (hx1, hy1), (hx2, hy2), (0, 0, 255), 2)
        cv2.putText(frame, htype.upper(), (hx1, hy1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        for pid, pdata in persons.items():
            if distance(pdata["bbox"], hazard["bbox"]) < HAZARD_DISTANCE_THRESHOLD:
                if htype in ["fire", "smoke"] and not pdata["mask"]:
                    num_risks += 1
                    cv2.putText(
                        frame,
                        "CRITICAL RISK!",
                        (pdata["bbox"][0], pdata["bbox"][1] - 30),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (0, 0, 255),
                        3
                    )

    # -----------------------------
    # COLLECT METRICS
    # -----------------------------
    num_persons = len(persons)
    num_no_helmet = sum(1 for p in persons.values() if not p["helmet"])
    num_no_mask = sum(1 for p in persons.values() if not p["mask"])
    num_hazards = len(hazards)

    metrics_data.append({
        "frame": int(cap.get(cv2.CAP_PROP_POS_FRAMES)),
        "persons": num_persons,
        "no_helmet": num_no_helmet,
        "no_mask": num_no_mask,
        "hazards": num_hazards,
        "risks": num_risks
    })

    # -----------------------------
    # UPDATE DASHBOARD
    # -----------------------------
    # Show video frame
    video_placeholder.image(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB), channels="RGB")

    # Show KPIs
    kpi_placeholder.metric("Persons Detected", num_persons)
    kpi_placeholder.metric("No Helmet", num_no_helmet)
    kpi_placeholder.metric("No Mask", num_no_mask)
    kpi_placeholder.metric("Hazards", num_hazards)
    kpi_placeholder.metric("Critical Risks", num_risks)

    # Plot trends
    if len(metrics_data) > 5:
        df = pd.DataFrame(metrics_data[-50:])
        fig = px.line(df, x="frame", y=["persons", "no_helmet", "no_mask", "hazards", "risks"])
        chart_placeholder.plotly_chart(fig, use_container_width=True)
 