import React, { useEffect, useState } from "react";
import {
  getDJIStatus,
  connectDJI,
  disconnectDJI,
} from "./missionApi";

export default function DroneConnection() {
  const [status, setStatus] = useState({
    connected: false,
    aircraft: "DJI Mini 4 Pro",
    controller: "DJI RC 2",
    mode: "STANDBY",
    missionStatus: "IDLE",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Checking connection service...");

  const refreshStatus = async () => {
    try {
      const data = await getDJIStatus();

      setStatus(data);

      setMessage(
        data.connected
          ? "Drone interface is connected."
          : "Drone interface is ready for connection."
      );
    } catch (error) {
      setMessage("Connection service is offline.");
      setStatus((old) => ({
        ...old,
        connected: false,
      }));
    }
  };

  const handleConnect = async () => {
    setLoading(true);

    try {
      const data = await connectDJI();

      setStatus(data.status || data);
      setMessage(
        data.message || "Drone interface connected."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);

    try {
      const data = await disconnectDJI();

      setStatus(data.status || data);
      setMessage(
        data.message || "Drone interface disconnected."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();

    const timer = setInterval(refreshStatus, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mission-intelligence">
      <div className="analysis-header">
        <div>
          <div className="eyebrow">
            DRONE CONNECTION
          </div>

          <h2>Aircraft Interface</h2>

          <p>
            Monitor the configured aircraft and controller
            communication layer.
          </p>
        </div>

        <div className="mission-health">
          <small>STATUS</small>

          <strong
            style={{
              color: status.connected
                ? "#38d39f"
                : "#f87171",
            }}
          >
            {status.connected
              ? "CONNECTED"
              : "READY"}
          </strong>
        </div>
      </div>

      <div className="analysis-grid">
        <div>
          <small>Aircraft</small>
          <strong>
            {status.aircraft || "DJI Mini 4 Pro"}
          </strong>
        </div>

        <div>
          <small>Controller</small>
          <strong>
            {status.controller || "DJI RC 2"}
          </strong>
        </div>

        <div>
          <small>Connection</small>
          <strong>
            {status.connected
              ? "ONLINE"
              : "OFFLINE"}
          </strong>
        </div>

        <div>
          <small>Mode</small>
          <strong>
            {status.mode || "STANDBY"}
          </strong>
        </div>

        <div>
          <small>Mission</small>
          <strong>
            {status.missionStatus || "IDLE"}
          </strong>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "22px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          className="primary-action"
          onClick={handleConnect}
          disabled={loading || status.connected}
        >
          {loading
            ? "Connecting..."
            : "Connect Interface"}
        </button>

        <button
          className="secondary-action"
          onClick={handleDisconnect}
          disabled={loading || !status.connected}
        >
          Disconnect
        </button>

        <span
          style={{
            fontSize: "13px",
            opacity: 0.75,
          }}
        >
          {message}
        </span>
      </div>
    </section>
  );
}