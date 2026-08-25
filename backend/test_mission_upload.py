from mavlink_mission import (
    load_mission,
    connect_sitl,
    upload_mission,
)


print("Loading saved mission...")

mission = load_mission()

print(
    f"Mission: {mission['name']}"
)

print(
    f"Waypoints: {len(mission['waypoints'])}"
)

print(
    f"Altitude: {mission['altitude']} m"
)

print(
    f"Speed: {mission['speed']} m/s"
)

connection = connect_sitl()

upload_mission(
    connection,
    mission
)