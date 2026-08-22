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

# Get current simulated GPS position
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


# Small offsets for SITL demonstration only
# Approximately a few metres from the starting position
waypoint1_lat = home_lat + 0.00005
waypoint1_lon = home_lon

waypoint2_lat = home_lat + 0.00005
waypoint2_lon = home_lon + 0.00005

mission = [
    # Takeoff to 5 metres
    {
        "command": mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
        "lat": home_lat,
        "lon": home_lon,
        "alt": 5
    },

    # Waypoint 1
    {
        "command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        "lat": waypoint1_lat,
        "lon": waypoint1_lon,
        "alt": 5
    },

    # Waypoint 2
    {
        "command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
        "lat": waypoint2_lat,
        "lon": waypoint2_lon,
        "alt": 5
    },

    # Return to launch
    {
        "command": mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
        "lat": 0,
        "lon": 0,
        "alt": 0
    }
]

print(f"Uploading {len(mission)} mission items...")

# Clear previous mission
connection.mav.mission_clear_all_send(
    connection.target_system,
    connection.target_component
)

time.sleep(1)

# Tell ArduPilot how many mission items are coming
connection.mav.mission_count_send(
    connection.target_system,
    connection.target_component,
    len(mission),
    mavutil.mavlink.MAV_MISSION_TYPE_MISSION
)

# Send requested mission items
for item in mission:

    request = connection.recv_match(
        type=["MISSION_REQUEST_INT", "MISSION_REQUEST"],
        blocking=True,
        timeout=10
    )

    if request is None:
        print("ERROR: Mission request timed out.")
        break

    seq = request.seq
    data = mission[seq]

    connection.mav.mission_item_int_send(
        connection.target_system,
        connection.target_component,
        seq,
        mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT,
        data["command"],
        0,
        1,
        0,
        0,
        0,
        0,
        int(data["lat"] * 1e7),
        int(data["lon"] * 1e7),
        data["alt"]
    )

    print(f"Sent mission item {seq + 1}/{len(mission)}")


# Wait for final acknowledgement
ack = connection.recv_match(
    type="MISSION_ACK",
    blocking=True,
    timeout=10
)

if ack:
    if ack.type == mavutil.mavlink.MAV_MISSION_ACCEPTED:
        print("MISSION UPLOAD SUCCESSFUL!")
    else:
        print(f"Mission rejected. ACK type: {ack.type}")
else:
    print("ERROR: No mission acknowledgement received.")

print("Mission upload test complete.")
print("The mission has NOT been started or armed.")
