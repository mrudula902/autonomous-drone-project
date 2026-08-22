import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";


// =========================================================
// LEAFLET MARKER FIX
// =========================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// =========================================================
// MAP CLICK HANDLER
// =========================================================

function LocationSelector({ setPosition }) {

  useMapEvents({

    click(e) {

      setPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);

    },

  });

  return null;
}


// =========================================================
// MOVE MAP TO LOCATION
// =========================================================

function MapMover({ position }) {

  const map = useMap();

  React.useEffect(() => {

    if (position) {

      map.flyTo(
        position,
        16,
        {
          duration: 1.2,
        }
      );

    }

  }, [position, map]);

  return null;
}


// =========================================================
// MAIN PAGE
// =========================================================

export default function Missions() {

  const [position, setPosition] = React.useState([
    18.5204,
    73.8567,
  ]);


  const [search, setSearch] = React.useState("");

  const [searching, setSearching] =
    React.useState(false);


  const [locationName, setLocationName] =
    React.useState("Pune, Maharashtra");


  const [locationError, setLocationError] =
    React.useState("");


  // =======================================================
  // SEARCH LOCATION
  // =======================================================

  async function searchLocation() {

    if (!search.trim()) return;

    setSearching(true);
    setLocationError("");

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}&limit=1`
      );

      const data = await response.json();


      if (!data.length) {

        setLocationError(
          "Location not found. Try another place."
        );

        setSearching(false);

        return;
      }


      const lat =
        parseFloat(data[0].lat);

      const lon =
        parseFloat(data[0].lon);


      setPosition([
        lat,
        lon,
      ]);


      setLocationName(
        data[0].display_name
      );


    } catch (error) {

      setLocationError(
        "Unable to search location."
      );

    }


    setSearching(false);
  }


  // =======================================================
  // MY LOCATION
  // =======================================================

  function locateMe() {

    setLocationError("");


    if (!navigator.geolocation) {

      setLocationError(
        "Location is not supported by this browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (location) => {

        const lat =
          location.coords.latitude;

        const lon =
          location.coords.longitude;


        setPosition([
          lat,
          lon,
        ]);


        setLocationName(
          "Your current location"
        );

      },


      () => {

        setLocationError(
          "Could not access your location. Please allow location permission."
        );

      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0,
      }

    );

  }


  // =======================================================
  // SURVEY AREA
  // =======================================================

  const surveyArea = [

    [18.525, 73.850],

    [18.525, 73.865],

    [18.515, 73.865],

    [18.515, 73.850],

  ];


  return (

    <div className="page-shell">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="heading-row">

        <div>

          <div className="eyebrow">
            MISSION PLANNER
          </div>

          <h2>
            Plan your next survey mission
          </h2>

          <p>
            Select a survey area, choose a
            mission location and prepare the
            flight plan.
          </p>

        </div>


        <button className="new-mission">

          + New Mission

        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="stats">


        <div className="stat-card">

          <div className="stat-icon blue">
            ⌁
          </div>

          <div>

            <small>
              Survey Area
            </small>

            <strong>
              2.45 ha
            </strong>

            <em>
              Estimated area
            </em>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon purple">
            ⌁
          </div>

          <div>

            <small>
              Waypoints
            </small>

            <strong>
              126
            </strong>

            <em>
              Flight points
            </em>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon green">
            ◎
          </div>

          <div>

            <small>
              Photo Points
            </small>

            <strong>
              126
            </strong>

            <em>
              Estimated photos
            </em>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon orange">
            ✈
          </div>

          <div>

            <small>
              Mission Status
            </small>

            <strong>
              Draft
            </strong>

            <em>
              Not uploaded
            </em>

          </div>

        </div>


      </div>


      {/* =================================================
          LOCATION SEARCH
      ================================================= */}

      <div className="location-panel">


        <div className="location-panel-title">

          📍 MISSION LOCATION

        </div>


        <div className="location-controls">


          <input

            type="text"

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                searchLocation();

              }

            }}

            placeholder="Search location, city or address..."

          />


          <button
            onClick={searchLocation}
            className="location-search-button"
          >

            {searching
              ? "Searching..."
              : "🔎 Search"}

          </button>


          <button
            onClick={locateMe}
            className="location-button"
          >

            📍 My Location

          </button>


        </div>


        <div className="selected-location">

          <span>
            SELECTED LOCATION
          </span>

          <strong>
            {locationName}
          </strong>

        </div>


        {locationError && (

          <div className="location-error">

            {locationError}

          </div>

        )}

      </div>


      {/* =================================================
          MAP TOOLS
      ================================================= */}

      <div className="map-toolbar">


        <button className="map-tool active">
          ⌖ Select
        </button>


        <button className="map-tool">
          ◇ Draw Area
        </button>


        <button className="map-tool">
          ⌁ Waypoints
        </button>


        <button className="map-tool">
          ▦ Grid
        </button>


        <button className="map-tool">
          ▣ Photos
        </button>


      </div>


      <div className="map-mode">

        <button className="map-mode-active">
          Map
        </button>

        <button>
          Satellite
        </button>

      </div>


      {/* =================================================
          MAP
      ================================================= */}

      <div className="map-section">


        <div className="map-title">
          LIVE MISSION MAP
        </div>


        <div className="map-wrapper">


          <MapContainer

            center={[
              18.5204,
              73.8567,
            ]}

            zoom={14}

            scrollWheelZoom={true}

            className="mission-map"

          >


            <TileLayer

              attribution='&copy; OpenStreetMap contributors'

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            />


            {/* CLICK MAP */}

            <LocationSelector
              setPosition={setPosition}
            />


            {/* MOVE MAP */}

            <MapMover
              position={position}
            />


            {/* SURVEY AREA */}

            <Polygon

              positions={surveyArea}

              pathOptions={{

                color: "#14d8c5",

                fillColor: "#14d8c5",

                fillOpacity: 0.15,

                weight: 2,

              }}

            />


            {/* SELECTED LOCATION */}

            <Marker
              position={position}
            >

              <Popup>

                <strong>
                  Mission Location
                </strong>

                <br />

                {locationName}

                <br />
                <br />

                Latitude:
                {" "}
                {position[0].toFixed(6)}

                <br />

                Longitude:
                {" "}
                {position[1].toFixed(6)}

              </Popup>

            </Marker>


          </MapContainer>


        </div>


        <div className="map-help">

          Click anywhere on the map to select a
          mission location.

        </div>


      </div>


      {/* =================================================
          SELECTED COORDINATES
      ================================================= */}

      <div className="coordinates-card">


        <div>

          <small>
            LATITUDE
          </small>

          <strong>
            {position[0].toFixed(6)}
          </strong>

        </div>


        <div>

          <small>
            LONGITUDE
          </small>

          <strong>
            {position[1].toFixed(6)}
          </strong>

        </div>


        <div>

          <small>
            LOCATION STATUS
          </small>

          <strong className="coordinate-status">
            ● LOCATION SELECTED
          </strong>

        </div>


      </div>


      {/* =================================================
          MISSION INTELLIGENCE
      ================================================= */}

      <div className="mission-intelligence">


        <div className="analysis-header">


          <div>

            <div className="eyebrow">
              MISSION ANALYSIS
            </div>

            <h2>
              Mission intelligence
            </h2>

          </div>


          <div className="mission-health">

            <small>
              MISSION HEALTH
            </small>

            <strong>
              94%
            </strong>

          </div>


        </div>


        <div className="analysis-grid">


          <div>

            <small>
              Coverage
            </small>

            <strong>
              Excellent
            </strong>

          </div>


          <div>

            <small>
              Route Efficiency
            </small>

            <strong>
              91%
            </strong>

          </div>


          <div>

            <small>
              Safety Checks
            </small>

            <strong>
              ✓ 4 / 4 Passed
            </strong>

          </div>


          <div>

            <small>
              Battery Reserve
            </small>

            <strong>
              38%
            </strong>

          </div>


        </div>


      </div>


      {/* =================================================
          METRICS
      ================================================= */}

      <div className="metrics">


        <div>
          <small>ALTITUDE</small>
          <strong>80 m</strong>
        </div>


        <div>
          <small>SPEED</small>
          <strong>8 m/s</strong>
        </div>


        <div>
          <small>DISTANCE</small>
          <strong>3.8 km</strong>
        </div>


        <div>
          <small>FLIGHT TIME</small>
          <strong>12 min</strong>
        </div>


        <div>
          <small>PHOTOS</small>
          <strong>126</strong>
        </div>


        <div>
          <small>OVERLAP</small>
          <strong>80%</strong>
        </div>


        <div>
          <small>GSD</small>
          <strong>2.1 cm</strong>
        </div>


        <div>
          <small>BATTERY</small>
          <strong>38%</strong>
        </div>


      </div>


    </div>

  );

}