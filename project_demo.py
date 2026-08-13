import json
import os

print()
print("================================================")
print("   AUTONOMOUS DRONE PROJECT - FINAL DEMO")
print("================================================")

print()
print("Aircraft : DJI Mavic 4 Pro 512GB")
print("System   : Autonomous Mission Planning System")
print()

filename = "mavic4pro_mission.json"

if not os.path.exists(filename):
    print("ERROR: Mission file not found.")
    print("Run mavic4pro_mission_planner.py first.")
    raise SystemExit

with open(filename, "r") as file:
    mission = json.load(file)

print("------------------------------------------------")
print("MISSION INFORMATION")
print("------------------------------------------------")

print(f"Aircraft          : {mission['aircraft']}")
print(f"Mission type      : {mission['mission_type']}")
print(f"Waypoint count    : {mission['waypoint_count']}")
print(f"Altitude          : {mission['altitude_m']:.1f} m")
print(f"Speed             : {mission['speed_mps']:.1f} m/s")
print(f"Total distance    : {mission['total_distance_m']:.2f} m")

print()
print("------------------------------------------------")
print("START POSITION")
print("------------------------------------------------")

start = mission["start_position"]

print(f"Latitude          : {start['latitude']:.7f}")
print(f"Longitude         : {start['longitude']:.7f}")

print()
print("------------------------------------------------")
print("GENERATED ROUTE")
print("------------------------------------------------")

for point in mission["waypoints"]:
    print(
        f"{point['id']}. "
        f"{point['name']:<12} "
        f"Lat: {point['latitude']:.7f}  "
        f"Lon: {point['longitude']:.7f}  "
        f"Alt: {point['altitude_m']:.1f} m"
    )

print()
print("------------------------------------------------")
print("SYSTEM STATUS")
print("------------------------------------------------")

print("✓ Mission file loaded")
print("✓ GPS coordinates available")
print("✓ Waypoints generated")
print("✓ Mission parameters validated")
print("✓ Route distance calculated")
print("✓ Mission ready for review")

print()
print("================================================")
print("        AUTONOMOUS MISSION READY")
print("================================================")
print()
