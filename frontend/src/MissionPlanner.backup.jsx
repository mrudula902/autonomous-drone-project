import React, {
  useMemo,
  useState,
} from "react";

import MapView from "./MapView";
import { validateMission } from "./missionValidator";

export default function MissionPlanner({
  onSave,
}) {

  const [
    missionName,
    setMissionName,
  ] = useState(
    "New Autonomous Mission"
  );

  const [
    altitude,
    setAltitude,
  ] = useState(30);

  const [
    speed,
    setSpeed,
  ] = useState(5);

  const [
    returnHome,
    setReturnHome,
  ] = useState(true);

  const [
    waypoints,
    setWaypoints,
  ] = useState([]);

  /* =========================
     DISTANCE CALCULATION
  ========================= */

  const distance = useMemo(() => {

    if (waypoints.length < 2) {
      return 0;
    }

    let total = 0;

    for (
      let i = 1;
      i < waypoints.length;
      i++
    ) {

      const a =
        waypoints[i - 1];

      const b =
        waypoints[i];

      const R = 6371;

      const dLat =
        ((b.lat - a.lat) *
          Math.PI) /
        180;

      const dLon =
        ((b.lng - a.lng) *
          Math.PI) /
        180;

      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(
          (a.lat * Math.PI) / 180
        ) *
          Math.cos(
            (b.lat * Math.PI) / 180
          ) *
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

  /* =========================
     ESTIMATED TIME
  ========================= */

  const estimatedTime =
    distance > 0 && Number(speed) > 0
      ? Math.ceil(
          distance / Number(speed)
        )
      : 0;

  /* =========================
     WAYPOINT UPDATE
  ========================= */

  const handleWaypointsChange = (
    updatedWaypoints
  ) => {
    setWaypoints(
      updatedWaypoints
    );
  };

  /* =========================
     SAVE MISSION
  ========================= */

  const saveMission = () => {

    const mission = {

      name: missionName,

      altitude:
        Number(altitude),

      speed:
        Number(speed),

      returnHome,

      waypoints,

      distance:
        Number(
          distance.toFixed(1)
        ),

      estimatedTime,

      createdAt:
        new Date().toISOString(),

    };

    const validation =
      validateMission(mission);

    if (!validation.valid) {

      alert(
        "Mission cannot be saved:\n\n" +
        validation.errors.join(
          "\n"
        )
      );

      return;
    }

    localStorage.setItem(
      "autonomousMission",
      JSON.stringify(mission)
    );

    if (onSave) {
      onSave(mission);
    }

    alert(
      "Mission saved successfully."
    );
  };

  return (

    <div className="mission-planner">

      {/* =========================
          HEADER
      ========================= */}

      <div className="planner-header">

        <div>

          <span>
            MISSION CONFIGURATION
          </span>

          <h2>
            Autonomous Flight Plan
          </h2>

          <p>
            Configure the mission before
            sending it to the flight-control
            system.
          </p>

        </div>

        <button
          className="primary-action"
          onClick={saveMission}
        >
          Save Mission
        </button>

      </div>

      {/* =========================
          CONFIGURATION
      ========================= */}

      <div className="planner-grid">

        <div className="planner-card">

          <label>
            MISSION NAME
          </label>

          <input
            value={missionName}
            onChange={(e) =>
              setMissionName(
                e.target.value
              )
            }
            placeholder="Enter mission name"
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
              setAltitude(
                e.target.value
              )
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
              setSpeed(
                e.target.value
              )
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

        {/* =========================
            LIVE SUMMARY
        ========================= */}

        <div className="planner-card">

          <h3>
            Mission Summary
          </h3>

          <div className="summary-row">
            <span>
              Waypoints
            </span>

            <strong>
              {waypoints.length}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Route distance
            </span>

            <strong>
              {distance.toFixed(1)} m
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Altitude
            </span>

            <strong>
              {altitude} m
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Speed
            </span>

            <strong>
              {speed} m/s
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Estimated time
            </span>

            <strong>
              {estimatedTime > 0
                ? `${estimatedTime} sec`
                : "--"}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Return home
            </span>

            <strong>
              {returnHome
                ? "Enabled"
                : "Disabled"}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          MAP
      ========================= */}

      <MapView
        onWaypointsChange={
          handleWaypointsChange
        }
      />

    </div>
  );
}