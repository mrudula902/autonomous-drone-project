from pymavlink import mavutil
import json
import sys
import time

CONNECTION_STRING = "udpin:0.0.0.0:14551"

result = {
    "connected": False,
    "connection": CONNECTION_STRING,
    "system_id": None,
    "component_id": None,
    "vehicle_type": None,
    "autopilot_type": None,
    "status": "DISCONNECTED",
    "message": ""
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
        timeout=10
    )

    if heartbeat is None:
        raise TimeoutError("No MAVLink heartbeat received")

    result["connected"] = True
    result["system_id"] = heartbeat.get_srcSystem()
    result["component_id"] = heartbeat.get_srcComponent()
    result["vehicle_type"] = heartbeat.type
    result["autopilot_type"] = heartbeat.autopilot
    result["status"] = "CONNECTED"
    result["message"] = "MAVLink-compatible vehicle detected"

except Exception as error:
    result["message"] = str(error)

print(json.dumps(result, indent=2))
