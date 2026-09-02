from flask import Flask, jsonify
from flask_cors import CORS
from pymavlink import mavutil
import threading
import time

app = Flask(__name__)
CORS(app)

CONNECTION_STRING = "udpin:0.0.0.0:14551"

state = {
    "connected": False,
    "mode": "--",
    "lat": "--",
    "lng": "--",
    "altitude": "--",
    "speed": "--",
    "battery": "--",
    "waypoint": "--",
    "missionStatus": "STANDBY",
    "system_id": None,
    "component_id": None,
    "vehicle_type": None,
    "autopilot_type": None,
    "last_heartbeat": None,
}

connection = None


def telemetry_loop():
    global connection

    while True:
        try:
            print("Connecting to MAVLink...")

            connection = mavutil.mavlink_connection(
                CONNECTION_STRING,
                source_system=255
            )

            heartbeat = connection.wait_heartbeat(
                timeout=15
            )

            if heartbeat is None:
                print("No heartbeat received. Retrying...")
                time.sleep(2)
                continue

            state["connected"] = True
            state["missionStatus"] = "CONNECTED"

            state["system_id"] = (
                heartbeat.get_srcSystem()
            )

            state["component_id"] = (
                heartbeat.get_srcComponent()
            )

            state["vehicle_type"] = heartbeat.type
            state["autopilot_type"] = heartbeat.autopilot

            state["last_heartbeat"] = time.time()

            print(
                "MAVLink vehicle connected:",
                state["system_id"],
                state["component_id"]
            )

            while True:

                message = connection.recv_match(
                    blocking=True,
                    timeout=5
                )

                if message is None:

                    if (
                        state["last_heartbeat"]
                        and
                        time.time()
                        - state["last_heartbeat"] > 10
                    ):
                        state["connected"] = False
                        state["missionStatus"] = (
                            "CONNECTION LOST"
                        )

                    continue

                msg_type = message.get_type()

                if msg_type == "HEARTBEAT":

                    state["connected"] = True
                    state["last_heartbeat"] = time.time()

                    state["system_id"] = (
                        message.get_srcSystem()
                    )

                    state["component_id"] = (
                        message.get_srcComponent()
                    )

                    state["vehicle_type"] = message.type
                    state["autopilot_type"] = message.autopilot

                    mode = mavutil.mode_string_v10(
                        message
                    )

                    state["mode"] = mode

                elif msg_type == "GLOBAL_POSITION_INT":

                    state["lat"] = round(
                        message.lat / 1e7,
                        6
                    )

                    state["lng"] = round(
                        message.lon / 1e7,
                        6
                    )

                    state["altitude"] = round(
                        message.relative_alt / 1000,
                        1
                    )

                elif msg_type == "VFR_HUD":

                    state["speed"] = round(
                        message.groundspeed,
                        1
                    )

                elif msg_type == "SYS_STATUS":

                    state["battery"] = (
                        message.battery_remaining
                    )

                elif msg_type == "MISSION_CURRENT":

                    state["waypoint"] = (
                        message.seq
                    )

                    state["missionStatus"] = (
                        "RUNNING"
                    )

        except Exception as error:

            print(
                "MAVLink error:",
                error
            )

            state["connected"] = False
            state["missionStatus"] = (
                "DISCONNECTED"
            )

            time.sleep(3)


@app.get("/api/telemetry")
def telemetry():

    return jsonify({
        "connected": state["connected"],
        "mode": state["mode"],
        "lat": state["lat"],
        "lng": state["lng"],
        "altitude": state["altitude"],
        "speed": state["speed"],
        "battery": state["battery"],
        "waypoint": state["waypoint"],
        "missionStatus": state["missionStatus"],
    })


@app.get("/api/drone/status")
def drone_status():

    if state["connected"]:

        return jsonify({
            "connected": True,
            "status": "CONNECTED",
            "system_id": state["system_id"],
            "component_id": state["component_id"],
            "vehicle_type": state["vehicle_type"],
            "autopilot_type": state["autopilot_type"],
            "message":
                "MAVLink-compatible flight controller detected"
        })

    return jsonify({
        "connected": False,
        "status": "DISCONNECTED",
        "system_id": None,
        "component_id": None,
        "vehicle_type": None,
        "autopilot_type": None,
        "message":
            "No MAVLink flight controller detected"
    })


if __name__ == "__main__":

    print("================================")
    print(" UNIFIED DRONE BACKEND")
    print("================================")
    print("Telemetry:")
    print("http://127.0.0.1:5001/api/telemetry")
    print()
    print("Drone Status:")
    print("http://127.0.0.1:5001/api/drone/status")
    print()

    thread = threading.Thread(
        target=telemetry_loop,
        daemon=True
    )

    thread.start()

    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False
    )