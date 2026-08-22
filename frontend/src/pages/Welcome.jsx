import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Drone({ className }) {
  return (
    <div className={`flying-drone ${className}`}>
      <div className="drone-arm arm-tl"></div>
      <div className="drone-arm arm-tr"></div>
      <div className="drone-arm arm-bl"></div>
      <div className="drone-arm arm-br"></div>

      <div className="drone-rotor rotor-tl"></div>
      <div className="drone-rotor rotor-tr"></div>
      <div className="drone-rotor rotor-bl"></div>
      <div className="drone-rotor rotor-br"></div>

      <div className="drone-center">
        <div className="drone-camera"></div>
      </div>
    </div>
  );
}

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      <div className="welcome-overlay"></div>

      {/* Four actual quadcopter-style drones */}
      <Drone className="drone-one" />
      <Drone className="drone-two" />
      <Drone className="drone-three" />
      <Drone className="drone-four" />

      <div className="welcome-brand">
        <span className="welcome-brand-icon">✈</span>
        <span>DRONE MISSION STUDIO</span>
      </div>

      <main className="welcome-content">

        <div className="welcome-tag">
          AUTONOMOUS AERIAL SURVEY SYSTEM
        </div>

        <h1>
          DRONE
          <span> MISSION STUDIO</span>
        </h1>

        <p>
          Autonomous Survey & Mission Planning System
        </p>

        <div className="welcome-line"></div>

        <p className="welcome-description">
          Plan intelligent aerial survey missions, generate flight paths,
          monitor aircraft status and prepare missions for autonomous flight.
        </p>

        <button
          className="get-started"
          onClick={() => navigate("/mission")}
        >
          GET STARTED
          <span>→</span>
        </button>

      </main>

      <div className="welcome-footer">
        AUTONOMOUS SURVEY • MISSION PLANNING • FLIGHT INTELLIGENCE
      </div>

    </div>
  );
}

export default Welcome;