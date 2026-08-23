from flask import Flask, request, jsonify
from flask_cors import CORS

from mission_processor import (
    save_mission,
    load_mission,
    mission_summary
)


app = Flask(__name__)
CORS(app)


@app.get("/")
def home():
    return jsonify({
        "system": "Autonomous Drone Mission Studio",
        "status": "online"
    })


@app.get("/api/status")
def status():
    return jsonify({
        "connected": False,
        "mode": "SIMULATION",
        "gps": "SIMULATED",
        "vehicle": "ArduPilot SITL"
    })


@app.post("/api/missions")
def create_mission():

    mission = request.get_json()

    if not mission:
        return jsonify({
            "success": False,
            "error": "No mission data received."
        }), 400

    result = save_mission(mission)

    if not result["success"]:
        return jsonify(result), 400

    return jsonify(result)


@app.get("/api/missions/current")
def current_mission():

    mission = load_mission()

    if mission is None:
        return jsonify({
            "success": False,
            "message": "No mission saved."
        }), 404

    return jsonify({
        "success": True,
        "mission": mission,
        "summary": mission_summary(mission)
    })


@app.get("/api/missions/summary")
def mission_summary_api():

    mission = load_mission()

    return jsonify({
        "success": True,
        "summary": mission_summary(mission)
    })


if __name__ == "__main__":

    print("")
    print("======================================")
    print(" AUTONOMOUS DRONE MISSION STUDIO")
    print(" Backend running in SIMULATION mode")
    print("======================================")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
