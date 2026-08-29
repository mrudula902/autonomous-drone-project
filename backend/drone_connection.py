from pymavlink import mavutil
import sys

connection_string = "udpin:0.0.0.0:14551"

print("================================")
print(" DRONE CONNECTION TEST")
print("================================")
print("Listening on:", connection_string)
print("Waiting for MAVLink heartbeat...")

try:
    master = mavutil.mavlink_connection(
        connection_string,
        source_system=255
    )

    master.wait_heartbeat(timeout=15)

    print()
    print("CONNECTED SUCCESSFULLY")
    print("----------------------------")
    print("System ID:", master.target_system)
    print("Component ID:", master.target_component)

    heartbeat = master.recv_match(
        type="HEARTBEAT",
        blocking=True,
        timeout=5
    )

    if heartbeat:
        print("Vehicle Type:", heartbeat.type)
        print("Autopilot Type:", heartbeat.autopilot)
        print(
            "Flight Mode:",
            mavutil.mode_string_v10(heartbeat)
        )

    print()
    print("DRONE CONNECTION TEST COMPLETE")

except Exception as e:
    print()
    print("CONNECTION FAILED")
    print("Reason:", str(e))
    sys.exit(1)
