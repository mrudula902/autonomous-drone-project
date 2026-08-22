export function validateMission(mission) {
  const errors = [];

  if (!mission.name || mission.name.trim() === "") {
    errors.push("Mission name is required.");
  }

  if (!Number.isFinite(mission.altitude)) {
    errors.push("Altitude must be a valid number.");
  }

  if (mission.altitude < 5 || mission.altitude > 120) {
    errors.push("Altitude must be between 5 m and 120 m.");
  }

  if (!Number.isFinite(mission.speed)) {
    errors.push("Speed must be a valid number.");
  }

  if (mission.speed <= 0 || mission.speed > 15) {
    errors.push("Speed must be greater than 0 and no more than 15 m/s.");
  }

  if (!Array.isArray(mission.waypoints)) {
    errors.push("Waypoint list is invalid.");
  } else if (mission.waypoints.length < 2) {
    errors.push("Add at least 2 waypoints.");
  }

  if (Array.isArray(mission.waypoints)) {
    mission.waypoints.forEach((point, index) => {
      if (
        typeof point.lat !== "number" ||
        typeof point.lng !== "number"
      ) {
        errors.push(
          `Waypoint ${index + 1} has invalid coordinates.`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}