const API = "http://127.0.0.1:5000";

export async function saveMissionToBackend(mission) {
  const response = await fetch(`${API}/api/missions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mission),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors
        ? data.errors.join("\n")
        : data.error || "Mission save failed."
    );
  }

  return data;
}


export async function getCurrentMission() {
  const response = await fetch(
    `${API}/api/missions/current`
  );

  if (!response.ok) {
    throw new Error("No saved mission.");
  }

  return response.json();
}


export async function getSystemStatus() {
  const response = await fetch(
    `${API}/api/status`
  );

  return response.json();
}