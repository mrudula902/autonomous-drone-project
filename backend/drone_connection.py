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

    heartbeat = master.recv_match(
        type="HEARTBEAT",
        blocking=True,
        timeout=15
    )

    if heartbeat is None:
        raise TimeoutError(
            "No MAVLink heartbeat received within 15 seconds"
        )

    system_id = heartbeat.get_srcSystem()
    component_id = heartbeat.get_srcComponent()

    print()
    print("CONNECTED SUCCESSFULLY")
    print("----------------------------")
    print("System ID:", system_id)
    print("Component ID:", component_id)
    print("Vehicle Type:", heartbeat.type)
    print("Autopilot Type:", heartbeat.autopilot)

    print()
    print("Waiting for system information...")

    sys_status = master.recv_match(
        type="SYS_STATUS",
        blocking=True,
        timeout=5
    )

    if sys_status:
        print("System status received: YES")
        print(
            "Battery remaining:",
            sys_status.battery_remaining,
            "%"
        )
    else:
        print("System status received: NO")

    print()
    print("DRONE CONNECTION TEST COMPLETE")

except Exception as e:
    print()
    print("CONNECTION FAILED")
    print("Reason:", str(e))
    sys.exit(1)
