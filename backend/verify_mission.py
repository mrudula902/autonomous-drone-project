from pymavlink import mavutil


connection = mavutil.mavlink_connection(
    "udpin:127.0.0.1:14552"
)

print("Waiting for heartbeat...")
connection.wait_heartbeat()

print(
    f"Connected: "
    f"{connection.target_system} "
    f"{connection.target_component}"
)

print("Requesting mission list...")

connection.mav.mission_request_list_send(
    connection.target_system,
    connection.target_component,
    mavutil.mavlink.MAV_MISSION_TYPE_MISSION,
)

message = connection.recv_match(
    type="MISSION_COUNT",
    blocking=True,
    timeout=10,
)

if message is None:
    raise RuntimeError(
        "No MISSION_COUNT received."
    )

count = int(message.count)

print()
print("================================")
print(" ARDUPILOT MISSION VERIFICATION")
print("================================")
print(f"Stored items: {count}")
print()

for seq in range(count):

    connection.mav.mission_request_int_send(
        connection.target_system,
        connection.target_component,
        seq,
        mavutil.mavlink.MAV_MISSION_TYPE_MISSION,
    )

    item = connection.recv_match(
        type=[
            "MISSION_ITEM_INT",
            "MISSION_ITEM",
        ],
        blocking=True,
        timeout=10,
    )

    if item is None:
        raise RuntimeError(
            f"No response for item {seq}"
        )

    if item.get_type() == "MISSION_ITEM_INT":
        lat = item.x / 10_000_000
        lon = item.y / 10_000_000
        alt = item.z
    else:
        lat = item.x
        lon = item.y
        alt = item.z

    if seq == 0:
        print("HOME:")
    else:
        print(f"MISSION WAYPOINT {seq}:")

    print(
        f"  LAT: {lat:.7f}"
    )

    print(
        f"  LON: {lon:.7f}"
    )

    print(
        f"  ALT: {alt:.1f} m"
    )

    print()

print("MISSION VERIFICATION COMPLETE")