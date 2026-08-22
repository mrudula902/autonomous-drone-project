import json
import math

print()
print("==========================================")
print("   DJI MAVIC 4 PRO MISSION PLANNER")
print("==========================================")

# -------------------------------------------------
# USER INPUT
# -------------------------------------------------

print()
print("Enter the mission starting position.")
print("Use decimal GPS coordinates.")
print()

home_lat = float(input("Start latitude  : "))
home_lon = float(input("Start longitude : "))

altitude = float(input("Waypoint altitude (m): "))
speed = float(input("Waypoint speed (m/s): "))

# -------------------------------------------------
# VALIDATE INPUT
# -------------------------------------------------

if not -90 <= home_lat <= 90:
    raise ValueError("Invalid latitude.")

if not -180 <= home_lon <= 180:
    raise ValueError("Invalid longitude.")

if altitude <= 0:
    raise ValueError("Altitude must be greater than 0.")

if not 0.1 <= speed <= 15.0:
    raise ValueError("Speed must be between 0.1 and 15.0 m/s.")

# -------------------------------------------------
# DISTANCE CALCULATION
# -------------------------------------------------

def distance_m(lat1, lon1, lat2, lon2):

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

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


# -------------------------------------------------
# CREATE DYNAMIC ROUTE
# -------------------------------------------------

# Small demonstration offsets.
# These create a square-style route around the
# selected starting point.

offset = 0.00005

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
        "latitude": home_lat + offset,
        "longitude": home_lon,
        "altitude_m": altitude,
        "speed_mps": speed,
        "action": "HOVER"
    },

    {
        "id": 3,
        "name": "WAYPOINT 2",
        "latitude": home_lat + offset,
        "longitude": home_lon + offset,
        "altitude_m": altitude,
        "speed_mps": speed,
        "action": "HOVER"
    },

    {
        "id": 4,
        "name": "WAYPOINT 3",
        "latitude": home_lat,
        "longitude": home_lon + offset,
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
# CALCULATE DISTANCES
# -------------------------------------------------

total_distance = 0.0

for i in range(len(waypoints) - 1):

    current = waypoints[i]
    next_point = waypoints[i + 1]

    segment_distance = distance_m(
        current["latitude"],
        current["longitude"],
        next_point["latitude"],
        next_point["longitude"]
    )

    current["distance_to_next_m"] = round(
        segment_distance, 2
    )

    total_distance += segment_distance


# -------------------------------------------------
# MISSION VALIDATION
# -------------------------------------------------

print()
print("==========================================")
print("        MISSION VALIDATION")
print("==========================================")

valid = True

if speed < 0.1 or speed > 15:
    print("❌ Invalid speed")
    valid = False

if altitude <= 0:
    print("❌ Invalid altitude")
    valid = False

if len(waypoints) > 200:
    print("❌ Too many waypoints")
    valid = False

if valid:
    print("✓ GPS coordinates valid")
    print("✓ Altitude valid")
    print("✓ Speed valid")
    print("✓ Waypoint count valid")
    print()
    print("MISSION VALIDATION: PASSED")
else:
    print()
    print("MISSION VALIDATION: FAILED")
    raise SystemExit


# -------------------------------------------------
# DISPLAY ROUTE
# -------------------------------------------------

print()
print("==========================================")
print("             MISSION ROUTE")
print("==========================================")

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
print(f"Total distance : {total_distance:.2f} m")
print(f"Altitude       : {altitude:.1f} m")
print(f"Speed          : {speed:.1f} m/s")
print(f"Waypoints      : {len(waypoints)}")
print("------------------------------------------")


# -------------------------------------------------
# SAVE MISSION
# -------------------------------------------------

mission_data = {

    "aircraft": "DJI Mavic 4 Pro 512GB",

    "mission_type": "Waypoint Flight Planning",

    "start_position": {
        "latitude": home_lat,
        "longitude": home_lon
    },

    "altitude_m": altitude,

    "speed_mps": speed,

    "waypoint_count": len(waypoints),

    "total_distance_m": round(
        total_distance, 2
    ),

    "waypoints": waypoints
}


with open(
    "mavic4pro_mission.json",
    "w"
) as file:

    json.dump(
        mission_data,
        file,
        indent=4
    )


# -------------------------------------------------
# FINAL RESULT
# -------------------------------------------------

print()
print("==========================================")
print("       MISSION PLANNING COMPLETE")
print("==========================================")

print()
print("Mission file:")
print("mavic4pro_mission.json")

print()
print("The route is ready for review.")
print("==========================================")
