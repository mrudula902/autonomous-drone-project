import { useState, useEffect } from "react";
import MissionPlanner from "./MissionPlanner";
import Reports from "./pages/Reports";
import TelemetryPanel from "./TelemetryPanel";
import "./App.css";

export default function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("Mission Planner");

  const menu = [
    ["🗺", "Mission Planner"],
    ["📍", "Missions"],
    ["📷", "Photos"],
    ["📊", "Results"],
    ["📄", "Reports"],
    ["⚙", "Settings"],
  ];

  if (!started) {
    return (
      <div className="welcome-screen">
        <div className="welcome-overlay"></div>

        <div className="welcome-content">
          <div className="welcome-logo">✈</div>

          <div className="welcome-kicker">
            AUTONOMOUS DRONE SYSTEM
          </div>

          <h1>
            DRONE <span>MISSION STUDIO</span>
          </h1>

          <p>
            Autonomous Survey & Mission Planning System
          </p>

          <button
            className="launch-button"
            onClick={() => setStarted(true)}
          >
            Launch Mission Studio
            <span>→</span>
          </button>

          <div className="welcome-status">
            <span></span>
            SYSTEM READY
          </div>
        </div>

        <div className="welcome-drone drone-one">✦</div>
        <div className="welcome-drone drone-two">✦</div>
        <div className="welcome-drone drone-three">✦</div>
        <div className="welcome-drone drone-four">✦</div>
      </div>
    );
  }

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            ✈
          </div>

          <div>
            <h1>
              DRONE <span>MISSION STUDIO</span>
            </h1>

            <p>
              Autonomous Survey & Mission Planning System
            </p>
          </div>

        </div>


        <nav className="top-navigation">

          {[
            "Mission Planner",
            "Missions",
            "Photos",
            "Results",
            "Reports",
          ].map((item) => (

            <button
              key={item}
              className={
                page === item
                  ? "top-active"
                  : ""
              }
              onClick={() => setPage(item)}
            >

              {item === "Mission Planner" && "▣ "}
              {item === "Missions" && "⌖ "}
              {item === "Photos" && "▣ "}
              {item === "Results" && "▥ "}
              {item === "Reports" && "▤ "}

              {item}

            </button>

          ))}

        </nav>


        <div className="system-status">

          <span></span>

          <div>
            SYSTEM READY
            <small>
              All systems operational
            </small>
          </div>

        </div>


        <div className="profile">
          M
        </div>

      </header>


      {/* ================= WORKSPACE ================= */}

      <div className="workspace">


        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">

          <div className="sidebar-mountain"></div>

          <div className="sidebar-content">

            <div className="section-title">
              MISSION CONTROL
            </div>


            <div className="side-menu">

              {menu.map(([icon, name]) => (

                <button
                  key={name}
                  className={
                    page === name
                      ? "side-active"
                      : ""
                  }
                  onClick={() =>
                    setPage(name)
                  }
                >

                  <span className="menu-icon">
                    {icon}
                  </span>

                  <span>
                    {name}
                  </span>

                </button>

              ))}

            </div>


            {/* ================= AIRCRAFT ================= */}

            <div className="aircraft-card">

              <div className="aircraft-title">
                AIRCRAFT
              </div>


              <div className="drone-visual">

                <div className="drone-arm left-arm"></div>
                <div className="drone-arm right-arm"></div>

                <div className="propeller prop-one"></div>
                <div className="propeller prop-two"></div>
                <div className="propeller prop-three"></div>
                <div className="propeller prop-four"></div>

                <div className="drone-body">

                  <div className="drone-camera"></div>

                  <div className="drone-light"></div>

                </div>

              </div>


              <h3>
                DJI Mavic 4 Pro
              </h3>


              <div className="connection">

                <span></span>

                Ready for mission

              </div>


              <div className="battery">

                <div className="battery-track">
                  <span></span>
                </div>

                <b>
                  92%
                </b>

              </div>

            </div>


            {/* ================= WEATHER ================= */}

            <div className="weather-card">

              <div className="weather-title">
                MISSION CONDITIONS
              </div>


              <div className="temperature">

                <span>
                  ☀️
                </span>

                <strong>
                  28°C
                </strong>

              </div>


              <div className="weather-status">
                Sunny
              </div>


              <div className="weather-grid">

                <div>

                  <strong>
                    12 km/h
                  </strong>

                  <small>
                    Wind
                  </small>

                </div>


                <div>

                  <strong>
                    65%
                  </strong>

                  <small>
                    Humidity
                  </small>

                </div>


                <div>

                  <strong>
                    Good
                  </strong>

                  <small>
                    Visibility
                  </small>

                </div>

              </div>

            </div>

          </div>

        </aside>


        {/* ================= MAIN ================= */}

        <main className="main-content">


          {/* MISSION PLANNER */}

          {page === "Mission Planner" && (
            <>
              <MissionPlanner />

              <TelemetryPanel />
            </>
          )}


          {/* MISSIONS */}

          {page === "Missions" && (

            <MissionsPage
              onCreateMission={() =>
                setPage("Mission Planner")
              }
            />

          )}


          {/* PHOTOS */}

          {page === "Photos" && (
            <PhotosPage />
          )}


          {/* RESULTS */}

          {page === "Results" && (
            <ResultsPage />
          )}


          {/* REPORTS */}

          {page === "Reports" && (
            <Reports />
          )}


          {/* SETTINGS */}

          {page === "Settings" && (
            <SettingsPage />
          )}

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   MISSIONS
========================================================= */

