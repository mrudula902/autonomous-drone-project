class DJIWaypointMission:

    def __init__(self, mission):
        self.mission = mission

    def validate(self):
        required = [
            "name",
            "altitude",
            "speed",
            "waypoints"
        ]

        for field in required:
            if field not in self.mission:
                raise ValueError(
                    f"Missing required field: {field}"
                )

        if not self.mission["waypoints"]:
            raise ValueError(
                "At least one waypoint is required."
            )

        return True

    def build(self):
        self.validate()

        return {
            "name": self.mission["name"],
            "altitude": self.mission["altitude"],
            "speed": self.mission["speed"],
            "returnHome": self.mission.get(
                "returnHome",
                True
            ),
            "waypoints": [
                {
                    "latitude": point["lat"],
                    "longitude": point["lng"]
                }
                for point in self.mission["waypoints"]
            ]
        }