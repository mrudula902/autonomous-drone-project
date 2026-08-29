from flask import Flask, jsonify
from pymavlink import mavutil

app = Flask(__name__)

CONNECTION_STRING = "udpin:0.0.0.0:14551"


@app.route("/api/drone/status", methods=["GET"])
def drone_status():

    result = {
        "connected": False,
        "status": "DISCONNECTED",
        "system_id": None,
        "component_id": None,
        "vehicle_type": None,
        "autopilot_type": None,
        "message": "No MAVLink flight controller detected"
    }

    try:
        master = mavutil.mavlink_connection(
            CONNECTION_STRING,
            source_system=255,
            source_component=190
        )

        heartbeat = master.recv_match(
            type="HEARTBEAT",
            blocking=True,
            timeout=5
        )

        if heartbeat is None:
            return jsonify(result)

        result["connected"] = True
        result["status"] = "CONNECTED"
        result["system_id"] = heartbeat.get_srcSystem()
        result["component_id"] = heartbeat.get_srcComponent()
        result["vehicle_type"] = heartbeat.type
        result["autopilot_type"] = heartbeat.autopilot
        result["message"] = (
            "MAVLink-compatible flight controller detected"
        )

        return jsonify(result)

    except Exception as error:
        result["message"] = str(error)
        return jsonify(result)


if __name__ == "__main__":
    print("================================")
    print(" DRONE STATUS API")
    print("================================")
    print("API running on:")
    print("http://127.0.0.1:5050")
    print()
    print("Endpoint:")
    print("/api/drone/status")

    app.run(
        host="0.0.0.0",
        port=5050,
        debug=False
    )
