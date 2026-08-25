from flask import Flask, jsonify
from flask_cors import CORS
from pymavlink import mavutil
import threading

app = Flask(__name__)
CORS(app)

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
}

connection = None


def telemetry_loop():
    global connection

    connection = mavutil.mavlink_connection(
        "udpin:127.0.0.1:14551"
    )

    connection.wait_heartbeat()

    state["connected"] = True
    state["missionStatus"] = "CONNECTED"

    while True:
        message = connection.recv_match(
            type=[
                "GLOBAL_POSITION_INT",
                "VFR_HUD",
                "SYS_STATUS",
                "HEARTBEAT",
                "MISSION_CURRENT",
            ],
            blocking=True,
            timeout=5,
        )

        if message is None:
            continue

        msg_type = message.get_type()

        if msg_type == "GLOBAL_POSITION_INT":
            state["lat"] = round(
                message.lat / 1e7,
                6,
            )

            state["lng"] = round(
                message.lon / 1e7,
                6,
            )

            state["altitude"] = round(
                message.relative_alt / 1000,
                1,
            )

        elif msg_type == "VFR_HUD":
            state["speed"] = round(
                message.groundspeed,
                1,
            )

        elif msg_type == "SYS_STATUS":
            state["battery"] = (
                message.battery_remaining
            )

        elif msg_type == "HEARTBEAT":
            state["mode"] = str(
                message.custom_mode
            )

        elif msg_type == "MISSION_CURRENT":
            state["waypoint"] = (
                message.seq
            )


@app.get("/api/telemetry")
def telemetry():
    return jsonify(state)


if __name__ == "__main__":
    thread = threading.Thread(
        target=telemetry_loop,
        daemon=True,
    )

    thread.start()

    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False,
    )