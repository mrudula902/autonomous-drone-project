from mission_model import Mission, Waypoint
from drone_capabilities import DRONES


def num(prompt, minimum=None):
    while True:
        try:
            x = float(input(prompt))
            if minimum is not None and x < minimum:
                print(f"Must be >= {minimum}")
                continue
            return x
        except ValueError:
            print("Enter a number.")


def main():
    print("\n=== UNIVERSAL DRONE MISSION PLANNER ===")

    names = list(DRONES.keys())

    for i, name in enumerate(names, 1):
        print(f"{i}. {name}")

    aircraft = names[int(input("Select aircraft: ")) - 1]

    print("\nMISSION TYPE")
    print("1. Waypoint")
    print("2. Square Area Survey")
    print("3. Grid Photo Survey")

    mission_type = int(input("Select mission type: "))

    lat = num("Start latitude: ")
    lon = num("Start longitude: ")
    altitude = num("Altitude (m): ", 0)
    speed = num("Speed (m/s): ", 0)

    points = [
        Waypoint("HOME", lat, lon, 0.0)
    ]

    if mission_type == 1:
        points += [
            Waypoint("WAYPOINT 1", lat + 0.0001, lon, altitude),
            Waypoint("WAYPOINT 2", lat + 0.0001, lon + 0.0001, altitude),
            Waypoint("RETURN", lat, lon, 0.0)
        ]

    elif mission_type == 2:
        size = num("Square side length (m): ", 1)

        d = size / 111000

        points += [
            Waypoint("CORNER 1", lat + d, lon, altitude),
            Waypoint("CORNER 2", lat + d, lon + d, altitude),
            Waypoint("CORNER 3", lat, lon + d, altitude),
            Waypoint("RETURN", lat, lon, 0.0)
        ]

    elif mission_type == 3:
        rows = int(num("Number of survey rows: ", 2))
        spacing = num("Row spacing (m): ", 1)
        width = num("Survey width (m): ", 1)

        row_d = spacing / 111000
        col_d = width / 111000

        for i in range(rows):
            rlat = lat + i * row_d

            if i % 2 == 0:
                points.append(
                    Waypoint(f"PHOTO_ROW_{i+1}_A", rlat, lon, altitude)
                )
                points.append(
                    Waypoint(f"PHOTO_ROW_{i+1}_B", rlat, lon + col_d, altitude)
                )
            else:
                points.append(
                    Waypoint(f"PHOTO_ROW_{i+1}_A", rlat, lon + col_d, altitude)
                )
                points.append(
                    Waypoint(f"PHOTO_ROW_{i+1}_B", rlat, lon, altitude)
                )

        points.append(Waypoint("RETURN", lat, lon, 0.0))

    else:
        print("Invalid mission type.")
        return

    mission = Mission(
        name="Universal Mission",
        aircraft=aircraft,
        altitude_m=altitude,
        speed_mps=speed,
        waypoints=points
    )

    mission.save_json("universal_mission.json")

    print("\n=== MISSION CREATED ===")
    print("Aircraft:", aircraft)
    print("Waypoints:", len(points))
    print("Mission file: universal_mission.json")

    if mission_type == 3:
        print("Camera action: TAKE PHOTO AT SURVEY WAYPOINTS")

    print("\nExecution:", DRONES[aircraft]["execution"])


if __name__ == "__main__":
    main()
