from pymavlink import mavutil

connection = mavutil.mavlink_connection(
    "udpin:127.0.0.1:14551"
)

connection.wait_heartbeat()

print("CONNECTED")
print(
    f"System: {connection.target_system} "
    f"Component: {connection.target_component}"
)

while True:
    msg = connection.recv_match(
        type=[
            "GLOBAL_POSITION_INT",
            "VFR_HUD",
            "SYS_STATUS",
            "HEARTBEAT",
        ],
        blocking=True,
    )

    if not msg:
        continue

    if msg.get_type() == "GLOBAL_POSITION_INT":
        print(
            f"LAT: {msg.lat / 1e7:.6f} "
            f"LON: {msg.lon / 1e7:.6f} "
            f"ALT: {msg.relative_alt / 1000:.1f} m"
        )

    elif msg.get_type() == "VFR_HUD":
        print(
            f"SPEED: {msg.groundspeed:.1f} m/s "
            f"ALT: {msg.alt:.1f} m"
        )

    elif msg.get_type() == "SYS_STATUS":
        print(
            f"BATTERY: {msg.battery_remaining}%"
        )

    elif msg.get_type() == "HEARTBEAT":
        print(
            f"MODE: {msg.custom_mode}"
        )