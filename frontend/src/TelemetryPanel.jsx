import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:5001";

export default function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState({
    connected: false,
    mode: "--",
    lat: "--",
    lng: "--",
    altitude: "--",
    speed: "--",
    battery: "--",
    waypoint: "--",
    missionStatus: "STANDBY",
  });

  useEffect(() => {
    const readTelemetry = async () => {
      try {
        const response = await fetch(
          `${API}/api/telemetry`
        );

        if (!response.ok) {
          throw new Error("Telemetry unavailable");
        }

        const data = await response.json();

        setTelemetry(data);
      } catch {
        setTelemetry((old) => ({
          ...old,
          connected: false,
          missionStatus: "BACKEND OFFLINE",
        }));
      }
    };

    readTelemetry();

    const timer = setInterval(
      readTelemetry,
      1000
    );

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mission-intelligence">

      <div className="analysis-header">

        <div>
          <div className="eyebrow">
            LIVE FLIGHT TELEMETRY
          </div>

          <h2>
            Vehicle Status
          </h2>
        </div>

        <div className="mission-health">

          <small>
            CONNECTION
          </small>

          <strong
            style={{
              color: telemetry.connected
                ? "#38d39f"
                : "#f87171",
            }}
          >
            {telemetry.connected
              ? "CONNECTED"
              : "OFFLINE"}
          </strong>

        </div>

      </div>


      <div className="analysis-grid">

        <div>
          <small>Flight Mode</small>
          <strong>
            {telemetry.mode}
          </strong>
        </div>

        <div>
          <small>Latitude</small>
          <strong>
            {telemetry.lat}
          </strong>
        </div>

        <div>
          <small>Longitude</small>
          <strong>
            {telemetry.lng}
          </strong>
        </div>

        <div>
          <small>Altitude</small>
          <strong>
            {telemetry.altitude} m
          </strong>
        </div>

        <div>
          <small>Ground Speed</small>
          <strong>
            {telemetry.speed} m/s
          </strong>
        </div>

        <div>
          <small>Battery</small>
          <strong>
            {telemetry.battery}%
          </strong>
        </div>

        <div>
          <small>Current Waypoint</small>
          <strong>
            {telemetry.waypoint}
          </strong>
        </div>

        <div>
          <small>Mission Status</small>
          <strong>
            {telemetry.missionStatus}
          </strong>
        </div>

      </div>

    </section>
  );
}