function MissionsPage({
  onCreateMission,
}) {

  const [missions, setMissions] = useState([]);

  const loadMissions = () => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "missions"
          ) || "[]"
        );

      setMissions(saved);

    } catch {

      setMissions([]);

    }

  };


  useEffect(() => {

    loadMissions();

    const refresh = () => {
      loadMissions();
    };

    window.addEventListener(
      "missions-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "missions-updated",
        refresh
      );
    };

  }, []);


  return (

    <PageShell
      eyebrow="MISSIONS"
      title="Mission management"
      description="Create, review and manage autonomous survey missions."
    >

      <div className="page-actions">

        <button
          type="button"
          className="primary-action"
          onClick={onCreateMission}
        >
          + Create Mission
        </button>

      </div>


      {missions.length === 0 ? (

        <div className="mission-row">

          <div className="mission-status-dot"></div>

          <div className="mission-details">

            <h3>
              No missions yet
            </h3>

            <p>
              Create your first autonomous
              survey mission.
            </p>

          </div>

        </div>

      ) : (

        <div className="mission-list">

          {missions.map(
            (mission, index) => (

              <Mission
                key={
                  mission.createdAt ||
                  index
                }

                name={
                  mission.name
                }

                location={
                  `${
                    mission.waypoints?.length ||
                    0
                  } waypoints`
                }

                status={
                  mission.status ||
                  "Ready"
                }

                area={
                  `${
                    mission.distance ||
                    0
                  } m`
                }

                time={
                  `${
                    mission.estimatedTime ||
                    0
                  } sec`
                }

              />

            )
          )}

        </div>

      )}

    </PageShell>
  );
}


/* =========================================================
   PHOTOS
========================================================= */

function PhotosPage() {

  const mission =
    JSON.parse(
      localStorage.getItem(
        "autonomousMission"
      ) || "null"
    );

  const photos =
    mission?.estimatedPhotos ||
    0;

  return (

    <PageShell
      eyebrow="PHOTOS"
      title="Mission photos"
      description="Review aerial images captured during survey missions."
    >

      <div className="photo-summary">

        <div>

          <span>
            {photos}
          </span>

          <small>
            Planned photos
          </small>

        </div>


        <div>

          <span>
            0
          </span>

          <small>
            Captured images
          </small>

        </div>


        <div>

          <span>
            {mission?.waypoints?.length || 0}
          </span>

          <small>
            Mission waypoints
          </small>

        </div>

      </div>


      <div className="photo-grid">

        <PhotoCard number="01" />

        <PhotoCard number="02" />

        <PhotoCard number="03" />

      </div>

    </PageShell>
  );
}


/* =========================================================
   RESULTS
========================================================= */

