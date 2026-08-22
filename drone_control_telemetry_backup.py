

from pymavlink import mavutil
import time

connection = mavutil.mavlink_connection("udp:127.0.0.1:14551")
print("Connecting to ArduCopter SITL...")

connection.wait_heartbeat()

print("Connected!")
print(f"System ID: {connection.target_system}")
print(f"Component ID: {connection.target_component}")

while True:
    msg = connection.recv_match(
        type="GLOBAL_POSITION_INT",
        blocking=True
    )

    if msg:
        latitude = msg.lat / 1e7
        longitude = msg.lon / 1e7
        altitude = msg.relative_alt / 1000.0

        print(
            f"GPS: {latitude:.7f}, {longitude:.7f} | "
            f"Altitude: {altitude:.2f} m"
        )

    time.sleep(1)
