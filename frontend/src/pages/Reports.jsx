import "./Pages.css";

function Reports() {
  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <div className="page-eyebrow">DOCUMENTATION</div>
          <h2>Mission Reports</h2>
          <p>Generate and review mission documentation.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => window.print()}
        >
          Generate Report
        </button>
      </div>

      <div className="page-card report-card">

        <div className="report-header">
          <div>
            <h3>Drone Mission Studio</h3>
            <p>Autonomous Survey & Mission Planning System</p>
          </div>

          <span className="status-badge completed">
            COMPLETED
          </span>
        </div>

        <div className="report-divider"></div>

        <h3>Mission Report</h3>

        <div className="report-grid">

          <div>
            <span>Aircraft</span>
            <strong>DJI Mavic 4 Pro</strong>
          </div>

          <div>
            <span>Mission Area</span>
            <strong>2.45 ha</strong>
          </div>

          <div>
            <span>Waypoints</span>
            <strong>126</strong>
          </div>

          <div>
            <span>Flight Time</span>
            <strong>8 minutes</strong>
          </div>

          <div>
            <span>Altitude</span>
            <strong>40 m AGL</strong>
          </div>

          <div>
            <span>Battery Usage</span>
            <strong>62%</strong>
          </div>

        </div>

        <div className="report-section">
          <h4>Mission Summary</h4>

          <p>
            Autonomous survey mission completed successfully.
            The planned survey area was covered using an optimized
            waypoint grid while maintaining the configured overlap
            and safety parameters.
          </p>
        </div>

        <div className="report-section">
          <h4>Safety Status</h4>

          <p className="success-text">
            ✓ All 4 safety checks passed.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Reports;

