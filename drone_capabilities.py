DRONES = {
    "DJI Mavic 4 Pro": {
        "mission_planning": True,
        "waypoint_flight": True,
        "direct_api_control": False,
        "execution": "DJI Fly"
    },
    "ArduPilot": {
        "mission_planning": True,
        "waypoint_flight": True,
        "direct_api_control": True,
        "execution": "MAVLink"
    },
    "BGA4": {
        "mission_planning": True,
        "waypoint_flight": "CHECK",
        "direct_api_control": "CHECK",
        "execution": "VERIFY"
    },
    "Avoda360": {
        "mission_planning": True,
        "waypoint_flight": "CHECK",
        "direct_api_control": "CHECK",
        "execution": "VERIFY"
    }
}


def show_capabilities(name):
    drone = DRONES.get(name)

    if drone is None:
        print("Unknown aircraft")
        return

    print(f"\nAircraft: {name}")
    print("-" * 40)

    for capability, value in drone.items():
        print(f"{capability}: {value}")


if __name__ == "__main__":
    for drone_name in DRONES:
        show_capabilities(drone_name)
