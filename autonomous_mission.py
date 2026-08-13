from pymavlink import mavutil
import time

print("Connecting to ArduCopter SITL...")

connection = mavutil.mavlink_connection(
    "udp:127.0.0.1:14551"
)

connection.wait_heartbeat()

print("Connected!")
print(f"System ID: {connection.target_system}")
print(f"Component ID: {connection.target_component}")

# Get current GPS position
print("Getting current position...")

while True:
    msg = connection.recv_match(
        type="GLOBAL_POSITION_INT",
        blocking=True
    )

    if msg:
        home_lat = msg.lat / 1e7
        home_lon = msg.lon / 1e7

        print(f"Home: {home_lat:.7f}, {home_lon:.7f}")
        break


# Generate small dynamic waypoints for SITL
waypoint1_lat = home_lat + 0.00005
waypoint1_lon = home_lon

waypoint2_lat = home_lat + 0.00005
waypoint2_lon = home_lon + 0.00005


mission = [
    {
        "name": "TAKEOFF",
        "command": mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
        "lat": home_lat,
        "lon": home_lon,
        "alt": 5
    },

    {
        "name": "WAYPOINT 1",
        "command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        "lat": waypoint1_lat,
        "lon": waypoint1_lon,
        "alt": 5
    },

    {
        "name": "WAYPOINT 2",
        "command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        "lat": waypoint2_lat,
        "lon": waypoint2_lon,
        "alt": 5
    },

    {
        "name": "RETURN TO LAUNCH",
        "command": mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
        "lat": 0,
        "lon": 0,
        "alt": 0
    }
]


print()
print("================================")
print("   AUTONOMOUS DRONE MISSION")
print("================================")
print(f"Mission items: {len(mission)}")

for i, item in enumerate(mission):
    print(f"{i}: {item['name']}")

print()
print("Uploading mission...")


# Clear previous mission
connection.mav.mission_clear_all_send(
    connection.target_system,
    connection.target_component
)

time.sleep(1)


# Tell ArduPilot mission size
connection.mav.mission_count_send(
    connection.target_system,
    connection.target_component,
    len(mission),
    mavutil.mavlink.MAV_MISSION_TYPE_MISSION
)


# Send requested mission items
upload_success = True

for _ in range(len(mission)):

    request = connection.recv_match(
        type=["MISSION_REQUEST_INT", "MISSION_REQUEST"],
        blocking=True,
        timeout=10
    )

    if request is None:
        print("ERROR: Mission request timed out.")
        upload_success = False
        break

    seq = request.seq

    if seq >= len(mission):
        print("ERROR: Invalid mission sequence.")
        upload_success = False
        break

    item = mission[seq]

    connection.mav.mission_item_int_send(
        connection.target_system,
        connection.target_component,
        seq,
        mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT,
        item["command"],
        0,
        1,
        0,
        0,
        0,
        0,
        int(item["lat"] * 1e7),
        int(item["lon"] * 1e7),
        item["alt"]
    )

    print(f"Uploaded: {item['name']}")


# Wait for acknowledgement
ack = connection.recv_match(
    type="MISSION_ACK",
    blocking=True,
    timeout=10
)


if not upload_success:
    print("MISSION UPLOAD FAILED.")
    raise SystemExit


if ack is None:
    print("ERROR: No mission acknowledgement received.")
    raise SystemExit


if ack.type == mavutil.mavlink.MAV_MISSION_ACCEPTED:

    print()
    print("MISSION UPLOAD SUCCESSFUL!")
    print("Mission stored by ArduPilot.")

else:

    print()
    print(f"Mission rejected. ACK type: {ack.type}")
    raise SystemExit


# Monitor mission messages
print()
print("================================")
print("   MISSION MONITOR")
print("================================")
print("Waiting for mission status...")
print("The mission is NOT being started automatically.")
print("Press Ctrl+C to stop monitoring.")
print()


last_sequence = None

try:

    while True:

        msg = connection.recv_match(
            type=["MISSION_CURRENT", "MISSION_ITEM_REACHED"],
            blocking=True,
            timeout=5
        )

        if msg is None:
            continue

        if msg.get_type() == "MISSION_CURRENT":

            sequence = msg.seq

            if sequence != last_sequence:

                if sequence < len(mission):
                    print(
                        f"Current mission item: "
                        f"{sequence} - "
                        f"{mission[sequence]['name']}"
                    )
                else:
                    print(
                        f"Current mission item: {sequence}"
                    )

                last_sequence = sequence

        elif msg.get_type() == "MISSION_ITEM_REACHED":

            sequence = msg.seq

            if sequence < len(mission):
                print(
                    f"MISSION ITEM REACHED: "
                    f"{sequence} - "
                    f"{mission[sequence]['name']}"
                )
            else:
                print(
                    f"MISSION ITEM REACHED: {sequence}"
                )

except KeyboardInterrupt:

    print()
    print("Mission monitoring stopped.")
    print("Program finished.")
