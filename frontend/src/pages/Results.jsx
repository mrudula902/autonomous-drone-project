import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:5001";

export default function Results() {
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

  const [mission, setMission] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const telemetryResponse = await fetch(
          `${API}/api/telemetry`
        );

        if (telemetryResponse.ok) {
          const data = await telemetryResponse.json();
          setTelemetry(data);
        }
      } catch {
        // Keep previous values.
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/missions/current"
        );

        if (response.ok) {
          const data = await response.json();
          setMission(data.mission);
        }
      } catch {
        // Keep previous mission.
      }
    };

    load();

    const timer = setInterval(load, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-shell">

      <div className="page-heading">
        <div>
          <div className="eyebrow">
            RESULTS
          </div>

          <h2>
            Mission results
          </h2>

          <p>
            Live vehicle status and mission information.
          </p>
        </div>
      </div>


      <div className="result-grid">

        <div className="result-card">
          <small>Connection</small>
          <strong>
            {telemetry.connected
              ? "ONLINE"
              : "OFFLINE"}
          </strong>
          <p>
            MAVLink telemetry connection
          </p>
        </div>

        <div className="result-card">
          <small>Flight Mode</small>
          <strong>
            {telemetry.mode}
          </strong>
          <p>
            Current vehicle mode
          </p>
        </div>

        <div className="result-card">
          <small>Battery</small>
          <strong>
            {telemetry.battery}%
          </strong>
          <p>
            Vehicle battery status
          </p>
        </div>

        <div className="result-card">
          <small>Current Waypoint</small>
          <strong>
            {telemetry.waypoint}
          </strong>
          <p>
            Mission progress
          </p>
        </div>

      </div>


      <div className="results-panel">

        <h3>
          Live Position
        </h3>

        <div className="metrics">

          <div>
            <small>Latitude</small>
            <strong>{telemetry.lat}</strong>
          </div>

          <div>
            <small>Longitude</small>
            <strong>{telemetry.lng}</strong>
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
            <small>Mission</small>
            <strong>
              {telemetry.missionStatus}
            </strong>
          </div>

          <div>
            <small>Saved Waypoints</small>
            <strong>
              {mission?.waypoints?.length || 0}
            </strong>
          </div>

          <div>
            <small>Altitude Setting</small>
            <strong>
              {mission?.altitude || "--"} m
            </strong>
          </div>

          <div>
            <small>Speed Setting</small>
            <strong>
              {mission?.speed || "--"} m/s
            </strong>
          </div>

        </div>

      </div>


      <div className="results-panel">

        <h3>
          Mission Information
        </h3>

        {mission ? (
          <>
            <div className="summary-row">
              <span>Mission name</span>
              <strong>{mission.name}</strong>
            </div>

            <div className="summary-row">
              <span>Route distance</span>
              <strong>
                {mission.distance} m
              </strong>
            </div>

            <div className="summary-row">
              <span>Estimated flight time</span>
              <strong>
                {mission.estimatedTime} sec
              </strong>
            </div>

            <div className="summary-row">
              <span>Return home</span>
              <strong>
                {mission.returnHome
                  ? "Enabled"
                  : "Disabled"}
              </strong>
            </div>
          </>
        ) : (
          <p>
            No saved mission available.
          </p>
        )}

      </div>

    </div>
  );
}