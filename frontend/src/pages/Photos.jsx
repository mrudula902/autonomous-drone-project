import "./Pages.css";

function Photos() {
  const photos = [
    {
      title: "Survey Image 001",
      location: "North Sector",
      time: "10:42 AM",
    },
    {
      title: "Survey Image 002",
      location: "East Sector",
      time: "10:43 AM",
    },
    {
      title: "Survey Image 003",
      location: "South Sector",
      time: "10:44 AM",
    },
    {
      title: "Survey Image 004",
      location: "West Sector",
      time: "10:45 AM",
    },
    {
      title: "Survey Image 005",
      location: "Central Sector",
      time: "10:46 AM",
    },
    {
      title: "Survey Image 006",
      location: "North Sector",
      time: "10:47 AM",
    },
  ];

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <div className="page-eyebrow">MISSION DATA</div>
          <h2>Captured Photos</h2>
          <p>Images captured during autonomous survey missions.</p>
        </div>
      </div>

      <div className="page-stats">
        <div>
          <span>Total Photos</span>
          <strong>126</strong>
        </div>

        <div>
          <span>Processed</span>
          <strong>118</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>8</strong>
        </div>

        <div>
          <span>Storage</span>
          <strong>2.4 GB</strong>
        </div>
      </div>

      <div className="photo-grid">

        {photos.map((photo, index) => (
          <div className="photo-card" key={index}>

            <div className="photo-placeholder">
              <span>📷</span>
              <small>MISSION IMAGE</small>
            </div>

            <div className="photo-info">
              <strong>{photo.title}</strong>

              <span>
                {photo.location}
              </span>

              <small>
                {photo.time}
              </small>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Photos;