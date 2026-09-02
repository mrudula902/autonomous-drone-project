from flask import Flask, request, jsonify
from flask_cors import CORS

from mission_processor import (
    save_mission,
    load_mission,
    mission_summary
)

from dji.dji_status import DJIStatus
from dji.dji_mission import DJIWaypointMission


app = Flask(__name__)
CORS(app)


dji_status = DJIStatus()


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


@app.get("/api/dji/status")
def dji_status_api():
    return jsonify(
        dji_status.as_dict()
    )


@app.post("/api/dji/connect")
def dji_connect():
    dji_status.connect()

    return jsonify({
        "success": True,
        "message": "DJI adapter connected.",
        "status": dji_status.as_dict()
    })


@app.post("/api/dji/disconnect")
def dji_disconnect():
    dji_status.disconnect()

    return jsonify({
        "success": True,
        "message": "DJI adapter disconnected.",
        "status": dji_status.as_dict()
    })


@app.post("/api/dji/mission")
def dji_mission():
    mission = request.get_json()

    if not mission:
        return jsonify({
            "success": False,
            "error": "No mission data received."
        }), 400

    try:
        dji_mission = DJIWaypointMission(
            mission
        )

        prepared_mission = dji_mission.build()

        dji_status.prepare_mission()

        return jsonify({
            "success": True,
            "message": "DJI mission prepared successfully.",
            "mission": prepared_mission,
            "status": dji_status.as_dict()
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400


@app.post("/api/dji/start")
def dji_start():
    dji_status.start_mission()

    return jsonify({
        "success": True,
        "message": "Mission marked as running in the software adapter.",
        "status": dji_status.as_dict()
    })


@app.post("/api/dji/stop")
def dji_stop():
    dji_status.stop_mission()

    return jsonify({
        "success": True,
        "message": "Mission stopped in the software adapter.",
        "status": dji_status.as_dict()
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
    print("==========================================")
    print(" Autonomous Drone Mission Studio")
    print(" DJI API Server")
    print("==========================================")
    print("Server: http://127.0.0.1:5050")
    print("")

    app.run(
        host="127.0.0.1",
        port=5050,
        debug=True
    )