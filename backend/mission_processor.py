import json
from pathlib import Path


MISSION_DIR = Path(__file__).parent / "missions"
MISSION_DIR.mkdir(exist_ok=True)


def validate_mission(mission):
    errors = []

    if not mission.get("name"):
        errors.append("Mission name is required.")

    waypoints = mission.get("waypoints", [])

    if len(waypoints) < 2:
        errors.append("At least 2 waypoints are required.")

    altitude = float(mission.get("altitude", 0))

    if altitude <= 0:
        errors.append("Altitude must be greater than 0.")

    speed = float(mission.get("speed", 0))

    if speed <= 0:
        errors.append("Speed must be greater than 0.")

    for index, point in enumerate(waypoints):
        if "lat" not in point or "lng" not in point:
            errors.append(
                f"Waypoint {index + 1} is missing coordinates."
            )

    return errors


def save_mission(mission):
    errors = validate_mission(mission)

    if errors:
        return {
            "success": False,
            "errors": errors
        }

    file_path = MISSION_DIR / "current_mission.json"

    with open(file_path, "w") as file:
        json.dump(mission, file, indent=2)

    return {
        "success": True,
        "message": "Mission saved.",
        "file": str(file_path)
    }


def load_mission():
    file_path = MISSION_DIR / "current_mission.json"

    if not file_path.exists():
        return None

    with open(file_path, "r") as file:
        return json.load(file)


def mission_summary(mission):
    if not mission:
        return {
            "waypoints": 0,
            "distance": 0,
            "estimatedTime": 0
        }

    return {
        "waypoints": len(mission.get("waypoints", [])),
        "distance": mission.get("distance", 0),
        "estimatedTime": mission.get("estimatedTime", 0),
        "altitude": mission.get("altitude", 0),
        "speed": mission.get("speed", 0)
    }
