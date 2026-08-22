import { useState } from "react";
import MapView from "./MapView";
import MissionPlanner from "./MissionPlanner";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("Mission Planner");
  const [waypoints, setWaypoints] = useState([]);
  const [savedMission, setSavedMission] = useState(
    localStorage.getItem("autonomousMission")
  );

  const menu = [
    ["🗺", "Mission Planner"],
    ["📍", "Missions"],
    ["📷", "Photos"],
    ["📊", "Results"],
    ["📄", "Reports"],
    ["⚙", "Settings"],
  ];

  const handleMissionSaved = (mission) => {
    setSavedMission(JSON.stringify(mission));
  };

  /* =========================
     WELCOME SCREEN
  ========================= */

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

  /* =========================
     SIDEBAR
  ========================= */

  const Sidebar = () => (
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
              className={page === name ? "side-active" : ""}
              onClick={() => setPage(name)}
            >
              <span className="menu-icon">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>

        {/* AIRCRAFT */}
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

          <h3>DJI Mavic 4 Pro</h3>

          <div className="connection">
            <span></span>
            Ready for mission
          </div>

          <div className="battery">
            <div className="battery-track">
              <span></span>
            </div>
            <b>92%</b>
          </div>

        </div>

        {/* CONDITIONS */}
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
              <strong>12 km/h</strong>
              <small>Wind</small>
            </div>

            <div>
              <strong>65%</strong>
              <small>Humidity</small>
            </div>

            <div>
              <strong>Good</strong>
              <small>Visibility</small>
            </div>
          </div>

        </div>

      </div>
    </aside>
  );

  /* =========================
     MISSION PLANNER
  ========================= */

  const MissionPlannerPage = () => (
    <>
      <div className="planner-page-header">
        <div>
          <div className="planner-kicker">
            MISSION PLANNER
          </div>

          <h1>Plan Your Next Survey</h1>

          <p>
            Create an autonomous flight mission by defining
            your survey area and flight parameters.
          </p>
        </div>

        <div className="planner-header-status">
          <span></span>
          AIRCRAFT READY
        </div>
      </div>

      {/* SURVEY AREA */}
      <div className="survey-section">

        <div className="survey-section-header">
          <div>
            <span className="section-eyebrow">
              SURVEY AREA
            </span>

            <h2>Define Flight Area</h2>
          </div>

          <div className="waypoint-badge">
            {waypoints.length} WAYPOINT
            {waypoints.length !== 1 ? "S" : ""}
          </div>
        </div>

        <div
          className="map-wrapper"
          style={{
            width: "100%",
            minHeight: "430px",
            overflow: "hidden",
            borderRadius: "14px",
            position: "relative",
          }}
        >
          <MapView onWaypointsChange={setWaypoints} />
        </div>

      </div>

      {/* SQUARE / WAYPOINT AREA */}
      <div className="survey-tools">

        <div className="survey-tool-card">
          <div className="tool-icon">▦</div>

          <div>
            <h3>Square Area</h3>

            <p>
              Click on the map to define survey
              waypoints and create your flight route.
            </p>
          </div>
        </div>

        <div className="survey-tool-card">
          <div className="tool-icon">⌖</div>

          <div>
            <h3>Waypoint Planning</h3>

            <p>
              {waypoints.length > 0
                ? `${waypoints.length} waypoint${
                    waypoints.length !== 1 ? "s" : ""
                  } selected`
                : "Select locations directly on the map"}
            </p>
          </div>
        </div>

        <div className="survey-tool-card">
          <div className="tool-icon">↗</div>

          <div>
            <h3>Autonomous Route</h3>

            <p>
              The system connects your selected
              points into an executable mission route.
            </p>
          </div>
        </div>

      </div>

      {/* MISSION CONFIGURATION */}
      <MissionPlanner
        waypoints={waypoints}
        onSave={handleMissionSaved}
      />

      {/* BOTTOM STATUS */}
      <div className="mission-bottom-bar">

        <div>
          <span>MISSION STATUS</span>
          <strong>
            {savedMission ? "MISSION SAVED" : "READY TO PLAN"}
          </strong>
        </div>

        <div>
          <span>WAYPOINTS</span>
          <strong>{waypoints.length}</strong>
        </div>

        <div>
          <span>AIRCRAFT</span>
          <strong>DJI MAVIC 4 PRO</strong>
        </div>

        <div>
          <span>FLIGHT MODE</span>
          <strong>AUTONOMOUS</strong>
        </div>

      </div>
    </>
  );

  /* =========================
     MISSIONS PAGE
  ========================= */

  const MissionsPage = () => {
    let mission = null;

    try {
      mission = savedMission
        ? JSON.parse(savedMission)
        : null;
    } catch {
      mission = null;
    }

    return (
      <div className="generic-page">

        <div className="planner-kicker">
          MISSIONS
        </div>

        <h1>Mission Library</h1>

        <p className="page-description">
          Review and manage autonomous survey missions.
        </p>

        {mission ? (
          <div className="mission-library-grid">

            <div className="mission-library-card">
              <div className="card-status">SAVED</div>

              <h2>{mission.name}</h2>

              <p>
                Autonomous survey mission
              </p>

              <div className="mission-card-stats">
                <div>
                  <span>Waypoints</span>
                  <strong>{mission.waypoints?.length || 0}</strong>
                </div>

                <div>
                  <span>Altitude</span>
                  <strong>{mission.altitude} m</strong>
                </div>

                <div>
                  <span>Speed</span>
                  <strong>{mission.speed} m/s</strong>
                </div>

                <div>
                  <span>Distance</span>
                  <strong>{mission.distance} m</strong>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="empty-page">
            <div className="empty-icon">📍</div>
            <h2>No missions yet</h2>
            <p>
              Create your first autonomous mission
              from Mission Planner.
            </p>

            <button
              className="primary-action"
              onClick={() => setPage("Mission Planner")}
            >
              Create Mission
            </button>
          </div>
        )}

      </div>
    );
  };

  /* =========================
     PHOTOS
  ========================= */

  const PhotosPage = () => (
    <div className="generic-page">

      <div className="planner-kicker">
        PHOTOS
      </div>

      <h1>Survey Photos</h1>

      <p className="page-description">
        Aerial imagery captured during autonomous missions.
      </p>

      <div className="photo-grid">

        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="photo-placeholder" key={item}>
            <div>📷</div>
            <span>PHOTO {String(item).padStart(2, "0")}</span>
            <small>Awaiting mission capture</small>
          </div>
        ))}

      </div>

    </div>
  );

  /* =========================
     RESULTS
  ========================= */

  const ResultsPage = () => (
    <div className="generic-page">

      <div className="planner-kicker">
        RESULTS
      </div>

      <h1>Mission Results</h1>

      <p className="page-description">
        Flight performance and survey analysis.
      </p>

      <div className="result-grid">

        <div className="result-card">
          <span>FLIGHT DISTANCE</span>
          <strong>
            {savedMission
              ? `${JSON.parse(savedMission).distance || 0} m`
              : "--"}
          </strong>
        </div>

        <div className="result-card">
          <span>WAYPOINTS</span>
          <strong>{waypoints.length}</strong>
        </div>

        <div className="result-card">
          <span>MISSION STATUS</span>
          <strong>
            {savedMission ? "READY" : "NO DATA"}
          </strong>
        </div>

        <div className="result-card">
          <span>AIRCRAFT</span>
          <strong>MAVIC 4 PRO</strong>
        </div>

      </div>

    </div>
  );

  /* =========================
     REPORTS
  ========================= */

  const ReportsPage = () => (
    <div className="generic-page">

      <div className="planner-kicker">
        REPORTS
      </div>

      <h1>Mission Reports</h1>

      <p className="page-description">
        Mission summaries and autonomous flight documentation.
      </p>

      <div className="report-card">

        <div className="report-icon">📄</div>

        <div>
          <h2>
            Autonomous Mission Report
          </h2>

          <p>
            {savedMission
              ? "Mission data available for reporting."
              : "Complete and save a mission to generate a report."}
          </p>
        </div>

        <button
          className="primary-action"
          disabled={!savedMission}
          onClick={() =>
            alert(
              "Report generation interface ready for integration."
            )
          }
        >
          Generate Report
        </button>

      </div>

    </div>
  );

  /* =========================
     SETTINGS
  ========================= */

  const SettingsPage = () => (
    <div className="generic-page">

      <div className="planner-kicker">
        SETTINGS
      </div>

      <h1>System Settings</h1>

      <p className="page-description">
        Autonomous mission system configuration.
      </p>

      <div className="settings-card">

        <div className="setting-row">
          <div>
            <strong>Aircraft</strong>
            <span>DJI Mavic 4 Pro</span>
          </div>
          <b className="ready-label">READY</b>
        </div>

        <div className="setting-row">
          <div>
            <strong>Flight Mode</strong>
            <span>Autonomous Mission Planning</span>
          </div>
          <b>ACTIVE</b>
        </div>

        <div className="setting-row">
          <div>
            <strong>Mission Storage</strong>
            <span>Local browser storage</span>
          </div>
          <b>ENABLED</b>
        </div>

      </div>

    </div>
  );

  /* =========================
     PAGE ROUTER
  ========================= */

  const renderPage = () => {
    switch (page) {
      case "Missions":
        return <MissionsPage />;

      case "Photos":
        return <PhotosPage />;

      case "Results":
        return <ResultsPage />;

      case "Reports":
        return <ReportsPage />;

      case "Settings":
        return <SettingsPage />;

      case "Mission Planner":
      default:
        return <MissionPlannerPage />;
    }
  };

  /* =========================
     MAIN APPLICATION
  ========================= */

  return (
    <div className="app">

      {/* TOP BAR */}
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
            ["▣", "Mission Planner"],
            ["⌖", "Missions"],
            ["▣", "Photos"],
            ["▥", "Results"],
            ["▤", "Reports"],
          ].map(([icon, name]) => (
            <button
              key={name}
              className={
                page === name ? "top-active" : ""
              }
              onClick={() => setPage(name)}
            >
              {icon} {name}
            </button>
          ))}

        </nav>

        <div className="system-status">

          <span></span>

          <div>
            SYSTEM READY
            <small>All systems operational</small>
          </div>

        </div>

        <div className="profile">
          M
        </div>

      </header>

      <div className="workspace">

        <Sidebar />

        <main className="main-content">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default App;