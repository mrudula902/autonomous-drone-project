from pymavlink import mavutil
import sys
import time

CONNECTION_STRING = "udpin:0.0.0.0:14551"

print("=" * 45)
print(" AUTONOMOUS DRONE CONNECTION TEST")
print("=" * 45)
print("Connection:", CONNECTION_STRING)
print("Waiting for MAVLink vehicle heartbeat...")
print()

try:
    master = mavutil.mavlink_connection(
        CONNECTION_STRING,
        source_system=255,
        source_component=190
    )

    heartbeat = master.recv_match(
        type="HEARTBEAT",
        blocking=True,
        timeout=15
    )

    if heartbeat is None:
        raise TimeoutError(
            "No MAVLink vehicle heartbeat received in 15 seconds"
        )

    system_id = heartbeat.get_srcSystem()
    component_id = heartbeat.get_srcComponent()

    master.target_system = system_id
    master.target_component = component_id

    print("CONNECTED SUCCESSFULLY")
    print("-" * 45)
    print("Vehicle System ID :", system_id)
    print("Vehicle Component :", component_id)
    print("Vehicle Type      :", heartbeat.type)
    print("Autopilot Type    :", heartbeat.autopilot)
    print("System Status     :", heartbeat.system_status)
    print("MAVLink Version   :", heartbeat.mavlink_version)

    print()
    print("Waiting for telemetry messages...")

    start = time.time()
    messages_received = []

    while time.time() - start < 5:
        message = master.recv_match(
            blocking=True,
            timeout=1
        )

        if message:
            msg_type = message.get_type()

            if msg_type not in messages_received:
                messages_received.append(msg_type)

    print()
    print("TELEMETRY CHECK")
    print("-" * 45)

    if messages_received:
        print("Connection Status : ONLINE")
        print("Messages Received :")
        for msg in messages_received[:15]:
            print(" -", msg)
    else:
        print("Connection Status : HEARTBEAT ONLY")

    print()
    print("=" * 45)
    print(" DRONE CONNECTION CHECK COMPLETE")
    print("=" * 45)

except Exception as error:
    print()
    print("CONNECTION FAILED")
    print("-" * 45)
    print("Reason:", str(error))
    sys.exit(1)
