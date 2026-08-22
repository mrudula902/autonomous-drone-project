import { useState } from "react";
import MapView from "./MapView";
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

          <button
            className={page === "Mission Planner" ? "top-active" : ""}
            onClick={() => setPage("Mission Planner")}
          >
            ▣ Mission Planner
          </button>

          <button
            className={page === "Missions" ? "top-active" : ""}
            onClick={() => setPage("Missions")}
          >
            ⌖ Missions
          </button>

          <button
            className={page === "Photos" ? "top-active" : ""}
            onClick={() => setPage("Photos")}
          >
            ▣ Photos
          </button>

          <button
            className={page === "Results" ? "top-active" : ""}
            onClick={() => setPage("Results")}
          >
            ▥ Results
          </button>

          <button
            className={page === "Reports" ? "top-active" : ""}
            onClick={() => setPage("Reports")}
          >
            ▤ Reports
          </button>

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
                  className={page === name ? "side-active" : ""}
                  onClick={() => setPage(name)}
                >
                  <span className="menu-icon">{icon}</span>
                  <span>{name}</span>
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


            {/* ================= WEATHER ================= */}

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


        {/* ================= MAIN ================= */}

        <main className="main-content">

          {page === "Mission Planner" && <MissionPlanner />}

          {page === "Missions" && <MissionsPage />}

          {page === "Photos" && <PhotosPage />}

          {page === "Results" && <ResultsPage />}

          {page === "Reports" && <ReportsPage />}

          {page === "Settings" && <SettingsPage />}

        </main>

      </div>

    </div>
  );
}


/* =========================================================
   MISSION PLANNER
========================================================= */

function MissionPlanner() {
  return (
    <>
      <div className="heading-row">

        <div>

          <div className="eyebrow">
            MISSION PLANNER
          </div>

          <h2>
            Plan your next survey mission
          </h2>

          <p>
            Select a survey area, generate a flight grid
            and prepare the mission for review.
          </p>

        </div>

        <button className="new-mission">
          + New Mission
        </button>

      </div>


      {/* ================= STATISTICS ================= */}

      <section className="stats">

        <Stat
          icon="⌁"
          color="blue"
          title="Survey Area"
          value="2.45 ha"
          text="Estimated area"
        />

       <Stat 
          icon="⌖" 
          color="purple" 
          title="Waypoints" 
          value="0" 
          text="Flight points" 
       />

       <Stat 
          icon="◉" 
          color="green" 
          title="Photo Points" 
          value="0" 
          text="Estimated photos" 
        />

        <Stat
          icon="✈"
          color="orange"
          title="Mission Status"
          value="Draft"
          text="Not uploaded"
        />

      </section>


      {/* ================= MAP ================= */}

      <MapView />


      {/* ================= ANALYSIS ================= */}

      <section className="mission-intelligence">

        <div className="analysis-header">

          <div>

            <div className="eyebrow">
              MISSION ANALYSIS
            </div>

            <h2>
              Mission intelligence
            </h2>

          </div>

          <div className="mission-health">
            <small>MISSION HEALTH</small>
            <strong>94%</strong>
          </div>

        </div>


        <div className="analysis-grid">

          <Info
            title="Coverage"
            value="Excellent"
          />

          <Info
            title="Route Efficiency"
            value="91%"
          />

          <Info
            title="Safety Checks"
            value="✓ 4 / 4 Passed"
          />

          <Info
            title="Battery Reserve"
            value="38%"
          />

        </div>

      </section>


      {/* ================= METRICS ================= */}

      <section className="metrics">

        <Metric title="Total Area" value="2.45 ha" />

        <Metric
          title="Flight Altitude"
          value="40 m AGL"
        />

        <Metric
          title="Ground Resolution"
          value="2.3 cm/px"
        />

        <Metric
          title="Front Overlap"
          value="80%"
        />

        <Metric
          title="Side Overlap"
          value="70%"
        />

        <Metric
          title="Est. Flight Time"
          value="8 min"
        />

        <Metric
          title="Est. Distance"
          value="1.2 km"
        />

        <Metric
          title="Battery Usage"
          value="62%"
        />

      </section>

    </>
  );
}


/* =========================================================
   MISSIONS
========================================================= */

function MissionsPage() {

  return (
    <PageShell
      eyebrow="MISSIONS"
      title="Mission management"
      description="Create, review and manage autonomous survey missions."
    >

      <div className="page-actions">

        <button className="primary-action">
          + Create Mission
        </button>

      </div>

      <div className="mission-list">

        <Mission
          name="Agricultural Survey"
          location="College Survey Ground"
          status="Draft"
          area="2.45 ha"
          time="8 min"
        />

        <Mission
          name="Campus Mapping"
          location="Main Campus"
          status="Ready"
          area="4.12 ha"
          time="12 min"
        />

        <Mission
          name="Terrain Survey"
          location="Survey Zone B"
          status="Completed"
          area="1.86 ha"
          time="7 min"
        />

      </div>

    </PageShell>
  );
}


/* =========================================================
   PHOTOS
========================================================= */

