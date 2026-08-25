import React, { useMemo } from "react";

export default function Reports() {
  const mission = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("autonomousMission") || "null"
      );
    } catch {
      return null;
    }
  }, []);

  const missions = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("missions") || "[]"
      );
    } catch {
      return [];
    }
  }, []);

  const generateReport = () => {
    if (!mission) {
      alert(
        "No saved mission found.\n\nCreate and save a mission first."
      );
      return;
    }

    const waypoints = Array.isArray(mission.waypoints)
      ? mission.waypoints
      : [];

    const waypointRows = waypoints
      .map(
        (point, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${Number(point.lat).toFixed(6)}</td>
            <td>${Number(point.lng).toFixed(6)}</td>
          </tr>
        `
      )
      .join("");

    const survey = mission.survey || {};
    const camera = mission.camera || {};

    const createdAt = mission.createdAt
      ? new Date(mission.createdAt).toLocaleString()
      : "N/A";

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>Drone Mission Report</title>

<style>

body {
  font-family: Arial, sans-serif;
  margin: 40px;
  color: #172033;
  background: #f4f7fb;
}

.report {
  max-width: 1000px;
  margin: auto;
  background: white;
  padding: 40px;
  border-radius: 16px;
}

.header {
  border-bottom: 3px solid #10bfae;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 30px;
}

.header p {
  margin-top: 8px;
  color: #64748b;
}

.status {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 20px;
  background: #dcfce7;
  color: #166534;
  font-weight: bold;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 30px;
}

.card {
  padding: 18px;
  border: 1px solid #dbe3ec;
  border-radius: 10px;
  background: #f8fafc;
}

.card small {
  display: block;
  color: #64748b;
  margin-bottom: 8px;
}

.card strong {
  font-size: 20px;
}

h2 {
  margin-top: 30px;
  border-bottom: 1px solid #dbe3ec;
  padding-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th,
td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f1f5f9;
}

.footer {
  margin-top: 40px;
  padding-top: 15px;
  border-top: 1px solid #dbe3ec;
  color: #64748b;
  font-size: 12px;
}

@media print {
  body {
    background: white;
    margin: 0;
  }

  .report {
    box-shadow: none;
  }
}

</style>
</head>

<body>

<div class="report">

  <div class="header">

    <h1>
      DRONE MISSION STUDIO
    </h1>

    <p>
      Autonomous Survey & Mission Planning System
    </p>

    <h2>
      Autonomous Mission Report
    </h2>

    <p>
      Mission:
      <strong>${mission.name || "Unnamed Mission"}</strong>
    </p>

    <span class="status">
      ${mission.status || "Ready"}
    </span>

  </div>


  <div class="grid">

    <div class="card">
      <small>Waypoints</small>
      <strong>${waypoints.length}</strong>
    </div>

    <div class="card">
      <small>Route Distance</small>
      <strong>
        ${mission.distance || 0} m
      </strong>
    </div>

    <div class="card">
      <small>Flight Altitude</small>
      <strong>
        ${mission.altitude || 0} m
      </strong>
    </div>

    <div class="card">
      <small>Flight Speed</small>
      <strong>
        ${mission.speed || 0} m/s
      </strong>
    </div>

  </div>


  <h2>
    Mission Configuration
  </h2>

  <table>

    <tr>
      <th>Setting</th>
      <th>Value</th>
    </tr>

    <tr>
      <td>Mission Name</td>
      <td>${mission.name || "N/A"}</td>
    </tr>

    <tr>
      <td>Altitude</td>
      <td>${mission.altitude || 0} m</td>
    </tr>

    <tr>
      <td>Speed</td>
      <td>${mission.speed || 0} m/s</td>
    </tr>

    <tr>
      <td>Return Home</td>
      <td>
        ${mission.returnHome ? "Enabled" : "Disabled"}
      </td>
    </tr>

    <tr>
      <td>Estimated Flight Time</td>
      <td>
        ${mission.estimatedTime || 0} sec
      </td>
    </tr>

    <tr>
      <td>Survey Type</td>
      <td>
        ${survey.type || "Waypoint Survey"}
      </td>
    </tr>

    <tr>
      <td>Photo Grid</td>
      <td>
        ${survey.photoGrid ? "Enabled" : "Disabled"}
      </td>
    </tr>

    <tr>
      <td>Front Overlap</td>
      <td>
        ${survey.frontOverlap || 0}%
      </td>
    </tr>

    <tr>
      <td>Side Overlap</td>
      <td>
        ${survey.sideOverlap || 0}%
      </td>
    </tr>

    <tr>
      <td>Course Angle</td>
      <td>
        ${survey.courseAngle || 0}°
      </td>
    </tr>

    <tr>
      <td>Camera Action</td>
      <td>
        ${camera.action || "Take Photo"}
      </td>
    </tr>

    <tr>
      <td>Gimbal Angle</td>
      <td>
        ${camera.gimbalAngle ?? -90}°
      </td>
    </tr>

  </table>


  <h2>
    Flight Waypoints
  </h2>

  <table>

    <thead>

      <tr>
        <th>#</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>

    </thead>

    <tbody>
      ${
        waypointRows ||
        `
          <tr>
            <td colspan="3">
              No waypoints saved.
            </td>
          </tr>
        `
      }
    </tbody>

  </table>


  <h2>
    Mission Summary
  </h2>

  <table>

    <tr>
      <th>Property</th>
      <th>Value</th>
    </tr>

    <tr>
      <td>Mission Created</td>
      <td>${createdAt}</td>
    </tr>

    <tr>
      <td>Total Missions Saved</td>
      <td>${missions.length}</td>
    </tr>

    <tr>
      <td>Mission Status</td>
      <td>${mission.status || "Ready"}</td>
    </tr>

  </table>


  <div class="footer">

    Generated by
    <strong>Drone Mission Studio</strong>

    <br />

    Autonomous Survey & Mission Planning System

  </div>

</div>

</body>
</html>
`;

    const blob = new Blob(
      [html],
      { type: "text/html;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `${(mission.name || "mission")
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase()}_report.html`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-shell">

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            REPORTS
          </div>

          <h2>
            Mission reports
          </h2>

          <p>
            Generate a complete report from the saved
            autonomous mission.
          </p>

        </div>

      </div>


      <div className="report-card">

        <div className="report-icon">
          📄
        </div>


        <div className="report-info">

          <h3>
            Autonomous Survey Mission Report
          </h3>

          {mission ? (
            <>
              <p>
                Saved mission:
                {" "}
                <strong>
                  {mission.name}
                </strong>
              </p>

              <div className="report-meta">

                <span>
                  Waypoints:
                  {" "}
                  {mission.waypoints?.length || 0}
                </span>

                <span>
                  Distance:
                  {" "}
                  {mission.distance || 0} m
                </span>

                <span>
                  Altitude:
                  {" "}
                  {mission.altitude || 0} m
                </span>

              </div>
            </>
          ) : (
            <p>
              No saved mission available yet.
              Save a mission from Mission Planner first.
            </p>
          )}

        </div>


        <button
          className="secondary-action"
          onClick={generateReport}
        >
          Generate Report
        </button>

      </div>


      <div className="report-card">

        <div className="report-icon">
          📊
        </div>

        <div className="report-info">

          <h3>
            Mission Data Export
          </h3>

          <p>
            The report contains mission settings,
            route information and every saved waypoint.
          </p>

        </div>

      </div>

    </div>
  );
}