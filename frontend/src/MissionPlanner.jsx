import React, { useMemo, useState } from "react";
import MapView from "./MapView";
import { validateMission } from "./missionValidator";
import { saveMissionToCloud } from "./lib/missionStore";

export default function MissionPlanner() {
  const [missionName, setMissionName] = useState(
    "New Autonomous Mission"
  );

  const [altitude, setAltitude] = useState(30);
  const [speed, setSpeed] = useState(5);
  const [returnHome, setReturnHome] = useState(true);

  const [surveyType, setSurveyType] =
    useState("Waypoint Survey");

  const [photoGrid, setPhotoGrid] =
    useState(true);

  const [frontOverlap, setFrontOverlap] =
    useState(80);

  const [sideOverlap, setSideOverlap] =
    useState(70);

  const [courseAngle, setCourseAngle] =
    useState(0);

  const [photoInterval, setPhotoInterval] =
    useState(2);

  const [cameraAction, setCameraAction] =
    useState("Take Photo");

  const [gimbalAngle, setGimbalAngle] =
    useState(-90);

  const [hoverTime, setHoverTime] =
    useState(0);

  const [waypoints, setWaypoints] =
    useState([]);

  const [saving, setSaving] =
    useState(false);


  const distance = useMemo(() => {
    if (waypoints.length < 2) return 0;

    let total = 0;
    const R = 6371000;

    for (let i = 1; i < waypoints.length; i++) {
      const a = waypoints[i - 1];
      const b = waypoints[i];

      const lat1 =
        (a.lat * Math.PI) / 180;

      const lat2 =
        (b.lat * Math.PI) / 180;

      const dLat =
        ((b.lat - a.lat) * Math.PI) / 180;

      const dLon =
        ((b.lng - a.lng) * Math.PI) / 180;

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

    return total;
  }, [waypoints]);


  const estimatedTime =
    distance > 0 && Number(speed) > 0
      ? Math.ceil(
          distance / Number(speed)
        )
      : 0;


  const estimatedPhotos = photoGrid
    ? Math.max(
        waypoints.length,
        Math.floor(
          distance /
            Math.max(
              1,
              Number(photoInterval)
            )
        )
      )
    : 0;


  const saveMission = async () => {
    const mission = {
      name: missionName,
      altitude: Number(altitude),
      speed: Number(speed),
      returnHome,

      survey: {
        type: surveyType,
        photoGrid,
        frontOverlap: Number(frontOverlap),
        sideOverlap: Number(sideOverlap),
        courseAngle: Number(courseAngle),
        photoInterval: Number(photoInterval),
      },

      camera: {
        action: cameraAction,
        gimbalAngle: Number(gimbalAngle),
        hoverTime: Number(hoverTime),
      },

      waypoints,

      distance:
        Number(distance.toFixed(1)),

      estimatedTime,
      estimatedPhotos,

      createdAt:
        new Date().toISOString(),

      status: "Ready",
    };


    const validation =
      validateMission(mission);


    if (!validation.valid) {
      alert(
        "Mission cannot be saved:\n\n" +
          validation.errors.join("\n")
      );

      return;
    }


    setSaving(true);


    try {
      await saveMissionToCloud(mission);

      localStorage.setItem(
        "autonomousMission",
        JSON.stringify(mission)
      );

      const oldMissions =
        JSON.parse(
          localStorage.getItem(
            "missions"
          ) || "[]"
        );

      localStorage.setItem(
        "missions",
        JSON.stringify([
          mission,
          ...oldMissions.filter(
            (m) =>
              m.name !== mission.name
          ),
        ])
      );

      window.dispatchEvent(
        new Event("missions-updated")
      );

      alert(
        "Mission saved successfully!\n\n" +
          "Cloud database: ONLINE\n" +
          `Waypoints: ${waypoints.length}`
      );

    } catch (error) {
      alert(
        "Cloud save failed:\n\n" +
          error.message
      );
    } finally {
      setSaving(false);
    }
  };


  const resetMission = () => {
    setMissionName(
      "New Autonomous Mission"
    );

    setAltitude(30);
    setSpeed(5);
    setReturnHome(true);

    setSurveyType(
      "Waypoint Survey"
    );

    setPhotoGrid(true);
    setFrontOverlap(80);
    setSideOverlap(70);
    setCourseAngle(0);
    setPhotoInterval(2);

    setCameraAction(
      "Take Photo"
    );

    setGimbalAngle(-90);
    setHoverTime(0);

    setWaypoints([]);
  };


  return (
    <div className="mission-planner">

      <div className="heading-row">

        <div>

          <div className="eyebrow">
            MISSION PLANNER
          </div>

          <h2>
            Plan your next survey mission
          </h2>

          <p>
            Select a survey area, configure the
            flight plan and prepare the mission.
          </p>

        </div>


        <button
          type="button"
          className="new-mission"
          onClick={resetMission}
        >
          + New Mission
        </button>

      </div>


      <section className="stats">

        <div className="stat-card">

          <span className="stat-icon blue">
            ⌁
          </span>

          <div>

            <small>
              Survey Route
            </small>

            <strong>
              {distance > 0
                ? `${(
                    distance / 1000
                  ).toFixed(2)} km`
                : "0 km"}
            </strong>

            <em>
              Calculated distance
            </em>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon purple">
            ⌖
          </span>

          <div>

            <small>
              Waypoints
            </small>

            <strong>
              {waypoints.length}
            </strong>

            <em>
              Flight points
            </em>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon green">
            ◉
          </span>

          <div>

            <small>
              Photo Points
            </small>

            <strong>
              {estimatedPhotos}
            </strong>

            <em>
              Planned capture points
            </em>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon orange">
            ✈
          </span>

          <div>

            <small>
              Mission Status
            </small>

            <strong>
              {waypoints.length >= 2
                ? "Ready"
                : "Draft"}
            </strong>

            <em>
              {waypoints.length >= 2
                ? "Mission configured"
                : "Add waypoints"}
            </em>

          </div>

        </div>

      </section>


      <MapView
        onWaypointsChange={
          setWaypoints
        }
      />


      <section className="planner-grid">


        <div className="planner-card">

          <h3>
            Flight Configuration
          </h3>

          <label>
            MISSION NAME
          </label>

          <input
            type="text"
            value={missionName}
            onChange={(e) =>
              setMissionName(
                e.target.value
              )
            }
          />


          <label>
            SURVEY TYPE
          </label>

          <select
            value={surveyType}
            onChange={(e) =>
              setSurveyType(
                e.target.value
              )
            }
          >

            <option>
              Grid Survey
            </option>

            <option>
              Waypoint Survey
            </option>

            <option>
              Mapping Survey
            </option>

            <option>
              Inspection Survey
            </option>

          </select>


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
            min="0.1"
            max="15"
            step="0.1"
            value={speed}
            onChange={(e) =>
              setSpeed(
                e.target.value
              )
            }
          />


          <label>
            COURSE ANGLE (°)
          </label>

          <input
            type="number"
            min="0"
            max="359"
            value={courseAngle}
            onChange={(e) =>
              setCourseAngle(
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


        <div className="planner-card">

          <h3>
            Photo Grid & Survey
          </h3>


          <label className="checkbox-row">

            <input
              type="checkbox"
              checked={photoGrid}
              onChange={(e) =>
                setPhotoGrid(
                  e.target.checked
                )
              }
            />

            <span>
              Enable Photo Grid
            </span>

          </label>


          <label>
            FRONT OVERLAP (%)
          </label>

          <input
            type="number"
            min="10"
            max="95"
            value={frontOverlap}
            disabled={!photoGrid}
            onChange={(e) =>
              setFrontOverlap(
                e.target.value
              )
            }
          />


          <label>
            SIDE OVERLAP (%)
          </label>

          <input
            type="number"
            min="10"
            max="95"
            value={sideOverlap}
            disabled={!photoGrid}
            onChange={(e) =>
              setSideOverlap(
                e.target.value
              )
            }
          />


          <label>
            PHOTO INTERVAL (m)
          </label>

          <input
            type="number"
            min="1"
            max="100"
            value={photoInterval}
            disabled={!photoGrid}
            onChange={(e) =>
              setPhotoInterval(
                e.target.value
              )
            }
          />


          <div className="summary-row">

            <span>
              Planned photo points
            </span>

            <strong>
              {estimatedPhotos}
            </strong>

          </div>

        </div>


        <div className="planner-card">

          <h3>
            Camera Options
          </h3>


          <label>
            CAMERA ACTION
          </label>

          <select
            value={cameraAction}
            onChange={(e) =>
              setCameraAction(
                e.target.value
              )
            }
          >

            <option>
              Take Photo
            </option>

            <option>
              Start Recording
            </option>

            <option>
              Stop Recording
            </option>

          </select>


          <label>
            GIMBAL ANGLE (°)
          </label>

          <input
            type="number"
            min="-90"
            max="30"
            value={gimbalAngle}
            onChange={(e) =>
              setGimbalAngle(
                e.target.value
              )
            }
          />


          <label>
            HOVER TIME (sec)
          </label>

          <input
            type="number"
            min="0"
            max="30"
            value={hoverTime}
            onChange={(e) =>
              setHoverTime(
                e.target.value
              )
            }
          />

        </div>


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
              Estimated flight time
            </span>

            <strong>
              {estimatedTime > 0
                ? `${estimatedTime} sec`
                : "--"}
            </strong>
          </div>


          <div className="summary-row">
            <span>
              Photo grid
            </span>

            <strong>
              {photoGrid
                ? "Enabled"
                : "Disabled"}
            </strong>
          </div>


          <div className="summary-row">
            <span>
              Front overlap
            </span>

            <strong>
              {frontOverlap}%
            </strong>
          </div>


          <div className="summary-row">
            <span>
              Side overlap
            </span>

            <strong>
              {sideOverlap}%
            </strong>
          </div>


          <div className="summary-row">
            <span>
              Camera action
            </span>

            <strong>
              {cameraAction}
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


          <button
            type="button"
            className="primary-action"
            onClick={saveMission}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Mission"}
          </button>

        </div>

      </section>

    </div>
  );
}