function PhotosPage() {

  return (
    <PageShell
      eyebrow="PHOTOS"
      title="Mission photos"
      description="Review aerial images captured during survey missions."
    >

      <div className="photo-summary">

        <div>
          <span>126</span>
          <small>Total photos</small>
        </div>

        <div>
          <span>118</span>
          <small>Valid images</small>
        </div>

        <div>
          <span>8</span>
          <small>Pending review</small>
        </div>

      </div>


      <div className="photo-grid">

        <PhotoCard number="01" />
        <PhotoCard number="02" />
        <PhotoCard number="03" />
        <PhotoCard number="04" />
        <PhotoCard number="05" />
        <PhotoCard number="06" />

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
      description="Analyze mission coverage, route performance and captured data."
    >

      <div className="result-grid">

        <ResultCard
          title="Coverage"
          value="94%"
          text="Excellent survey coverage"
        />

        <ResultCard
          title="Route Efficiency"
          value="91%"
          text="Optimized flight path"
        />

        <ResultCard
          title="Image Quality"
          value="96%"
          text="High quality captured images"
        />

        <ResultCard
          title="Mission Health"
          value="94%"
          text="All safety checks passed"
        />

      </div>


      <div className="results-panel">

        <h3>
          Mission performance
        </h3>

        <div className="performance-bar">
          <span style={{ width: "94%" }}></span>
        </div>

        <div className="performance-labels">
          <span>Mission completion</span>
          <strong>94%</strong>
        </div>

      </div>

    </PageShell>
  );
}


/* =========================================================
   REPORTS
========================================================= */

function ReportsPage() {

  return (
    <PageShell
      eyebrow="REPORTS"
      title="Mission reports"
      description="Generate and review survey mission reports."
    >

      <div className="report-card">

        <div className="report-icon">
          📄
        </div>

        <div className="report-info">

          <h3>
            Autonomous Survey Mission Report
          </h3>

          <p>
            Complete mission summary including flight
            statistics, coverage and survey information.
          </p>

          <div className="report-meta">
            <span>Mission: Agricultural Survey</span>
            <span>Area: 2.45 ha</span>
            <span>Status: Draft</span>
          </div>

        </div>

        <button className="secondary-action">
          Generate
        </button>

      </div>


      <div className="report-card">

        <div className="report-icon">
          📊
        </div>

        <div className="report-info">

          <h3>
            Flight Performance Report
          </h3>

          <p>
            Route efficiency, battery usage, altitude
            and mission performance statistics.
          </p>

          <div className="report-meta">
            <span>Efficiency: 91%</span>
            <span>Battery: 62%</span>
            <span>Flight time: 8 min</span>
          </div>

        </div>

        <button className="secondary-action">
          Generate
        </button>

      </div>

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
          title="Flight altitude"
          value="40 m AGL"
        />

        <Setting
          title="Front overlap"
          value="80%"
        />

        <Setting
          title="Side overlap"
          value="70%"
        />

        <Setting
          title="Mission mode"
          value="Autonomous Survey"
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
   SMALL COMPONENTS
========================================================= */

function Stat({
  icon,
  color,
  title,
  value,
  text
}) {

  return (
    <div className="stat-card">

      <span className={`stat-icon ${color}`}>
        {icon}
      </span>

      <div>

        <small>{title}</small>

        <strong>{value}</strong>

        <em>{text}</em>

      </div>

    </div>
  );
}


function Info({ title, value }) {

  return (
    <div>

      <small>{title}</small>

      <strong>{value}</strong>

    </div>
  );
}


function Metric({ title, value }) {

  return (
    <div>

      <small>{title}</small>

      <strong>{value}</strong>

    </div>
  );
}


function PageShell({
  eyebrow,
  title,
  description,
  children
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
  time
}) {

  return (
    <div className="mission-row">

      <div className="mission-status-dot"></div>

      <div className="mission-details">

        <h3>{name}</h3>

        <p>{location}</p>

      </div>

      <div className="mission-data">

        <small>Area</small>

        <strong>{area}</strong>

      </div>

      <div className="mission-data">

        <small>Flight</small>

        <strong>{time}</strong>

      </div>

      <div
        className={`status-pill ${
          status.toLowerCase().replace(" ", "-")
        }`}
      >
        {status}
      </div>

    </div>
  );
}


function PhotoCard({ number }) {

  return (
    <div className="photo-card">

      <div className="photo-placeholder">

        <span>DRONE</span>

        <strong>
          PHOTO {number}
        </strong>

      </div>

      <div className="photo-info">

        <strong>
          Survey Image {number}
        </strong>

        <small>
          Mission capture point
        </small>

      </div>

    </div>
  );
}


function ResultCard({
  title,
  value,
  text
}) {

  return (
    <div className="result-card">

      <small>{title}</small>

      <strong>{value}</strong>

      <p>{text}</p>

    </div>
  );
}


function Setting({
  title,
  value
}) {

  return (
    <div className="setting-row">

      <div>

        <small>{title}</small>

        <strong>{value}</strong>

      </div>

      <span>›</span>

    </div>
  );
}