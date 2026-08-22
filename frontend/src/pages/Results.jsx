import "./Pages.css";

function Results() {
  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <div className="page-eyebrow">MISSION ANALYSIS</div>
          <h2>Survey Results</h2>
          <p>Analysis generated from the completed mission.</p>
        </div>
      </div>

      <div className="result-health">
        <div>
          <span>MISSION HEALTH</span>
          <strong>94%</strong>
        </div>

        <div className="health-bar">
          <div></div>
        </div>
      </div>

      <div className="result-grid">

        <div className="result-card">
          <span>Coverage</span>
          <strong>Excellent</strong>
          <small>96% survey coverage</small>
        </div>

        <div className="result-card">
          <span>Route Efficiency</span>
          <strong>91%</strong>
          <small>Optimized flight path</small>
        </div>

        <div className="result-card">
          <span>Safety Checks</span>
          <strong>4 / 4</strong>
          <small>All checks passed</small>
        </div>

        <div className="result-card">
          <span>Battery Reserve</span>
          <strong>38%</strong>
          <small>Safe return reserve</small>
        </div>

      </div>

      <div className="page-card">

        <div className="card-heading">
          <div>
            <h3>Flight Summary</h3>
            <p>Performance information from the mission.</p>
          </div>
        </div>

        <div className="summary-grid">

          <div>
            <span>Total Area</span>
            <strong>2.45 ha</strong>
          </div>

          <div>
            <span>Flight Altitude</span>
            <strong>40 m AGL</strong>
          </div>

          <div>
            <span>Ground Resolution</span>
            <strong>2.3 cm/px</strong>
          </div>

          <div>
            <span>Front Overlap</span>
            <strong>80%</strong>
          </div>

          <div>
            <span>Side Overlap</span>
            <strong>70%</strong>
          </div>

          <div>
            <span>Flight Time</span>
            <strong>8 min</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Results;