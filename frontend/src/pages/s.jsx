import "./Pages.css";

function s() {
  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <div className="page-eyebrow">SYSTEM CONFIGURATION</div>
          <h2>s</h2>
          <p>Configure the mission planning system.</p>
        </div>
      </div>

      <div className="s-grid">

        <div className="page-card">

          <h3>Aircraft</h3>

          <label>
            Aircraft Model
            <select defaultValue="DJI Mavic 4 Pro">
              <option>DJI Mavic 4 Pro</option>
              <option>Avoda 360</option>
              <option>BGA4</option>
            </select>
          </label>

          <label>
            Default Flight Altitude
            <input defaultValue="40 m" />
          </label>

        </div>

        <div className="page-card">

          <h3>Mission s</h3>

          <label>
            Front Overlap
            <input defaultValue="80%" />
          </label>

          <label>
            Side Overlap
            <input defaultValue="70%" />
          </label>

          <label>
            Ground Resolution
            <input defaultValue="2.3 cm/px" />
          </label>

        </div>

      </div>

      <button className="primary-button save-button">
        Save s
      </button>

    </div>
  );
}

export default s;