import React, { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./MapView.css";

const waypointIcon = new L.DivIcon({
  className: "waypoint-icon",
  html: `<div class="waypoint-marker">✈</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

function MapController({ location }) {
  const map = useMap();

  React.useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.lat, location.lng],
      17,
      {
        animate: true,
        duration: 1.2
      }
    );
  }, [location, map]);

  return null;
}

function MapClickHandler({ onAddWaypoint }) {
  useMapEvents({
    click(e) {
      onAddWaypoint({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });

  return null;
}

export default function MapView({
  onWaypointsChange
}) {
  const [waypoints, setWaypoints] = useState([]);
  const [coordinateInput, setCoordinateInput] =
    useState("");
  const [searchLocation, setSearchLocation] =
    useState(null);
  const [searchError, setSearchError] =
    useState("");

  const addWaypoint = (point) => {
    const updated = [
      ...waypoints,
      point
    ];

    setWaypoints(updated);

    if (onWaypointsChange) {
      onWaypointsChange(updated);
    }
  };

  const searchCoordinates = () => {
    setSearchError("");

    const cleaned = coordinateInput
      .trim()
      .replace(/[()[\]]/g, "");

    if (!cleaned) {
      setSearchError(
        "Paste Google Maps coordinates first."
      );
      return;
    }

    const parts = cleaned
      .split(/[,\s]+/)
      .filter(Boolean);

    if (parts.length < 2) {
      setSearchError(
        "Use this format: latitude, longitude"
      );
      return;
    }

    const lat = Number(parts[0]);
    const lng = Number(parts[1]);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      setSearchError(
        "The pasted coordinates are not valid numbers."
      );
      return;
    }

    if (lat < -90 || lat > 90) {
      setSearchError(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    if (lng < -180 || lng > 180) {
      setSearchError(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    setSearchLocation({
      lat,
      lng
    });
  };

  const addSearchLocation = () => {
    if (!searchLocation) {
      setSearchError(
        "Search the coordinates first."
      );
      return;
    }

    addWaypoint(searchLocation);
  };

  const undoLast = () => {
    if (waypoints.length === 0) return;

    const updated =
      waypoints.slice(0, -1);

    setWaypoints(updated);

    if (onWaypointsChange) {
      onWaypointsChange(updated);
    }
  };

  const clearWaypoints = () => {
    setWaypoints([]);

    if (onWaypointsChange) {
      onWaypointsChange([]);
    }
  };

  const route = waypoints.map(
    (point) => [
      point.lat,
      point.lng
    ]
  );

  return (
    <div className="map-section">

      <div className="map-header">

        <div>
          <div className="eyebrow">
            FLIGHT AREA
          </div>

          <h3>Mission route</h3>

          <p>
            Paste coordinates from Google Maps
            to locate your survey area.
          </p>
        </div>

        <div className="map-actions">

          <span className="waypoint-counter">
            {waypoints.length} WAYPOINT
            {waypoints.length === 1
              ? ""
              : "S"}
          </span>

          <button
            className="clear-route"
            type="button"
            onClick={undoLast}
            disabled={
              waypoints.length === 0
            }
          >
            Undo
          </button>

          <button
            className="clear-route"
            type="button"
            onClick={clearWaypoints}
            disabled={
              waypoints.length === 0
            }
          >
            Clear Route
          </button>

        </div>

      </div>

      <div className="coordinate-search">

        <div className="coordinate-title">
          GOOGLE MAPS LOCATION
        </div>

        <div className="coordinate-controls">

          <input
            type="text"
            value={coordinateInput}
            onChange={(e) =>
              setCoordinateInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchCoordinates();
              }
            }}
            placeholder="Paste coordinates: 19.0760, 72.8777"
          />

          <button
            type="button"
            className="coordinate-search-button"
            onClick={searchCoordinates}
          >
            Search Location
          </button>

          <button
            type="button"
            className="coordinate-add-button"
            onClick={addSearchLocation}
            disabled={!searchLocation}
          >
            + Add Waypoint
          </button>

        </div>

        {searchError && (
          <div className="coordinate-error">
            {searchError}
          </div>
        )}

        {searchLocation && (
          <div className="coordinate-found">
            ✓ Location found:{" "}
            {searchLocation.lat.toFixed(6)},{" "}
            {searchLocation.lng.toFixed(6)}
          </div>
        )}

      </div>

      <div className="map-container">

        <MapContainer
          center={[
            19.076,
            72.8777
          ]}
          zoom={13}
          scrollWheelZoom={true}
          className="leaflet-map"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            location={searchLocation}
          />

          <MapClickHandler
            onAddWaypoint={addWaypoint}
          />

          {searchLocation && (
            <CircleMarker
              center={[
                searchLocation.lat,
                searchLocation.lng
              ]}
              radius={10}
              pathOptions={{
                color: "#38bdf8",
                fillColor: "#38bdf8",
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <strong>
                  Selected Location
                </strong>
                <br />
                Latitude:{" "}
                {searchLocation.lat.toFixed(6)}
                <br />
                Longitude:{" "}
                {searchLocation.lng.toFixed(6)}
              </Popup>
            </CircleMarker>
          )}

          {waypoints.map(
            (point, index) => (
              <Marker
                key={index}
                position={[
                  point.lat,
                  point.lng
                ]}
                icon={waypointIcon}
              >
                <Popup>
                  <strong>
                    Waypoint {index + 1}
                  </strong>
                  <br />
                  Latitude:{" "}
                  {point.lat.toFixed(6)}
                  <br />
                  Longitude:{" "}
                  {point.lng.toFixed(6)}
                </Popup>
              </Marker>
            )
          )}

          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#38bdf8",
                weight: 4,
                opacity: 0.9
              }}
            />
          )}

        </MapContainer>

      </div>

      {waypoints.length > 0 && (
        <div className="waypoint-list">

          <div className="waypoint-list-title">
            MISSION WAYPOINTS
          </div>

          {waypoints.map(
            (point, index) => (
              <div
                className="waypoint-row"
                key={index}
              >
                <strong>
                  WP {index + 1}
                </strong>

                <span>
                  {point.lat.toFixed(6)}
                </span>

                <span>
                  {point.lng.toFixed(6)}
                </span>
              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}