function ResultsPage() {

  const [telemetry, setTelemetry] =
    useState({
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


  const [mission, setMission] =
    useState(null);


  useEffect(() => {

    const loadData = async () => {

      /* TELEMETRY */

      try {

        const response =
          await fetch(
            "http://127.0.0.1:5001/api/telemetry"
          );

        if (response.ok) {

          const data =
            await response.json();

          setTelemetry(data);

        }

      } catch {

        setTelemetry(
          (old) => ({
            ...old,
            connected: false,
            missionStatus:
              "BACKEND OFFLINE",
          })
        );

      }


      /* MISSION */

      try {

        const response =
          await fetch(
            "http://127.0.0.1:5000/api/missions/current"
          );

        if (response.ok) {

          const data =
            await response.json();

          setMission(
            data.mission
          );

        }

      } catch {

        const localMission =
          localStorage.getItem(
            "autonomousMission"
          );

        if (localMission) {

          try {

            setMission(
              JSON.parse(
                localMission
              )
            );

          } catch {

            setMission(null);

          }

        }

      }

    };


    loadData();

    const timer =
      setInterval(
        loadData,
        1000
      );


    return () =>
      clearInterval(timer);

  }, []);


  const waypointCount =
    mission?.waypoints?.length ||
    0;


  return (

    <div className="page-shell">

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            RESULTS
          </div>

          <h2>
            Live survey results
          </h2>

          <p>
            Mission data and simulated vehicle
            telemetry from the flight-control system.
          </p>

        </div>

      </div>


      {/* TOP RESULTS */}

      <div className="result-grid">

        <ResultCard
          title="Connection"
          value={
            telemetry.connected
              ? "ONLINE"
              : "OFFLINE"
          }
          text="MAVLink telemetry"
        />

        <ResultCard
          title="Flight Mode"
          value={
            telemetry.mode
          }
          text="Current vehicle mode"
        />

        <ResultCard
          title="Battery"
          value={
            `${telemetry.battery}%`
          }
          text="Vehicle battery"
        />

        <ResultCard
          title="Current Waypoint"
          value={
            telemetry.waypoint
          }
          text="Mission progress"
        />

      </div>


      {/* LIVE POSITION */}

      <div className="results-panel">

        <h3>
          Live Vehicle Position
        </h3>


        <div className="metrics">

          <div>
            <small>
              Latitude
            </small>

            <strong>
              {telemetry.lat}
            </strong>
          </div>


          <div>
            <small>
              Longitude
            </small>

            <strong>
              {telemetry.lng}
            </strong>
          </div>


          <div>
            <small>
              Altitude
            </small>

            <strong>
              {telemetry.altitude} m
            </strong>
          </div>


          <div>
            <small>
              Ground Speed
            </small>

            <strong>
              {telemetry.speed} m/s
            </strong>
          </div>


          <div>
            <small>
              Mission Status
            </small>

            <strong>
              {telemetry.missionStatus}
            </strong>
          </div>


          <div>
            <small>
              Waypoints
            </small>

            <strong>
              {waypointCount}
            </strong>
          </div>


          <div>
            <small>
              Altitude Setting
            </small>

            <strong>
              {mission?.altitude || "--"} m
            </strong>
          </div>


          <div>
            <small>
              Speed Setting
            </small>

            <strong>
              {mission?.speed || "--"} m/s
            </strong>
          </div>

        </div>

      </div>


      {/* MISSION INFORMATION */}

      <div className="results-panel">

        <h3>
          Mission Information
        </h3>


        {mission ? (

          <>

            <div className="summary-row">

              <span>
                Mission name
              </span>

              <strong>
                {mission.name}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Route distance
              </span>

              <strong>
                {mission.distance} m
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Estimated flight time
              </span>

              <strong>
                {mission.estimatedTime} sec
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Survey type
              </span>

              <strong>
                {mission.survey?.type ||
                  "Waypoint Survey"}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Photo grid
              </span>

              <strong>
                {mission.survey?.photoGrid
                  ? "Enabled"
                  : "Disabled"}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Front overlap
              </span>

              <strong>
                {mission.survey?.frontOverlap ??
                  "--"}%
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Side overlap
              </span>

              <strong>
                {mission.survey?.sideOverlap ??
                  "--"}%
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Return home
              </span>

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


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {

  return (

    <PageShell
      eyebrow="SETTINGS"
      title="System settings"
      description="Configure the mission planning system."
    >

      <div className="settings-panel">

        <Setting
          title="Aircraft"
          value="DJI Mavic 4 Pro"
        />

        <Setting
          title="Mission mode"
          value="Autonomous Survey"
        />

        <Setting
          title="Map"
          value="OpenStreetMap"
        />

        <Setting
          title="Telemetry"
          value="MAVLink / SITL"
        />

        <Setting
          title="System status"
          value="Ready"
        />

      </div>

    </PageShell>
  );
}


/* =========================================================
   PAGE SHELL
========================================================= */

function PageShell({
  eyebrow,
  title,
  description,
  children,
}) {

  return (

    <div className="page-shell">

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            {eyebrow}
          </div>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}


/* =========================================================
   MISSION
========================================================= */

function Mission({
  name,
  location,
  status,
  area,
  time,
}) {

  return (

    <div className="mission-row">

      <div className="mission-status-dot"></div>


      <div className="mission-details">

        <h3>
          {name}
        </h3>

        <p>
          {location}
        </p>

      </div>


      <div className="mission-data">

        <small>
          Distance
        </small>

        <strong>
          {area}
        </strong>

      </div>


      <div className="mission-data">

        <small>
          Flight
        </small>

        <strong>
          {time}
        </strong>

      </div>


      <div className="status-pill">

        {status}

      </div>

    </div>
  );
}


/* =========================================================
   PHOTO
========================================================= */

function PhotoCard({
  number,
}) {

  return (

    <div className="photo-card">

      <div className="photo-placeholder">

        <span>
          DRONE
        </span>

        <strong>
          PHOTO {number}
        </strong>

      </div>


      <div className="photo-info">

        <strong>
          Mission capture
        </strong>

        <small>
          Waiting for flight data
        </small>

      </div>

    </div>
  );
}


/* =========================================================
   RESULT CARD
========================================================= */

function ResultCard({
  title,
  value,
  text,
}) {

  return (

    <div className="result-card">

      <small>
        {title}
      </small>

      <strong>
        {value}
      </strong>

      <p>
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   SETTING
========================================================= */

function Setting({
  title,
  value,
}) {

  return (

    <div className="setting-row">

      <div>

        <small>
          {title}
        </small>

        <strong>
          {value}
        </strong>

      </div>

      <span>
        ›
      </span>

    </div>
  );
}