import { useEffect, useState } from "react";

export default function DroneConnection() {
  const [status, setStatus] = useState({
    connected: false,
    status: "CHECKING",
    message: "Checking for MAVLink flight controller..."
  });

  const [loading, setLoading] = useState(false);

  const checkDrone = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5050/api/drone/status"
      );

      const data = await response.json();

      setStatus(data);

    } catch (error) {
      setStatus({
        connected: false,
        status: "API OFFLINE",
        message:
          "Drone connection service is not running"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDrone();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          marginBottom: "30px"
        }}
      >
        <h2>
          Drone Connection Center
        </h2>

        <p>
          Detect and monitor MAVLink-compatible
          flight controllers.
        </p>
      </div>

      <div
        style={{
          padding: "25px",
          borderRadius: "15px",
          background: "#ffffff",
          boxShadow:
            "0 5px 25px rgba(0,0,0,0.08)"
        }}
      >

        <h3>
          Connection Status
        </h3>

        <h1>
          {status.connected
            ? "🟢 CONNECTED"
            : "🔴 " + status.status}
        </h1>

        <p>
          {status.message}
        </p>

        {status.connected && (
          <div
            style={{
              marginTop: "25px",
              lineHeight: "2"
            }}
          >
            <div>
              <strong>
                System ID:
              </strong>{" "}
              {status.system_id}
            </div>

            <div>
              <strong>
                Component ID:
              </strong>{" "}
              {status.component_id}
            </div>

            <div>
              <strong>
                Vehicle Type:
              </strong>{" "}
              {status.vehicle_type}
            </div>

            <div>
              <strong>
                Autopilot Type:
              </strong>{" "}
              {status.autopilot_type}
            </div>

          </div>
        )}

        <button
          onClick={checkDrone}
          disabled={loading}
          style={{
            marginTop: "25px",
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {loading
            ? "Checking..."
            : "Refresh Connection"}
        </button>

      </div>

      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          borderRadius: "12px",
          background: "#f5f7fa"
        }}
      >
        <h3>
          Connection Information
        </h3>

        <p>
          This module checks for MAVLink heartbeat
          messages from a compatible flight controller.
        </p>

        <p>
          Mission planning and flight-controller
          communication are separate stages of the
          system.
        </p>
      </div>

    </div>
  );
}
