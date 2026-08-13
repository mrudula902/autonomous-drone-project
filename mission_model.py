from dataclasses import dataclass, asdict
from typing import List
import json


@dataclass
class Waypoint:
    name: str
    latitude: float
    longitude: float
    altitude_m: float


@dataclass
class Mission:
    name: str
    aircraft: str
    altitude_m: float
    speed_mps: float
    waypoints: List[Waypoint]

    def to_dict(self):
        return {
            "name": self.name,
            "aircraft": self.aircraft,
            "altitude_m": self.altitude_m,
            "speed_mps": self.speed_mps,
            "waypoints": [
                asdict(point) for point in self.waypoints
            ]
        }

    def save_json(self, filename):
        with open(filename, "w") as file:
            json.dump(self.to_dict(), file, indent=4)

        print(f"Mission saved to: {filename}")
