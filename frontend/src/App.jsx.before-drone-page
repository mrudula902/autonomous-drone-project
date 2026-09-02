import { useState, useEffect } from "react";
import MissionPlanner from "./MissionPlanner";
import Reports from "./pages/Reports";
import TelemetryPanel from "./TelemetryPanel";
import { getMissionsFromCloud } from "./lib/missionStore";
import "./App.css";

export default function App() {
  const [started, setStarted] =
    useState(false);

  const [page, setPage] =
    useState("Mission Planner");

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

          <div className="welcome-logo">
            ✈
          </div>

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
            onClick={() =>
              setStarted(true)
            }
          >
            Launch Mission Studio
            <span>→</span>
          </button>

          <div className="welcome-status">
            <span></span>
            SYSTEM READY
          </div>

        </div>

        <div className="welcome-drone drone-one">
          ✦
        </div>

        <div className="welcome-drone drone-two">
          ✦
        </div>

        <div className="welcome-drone drone-three">
          ✦
        </div>

        <div className="welcome-drone drone-four">
          ✦
        </div>

      </div>
    );
  }


  return (
    <div className="app">

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
              onClick={() =>
                setPage(item)
              }
            >

              {item === "Mission Planner" &&
                "▣ "}

              {item === "Missions" &&
                "⌖ "}

              {item === "Photos" &&
                "▣ "}

              {item === "Results" &&
                "▥ "}

              {item === "Reports" &&
                "▤ "}

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


      <div className="workspace">


        <aside className="sidebar">

          <div className="sidebar-mountain"></div>

          <div className="sidebar-content">

            <div className="section-title">
              MISSION CONTROL
            </div>


            <div className="side-menu">

              {menu.map(
                ([icon, name]) => (

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

                )
              )}

            </div>


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


            <div className="weather-card">

              <div className="weather-title">
                MISSION CONDITIONS
              </div>

              <div className="temperature">
                <span>☀️</span>
                <strong>28°C</strong>
              </div>

              <div className="weather-status">
                Sunny
              </div>

              <div className="weather-grid">

                <div>
                  <strong>
                    12 km/h
                  </strong>
                  <small>Wind</small>
                </div>

                <div>
                  <strong>
                    65%
                  </strong>
                  <small>Humidity</small>
                </div>

                <div>
                  <strong>
                    Good
                  </strong>
                  <small>Visibility</small>
                </div>

              </div>

            </div>

          </div>

        </aside>


        <main className="main-content">

          {page === "Mission Planner" && (
            <>
              <MissionPlanner />
              <TelemetryPanel />
            </>
          )}

          {page === "Missions" && (
            <MissionsPage
              onCreateMission={() =>
                setPage("Mission Planner")
              }
            />
          )}

          {page === "Photos" && (
            <PhotosPage />
          )}

          {page === "Results" && (
            <ResultsPage />
          )}

          {page === "Reports" && (
            <Reports />
          )}

          {page === "Settings" && (
            <SettingsPage />
          )}

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   CLOUD MISSIONS
========================================================= */

function MissionsPage({
  onCreateMission,
}) {
  const [missions, setMissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadMissions = async () => {

    setLoading(true);

    try {

      const rows =
        await getMissionsFromCloud();

      const cloudMissions =
        rows.map(
          (row) => row.mission_data
        );

      setMissions(
        cloudMissions
      );

    } catch (error) {

      console.error(error);

      const local =
        JSON.parse(
          localStorage.getItem(
            "missions"
          ) || "[]"
        );

      setMissions(local);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadMissions();

    const refresh = () =>
      loadMissions();

    window.addEventListener(
      "missions-updated",
      refresh
    );

    return () =>
      window.removeEventListener(
        "missions-updated",
        refresh
      );

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


      {loading ? (

        <div className="mission-row">

          <div className="mission-status-dot"></div>

          <div className="mission-details">

            <h3>
              Loading missions...
            </h3>

            <p>
              Connecting to cloud storage.
            </p>

          </div>

        </div>

      ) : missions.length === 0 ? (

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

  const localMission =
    JSON.parse(
      localStorage.getItem(
        "autonomousMission"
      ) || "null"
    );

  return (
    <PageShell
      eyebrow="PHOTOS"
      title="Mission photos"
      description="Review aerial images captured during survey missions."
    >

      <div className="photo-summary">

        <div>
          <span>
            {localMission?.estimatedPhotos ||
              0}
          </span>

          <small>
            Planned photos
          </small>
        </div>

        <div>
          <span>0</span>
          <small>
            Captured images
          </small>
        </div>

        <div>
          <span>
            {localMission?.waypoints?.length ||
              0}
          </span>

          <small>
            Waypoints
          </small>
        </div>

      </div>

    </PageShell>
  );
}


/* =========================================================
   RESULTS
========================================================= */

function ResultsPage() {

  return (
    <PageShell
      eyebrow="RESULTS"
      title="Survey results"
      description="Review vehicle telemetry and mission results."
    >

      <ResultCard
        title="Telemetry"
        value="Available on connected workstation"
        text="Live SITL/MAVLink telemetry remains tied to the local flight-control environment."
      />

      <ResultCard
        title="Cloud Missions"
        value="Enabled"
        text="Mission history is stored in the shared cloud database."
      />

    </PageShell>
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
          title="Cloud storage"
          value="Supabase"
        />

        <Setting
          title="Map"
          value="OpenStreetMap"
        />

        <Setting
          title="System status"
          value="Ready"
        />

      </div>

    </PageShell>
  );
}


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

          <h2>{title}</h2>

          <p>{description}</p>

        </div>

      </div>

      {children}

    </div>
  );
}


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
        <small>Distance</small>
        <strong>{area}</strong>
      </div>

      <div className="mission-data">
        <small>Flight</small>
        <strong>{time}</strong>
      </div>

      <div className="status-pill">
        {status}
      </div>

    </div>
  );
}


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