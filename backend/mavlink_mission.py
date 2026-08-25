import json
from pathlib import Path

from pymavlink import mavutil


MISSION_FILE = (
    Path(__file__).parent
    / "missions"
    / "current_mission.json"
)

MAV_PORT = "udpin:127.0.0.1:14551"


def load_mission():
    if not MISSION_FILE.exists():
        raise FileNotFoundError(
            f"Mission file not found: {MISSION_FILE}"
        )

    with open(MISSION_FILE, "r") as file:
        return json.load(file)


def connect_sitl():
    print("Connecting to ArduPilot SITL...")

    connection = mavutil.mavlink_connection(
        MAV_PORT
    )

    print("Waiting for heartbeat...")

    connection.wait_heartbeat(timeout=30)

    print(
        f"Connected: "
        f"system={connection.target_system}, "
        f"component={connection.target_component}"
    )

    return connection


def clear_old_mission(connection):
    print("Clearing old mission...")

    connection.mav.mission_clear_all_send(
        connection.target_system,
        connection.target_component,
        mavutil.mavlink.MAV_MISSION_TYPE_MISSION,
    )

    # Wait specifically for the ACK caused by CLEAR_ALL.
    ack = connection.recv_match(
        type="MISSION_ACK",
        blocking=True,
        timeout=5,
    )

    if ack is not None:
        print(
            f"Clear response received: {ack.type}"
        )


def upload_mission(connection, mission):

    waypoints = mission.get("waypoints", [])

    if len(waypoints) < 2:
        raise ValueError(
            "Mission must contain at least 2 waypoints."
        )

    altitude = float(
        mission.get("altitude", 30)
    )

    count = len(waypoints)

    print()
    print("====================================")
    print(" MISSION UPLOAD")
    print("====================================")
    print(
        f"Mission: {mission.get('name', 'Unnamed')}"
    )
    print(f"Waypoints: {count}")
    print(f"Altitude: {altitude} m")
    print(
        f"Speed: {mission.get('speed', 0)} m/s"
    )
    print("====================================")
    print()

    # IMPORTANT:
    # Clear first and consume its ACK.
    clear_old_mission(connection)

    print("Sending mission count...")

    connection.mav.mission_count_send(
        connection.target_system,
        connection.target_component,
        count,
        mavutil.mavlink.MAV_MISSION_TYPE_MISSION,
    )

    uploaded_sequences = set()

    while len(uploaded_sequences) < count:

        message = connection.recv_match(
            type=[
                "MISSION_REQUEST",
                "MISSION_REQUEST_INT",
                "MISSION_ACK",
            ],
            blocking=True,
            timeout=15,
        )

        if message is None:
            raise TimeoutError(
                "Timed out waiting for ArduPilot."
            )

        message_type = message.get_type()

        print(
            f"Received: {message_type}"
        )

        # Ignore an unexpected ACK until all mission
        # items have actually been sent.
        if message_type == "MISSION_ACK":

            if len(uploaded_sequences) < count:
                print(
                    "Ignoring premature MISSION_ACK."
                )
                continue

            if message.type != (
                mavutil.mavlink.MAV_MISSION_ACCEPTED
            ):
                raise RuntimeError(
                    f"Mission rejected: {message.type}"
                )

            print(
                "\nMISSION ACCEPTED BY ARDUPILOT"
            )
            return

        sequence = int(message.seq)

        if sequence < 0 or sequence >= count:
            raise RuntimeError(
                f"Invalid waypoint request: {sequence}"
            )

        point = waypoints[sequence]

        lat = float(point["lat"])
        lng = float(point["lng"])

        print(
            f"Sending waypoint "
            f"{sequence + 1}/{count}: "
            f"{lat:.7f}, {lng:.7f}"
        )

        connection.mav.mission_item_int_send(
            connection.target_system,
            connection.target_component,
            sequence,
            mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT,
            mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
            1 if sequence == 0 else 0,
            1,
            0,
            0,
            0,
            0,
            int(lat * 10_000_000),
            int(lng * 10_000_000),
            altitude,
            mavutil.mavlink.MAV_MISSION_TYPE_MISSION,
        )

        uploaded_sequences.add(sequence)

    print(
        "\nAll mission items sent."
    )

    # Now wait for the actual final acknowledgement.
    while True:

        ack = connection.recv_match(
            type="MISSION_ACK",
            blocking=True,
            timeout=15,
        )

        if ack is None:
            raise TimeoutError(
                "No final MISSION_ACK received."
            )

        if ack.type != (
            mavutil.mavlink.MAV_MISSION_ACCEPTED
        ):
            raise RuntimeError(
                f"Mission rejected: {ack.type}"
            )

        print()
        print("====================================")
        print(" MISSION UPLOAD SUCCESSFUL")
        print("====================================")
        return


if __name__ == "__main__":

    print("\nLoading saved mission...")

    mission = load_mission()

    print(
        f"Loaded: {MISSION_FILE}"
    )

    connection = connect_sitl()

    upload_mission(
        connection,
        mission
    )