import { useState } from "react";
import MapView from "./MapView";
import MissionPlanner from "./MissionPlanner";
import "./App.css";

function App() {
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

      {/* TOP BAR */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">✈</div>

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
              className={page === item ? "top-active" : ""}
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
            <small>All systems operational</small>
          </div>
        </div>

        <div className="profile">M</div>

      </header>


      {/* WORKSPACE */}
      <div className="workspace">

        {/* SIDEBAR */}
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
                    page === name ? "side-active" : ""
                  }
                  onClick={() => setPage(name)}
                >
                  <span className="menu-icon">
                    {icon}
                  </span>

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


            {/* WEATHER */}
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


        {/* MAIN AREA */}
        <main className="main-content">

          {page === "Mission Planner" && (
            <div className="mission-dashboard">

              {/* PAGE HEADER */}
              <div className="mission-header">

                <div>
                  <div className="page-kicker">
                    AUTONOMOUS FLIGHT
                  </div>

                  <h2>
                    Mission Planner
                  </h2>

                  <p>
                    Design and validate your autonomous drone mission
                  </p>
                </div>

                <div className="mission-status">
                  <span></span>
                  READY
                </div>

              </div>


              {/* MAP */}
              <div className="map-section">

                <MapView />

              </div>


              {/* MISSION PLANNER PANEL */}
              <div className="planner-section">

                <MissionPlanner />

              </div>

            </div>
          )}


          {page === "Missions" && (
            <div className="empty-page">

              <div className="page-kicker">
                MISSION MANAGEMENT
              </div>

              <h2>Saved Missions</h2>

              <p>
                Your planned autonomous missions will appear here.
              </p>

              <div className="placeholder-card">
                <span>📍</span>
                <strong>No missions saved yet</strong>
                <small>
                  Create a mission using Mission Planner.
                </small>

                <button
                  onClick={() => setPage("Mission Planner")}
                >
                  Create Mission
                </button>
              </div>

            </div>
          )}


          {page === "Photos" && (
            <div className="empty-page">

              <div className="page-kicker">
                MISSION MEDIA
              </div>

              <h2>Photos</h2>

              <p>
                Captured aerial images will appear here.
              </p>

              <div className="placeholder-card">
                <span>📷</span>
                <strong>No photos available</strong>
                <small>
                  Photos will be available after a mission.
                </small>
              </div>

            </div>
          )}


          {page === "Results" && (
            <div className="empty-page">

              <div className="page-kicker">
                MISSION ANALYTICS
              </div>

              <h2>Results</h2>

              <p>
                Mission statistics and flight results.
              </p>

              <div className="results-grid">

                <div className="result-card">
                  <span>MISSIONS</span>
                  <strong>0</strong>
                </div>

                <div className="result-card">
                  <span>WAYPOINTS</span>
                  <strong>0</strong>
                </div>

                <div className="result-card">
                  <span>FLIGHT TIME</span>
                  <strong>0 min</strong>
                </div>

              </div>

            </div>
          )}


          {page === "Reports" && (
            <div className="empty-page">

              <div className="page-kicker">
                MISSION DOCUMENTATION
              </div>

              <h2>Reports</h2>

              <p>
                Generate mission reports after completing a flight.
              </p>

              <div className="placeholder-card">
                <span>📄</span>
                <strong>Reports</strong>
                <small>
                  Mission reports will be generated here.
                </small>
              </div>

            </div>
          )}


          {page === "Settings" && (
            <div className="empty-page">

              <div className="page-kicker">
                SYSTEM CONFIGURATION
              </div>

              <h2>Settings</h2>

              <p>
                Autonomous drone system configuration.
              </p>

              <div className="placeholder-card">
                <span>⚙</span>
                <strong>System Settings</strong>
                <small>
                  Flight and application settings.
                </small>
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;