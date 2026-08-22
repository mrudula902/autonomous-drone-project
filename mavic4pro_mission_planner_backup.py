import json
import math

print()
print("==========================================")
print("   DJI MAVIC 4 PRO AUTONOMOUS MISSION")
print("==========================================")

# -------------------------------------------------
# MISSION SETTINGS
# -------------------------------------------------

# Current SITL/home position used as the planning reference
home_lat = -35.3632622
home_lon = 149.1652375

# Conservative demonstration parameters
altitude = 10.0
speed = 2.5

# -------------------------------------------------
# DISTANCE CALCULATION
# -------------------------------------------------

def distance_m(lat1, lon1, lat2, lon2):
    """
    Calculate approximate distance between two GPS points.
    """
    R = 6371000

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


# -------------------------------------------------
# GENERATE DYNAMIC WAYPOINTS
# -------------------------------------------------

waypoints = [
    {
        "id": 1,
        "name": "HOME",
        "latitude": home_lat,
        "longitude": home_lon,
        "altitude_m": 0.0,
        "speed_mps": 0.0,
        "action": "START"
    },

    {
        "id": 2,
        "name": "WAYPOINT 1",
        "latitude": home_lat + 0.00005,
        "longitude": home_lon,
        "altitude_m": altitude,
        "speed_mps": speed,
        "action": "HOVER"
    },

    {
        "id": 3,
        "name": "WAYPOINT 2",
        "latitude": home_lat + 0.00005,
        "longitude": home_lon + 0.00005,
        "altitude_m": altitude,
        "speed_mps": speed,
        "action": "HOVER"
    },

    {
        "id": 4,
        "name": "WAYPOINT 3",
        "latitude": home_lat,
        "longitude": home_lon + 0.00005,
        "altitude_m": altitude,
        "speed_mps": speed,
        "action": "HOVER"
    },

    {
        "id": 5,
        "name": "RETURN",
        "latitude": home_lat,
        "longitude": home_lon,
        "altitude_m": 0.0,
        "speed_mps": speed,
        "action": "RETURN"
    }
]


# -------------------------------------------------
# CALCULATE MISSION DISTANCE
# -------------------------------------------------

total_distance = 0.0

for i in range(len(waypoints) - 1):

    current = waypoints[i]
    next_point = waypoints[i + 1]

    segment = distance_m(
        current["latitude"],
        current["longitude"],
        next_point["latitude"],
        next_point["longitude"]
    )

    current["distance_to_next_m"] = round(segment, 2)

    total_distance += segment


# -------------------------------------------------
# VALIDATION
# -------------------------------------------------

print()
print("MISSION PARAMETERS")
print("------------------------------------------")
print(f"Altitude       : {altitude:.1f} m")
print(f"Waypoint speed : {speed:.1f} m/s")
print(f"Waypoints      : {len(waypoints)}")
print()

valid = True

if len(waypoints) > 200:
    print("ERROR: Too many waypoints.")
    valid = False

if speed < 0.1 or speed > 15.0:
    print("ERROR: Speed outside DJI waypoint range.")
    valid = False

if altitude <= 0:
    print("WARNING: Some points are at takeoff level.")

if valid:
    print("MISSION VALIDATION: PASSED")
else:
    print("MISSION VALIDATION: FAILED")


# -------------------------------------------------
# DISPLAY MISSION
# -------------------------------------------------

print()
print("MISSION ROUTE")
print("------------------------------------------")

for point in waypoints:

    print(
        f"{point['id']}. "
        f"{point['name']:<12} "
        f"Lat: {point['latitude']:.7f}  "
        f"Lon: {point['longitude']:.7f}  "
        f"Alt: {point['altitude_m']:.1f} m"
    )


print()
print("------------------------------------------")
print(f"TOTAL MISSION DISTANCE: {total_distance:.2f} m")
print("------------------------------------------")


# -------------------------------------------------
# SAVE MISSION FILE
# -------------------------------------------------

mission_data = {
    "aircraft": "DJI Mavic 4 Pro 512GB",
    "mission_type": "Waypoint Flight Planning",
    "altitude_m": altitude,
    "speed_mps": speed,
    "waypoint_count": len(waypoints),
    "total_distance_m": round(total_distance, 2),
    "waypoints": waypoints
}

with open("mavic4pro_mission.json", "w") as file:
    json.dump(mission_data, file, indent=4)


print()
print("MISSION FILE CREATED:")
print("mavic4pro_mission.json")

print()
print("==========================================")
print("   MISSION PLANNING COMPLETE")
print("==========================================")
print()
