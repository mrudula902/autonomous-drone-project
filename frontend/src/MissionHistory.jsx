import React, { useEffect, useState } from "react";

export default function MissionHistory() {

  const [mission, setMission] = useState(null);

  useEffect(() => {

    const saved =
      localStorage.getItem("autonomousMission");

    if (saved) {
      setMission(JSON.parse(saved));
    }

  }, []);

  if (!mission) {

    return (
      <div className="page-shell">

        <div className="page-heading">

          <div>
            <span className="eyebrow">
              MISSION HISTORY
            </span>

            <h2>No missions yet</h2>

            <p>
              Create and save a mission from the
              Mission Planner.
            </p>
          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="page-shell">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            MISSION HISTORY
          </span>

          <h2>{mission.name}</h2>

          <p>
            Saved autonomous mission configuration.
          </p>
        </div>

        <div className="status-pill">
          SAVED
        </div>

      </div>

      <div className="result-grid">

        <div className="result-card">
          <small>WAYPOINTS</small>
          <strong>{mission.waypoints.length}</strong>
          <p>Mission locations</p>
        </div>

        <div className="result-card">
          <small>DISTANCE</small>
          <strong>
            {mission.distance} m
          </strong>
          <p>Planned route</p>
        </div>

        <div className="result-card">
          <small>ALTITUDE</small>
          <strong>
            {mission.altitude} m
          </strong>
          <p>Configured altitude</p>
        </div>

        <div className="result-card">
          <small>SPEED</small>
          <strong>
            {mission.speed}
          </strong>
          <p>m/s</p>
        </div>

      </div>

      <div className="results-panel">

        <h3>Mission Route</h3>

        {mission.waypoints.map((point, index) => (

          <div
            key={point.id || index}
            className="summary-row"
          >

            <span>
              Waypoint {index + 1}
            </span>

            <strong>
              {point.lat.toFixed(6)},
              {" "}
              {point.lng.toFixed(6)}
            </strong>

          </div>

        ))}

      </div>

    </div>
  );
}