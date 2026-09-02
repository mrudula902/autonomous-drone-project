import React, { useMemo, useState } from "react";
import MapView from "./MapView";
import { saveMissionToBackend } from "./missionApi";
import { validateMission } from "./missionValidator";

export default function MissionPlanner() {
  const [missionName, setMissionName] = useState(
    "New Autonomous Mission"
  );

  const [altitude, setAltitude] = useState(30);
  const [speed, setSpeed] = useState(5);
  const [returnHome, setReturnHome] = useState(true);

  const [waypoints, setWaypoints] = useState([]);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const distance = useMemo(() => {
    if (waypoints.length < 2) {
      return 0;
    }

    let total = 0;

    const R = 6371;

    for (let i = 1; i < waypoints.length; i++) {
      const a = waypoints[i - 1];
      const b = waypoints[i];

      const dLat =
        ((b.lat - a.lat) * Math.PI) / 180;

      const dLon =
        ((b.lng - a.lng) * Math.PI) / 180;

      const lat1 =
        (a.lat * Math.PI) / 180;

      const lat2 =
        (b.lat * Math.PI) / 180;

      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) ** 2;

      total +=
        R *
        2 *
        Math.atan2(
          Math.sqrt(x),
          Math.sqrt(1 - x)
        );
    }

    return total * 1000;
  }, [waypoints]);

  const estimatedTime =
    distance > 0
      ? Math.ceil(
          distance / Number(speed || 1)
        )
      : 0;

  const saveMission = async () => {
    const mission = {
      name: missionName,
      altitude: Number(altitude),
      speed: Number(speed),
      returnHome,
      waypoints,
      distance: Number(distance.toFixed(1)),
      estimatedTime,
      status: "Ready",
      createdAt: new Date().toISOString(),
    };

    const validation =
      validateMission(mission);

    if (!validation.valid) {
      setMessage(
        validation.errors.join(" ")
      );
      return;
    }

    setSaving(true);
    setMessage("Saving mission...");

    try {
      localStorage.setItem(
        "autonomousMission",
        JSON.stringify(mission)
      );

      const missions = JSON.parse(
        localStorage.getItem("missions") || "[]"
      );

      localStorage.setItem(
        "missions",
        JSON.stringify([
          mission,
          ...missions.filter(
            (item) => item.name !== mission.name
          ),
        ])
      );

      await saveMissionToBackend(mission);

      setMessage(
        `Mission saved successfully • ${waypoints.length} waypoints`
      );
    } catch (error) {
      setMessage(
        `Backend error: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mission-planner">
      <div className="planner-header">
        <div>
          <span>
            MISSION CONFIGURATION
          </span>

          <h2>
            Autonomous Flight Plan
          </h2>

          <p>
            Configure the mission before sending it
            to the flight-control system.
          </p>
        </div>

        <button
          className="primary-action"
          onClick={saveMission}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Mission"}
        </button>
      </div>

      {message && (
        <div
          style={{
            margin: "12px 0",
            padding: "12px 16px",
            borderRadius: "10px",
            background:
              "rgba(56, 211, 159, 0.10)",
            color: "#38d39f",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <MapView
          onWaypointsChange={setWaypoints}
        />
      </div>

      <div className="planner-grid">
        <div className="planner-card">
          <label>
            MISSION NAME
          </label>

          <input
            value={missionName}
            onChange={(e) =>
              setMissionName(e.target.value)
            }
          />

          <label>
            FLIGHT ALTITUDE (m)
          </label>

          <input
            type="number"
            min="5"
            max="120"
            value={altitude}
            onChange={(e) =>
              setAltitude(e.target.value)
            }
          />

          <label>
            FLIGHT SPEED (m/s)
          </label>

          <input
            type="number"
            min="1"
            max="15"
            value={speed}
            onChange={(e) =>
              setSpeed(e.target.value)
            }
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={returnHome}
              onChange={(e) =>
                setReturnHome(
                  e.target.checked
                )
              }
            />

            <span>
              Return to launch point
            </span>
          </label>
        </div>

        <div className="planner-card">
          <h3>
            Mission Summary
          </h3>

          <div className="summary-row">
            <span>Waypoints</span>
            <strong>
              {waypoints.length}
            </strong>
          </div>

          <div className="summary-row">
            <span>Route distance</span>
            <strong>
              {distance.toFixed(1)} m
            </strong>
          </div>

          <div className="summary-row">
            <span>Altitude</span>
            <strong>
              {altitude} m
            </strong>
          </div>

          <div className="summary-row">
            <span>Speed</span>
            <strong>
              {speed} m/s
            </strong>
          </div>

          <div className="summary-row">
            <span>Estimated time</span>
            <strong>
              {estimatedTime > 0
                ? `${estimatedTime} sec`
                : "--"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Return home</span>
            <strong>
              {returnHome
                ? "Enabled"
                : "Disabled"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}