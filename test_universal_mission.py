from mission_model import Mission, Waypoint


mission = Mission(
    name="College Demo Mission",
    aircraft="Generic Multirotor",
    altitude_m=10.0,
    speed_mps=2.5,
    waypoints=[
        Waypoint("HOME", 19.8765, 75.3433, 0.0),
        Waypoint("WAYPOINT 1", 19.8766, 75.3433, 10.0),
        Waypoint("WAYPOINT 2", 19.8766, 75.3434, 10.0),
        Waypoint("RETURN", 19.8765, 75.3433, 0.0),
    ],
)

mission.save_json("universal_test_mission.json")
