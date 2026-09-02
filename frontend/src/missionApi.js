const API = "http://127.0.0.1:5050";

async function request(url, options = {}) {
  const response = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      data.errors?.join("\n") ||
      "Backend request failed."
    );
  }

  return data;
}

export async function saveMissionToBackend(mission) {
  return request("/api/missions", {
    method: "POST",
    body: JSON.stringify(mission),
  });
}

export async function getCurrentMission() {
  return request("/api/missions/current");
}

export async function getSystemStatus() {
  return request("/api/status");
}

export async function getDJIStatus() {
  return request("/api/dji/status");
}

export async function connectDJI() {
  return request("/api/dji/connect", {
    method: "POST",
  });
}

export async function disconnectDJI() {
  return request("/api/dji/disconnect", {
    method: "POST",
  });
}

export async function prepareDJIMission(mission) {
  return request("/api/dji/mission", {
    method: "POST",
    body: JSON.stringify(mission),
  });
}

export async function startDJIMission() {
  return request("/api/dji/start", {
    method: "POST",
  });
}

export async function stopDJIMission() {
  return request("/api/dji/stop", {
    method: "POST",
  });
}