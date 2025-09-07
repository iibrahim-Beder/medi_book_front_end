import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import '../pages/ui/css/LocationCss.css';
// --- (Optional) Set a default icon if there is an issue with the default images ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
// -----------------------------------------------------------------------

const reverseGeocode = async (lat, lon) => {
  // Uses Nominatim - Free but respect usage limits (rate limits)
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "doclisteo-react-app" }, // Useful for some Nominatim servers
    });
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    // Try to return display_name or fallback
    return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch (e) {
    console.warn(e);
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
};

const BlueMapPicker = ({ initial = { lat: 30.0444, lng: 31.2357 }, onSave }) => {
  const [position, setPosition] = useState({ lat: initial.lat, lng: initial.lng });
  const [officialName, setOfficialName] = useState(""); // The name returned from reverse geocode
  const [displayName, setDisplayName] = useState(""); // The display name entered by the user
  const [loadingName, setLoadingName] = useState(false);
  const markerRef = useRef(null);

  const handleDragEnd = async () => {
    const marker = markerRef.current;
    if (!marker) return;
    const latLng = marker.getLatLng();
    setPosition({ lat: latLng.lat, lng: latLng.lng });

    // Reverse call to get the place name
    setLoadingName(true);
    const name = await reverseGeocode(latLng.lat, latLng.lng);
    setOfficialName(name);
    // If the user hasn’t entered a display name, show the official name in the field
    if (!displayName.trim()) {
      setDisplayName(name);
    }
    setLoadingName(false);
  };

  const handleMapClick = async (e) => {
    // If the user clicks on the map, update the pin position and fetch the name
    const { lat, lng } = e.latlng;
    setPosition({ lat, lng });
    setLoadingName(true);
    const name = await reverseGeocode(lat, lng);
    setOfficialName(name);
    if (!displayName.trim()) setDisplayName(name);
    setLoadingName(false);
  };

  const saveDisabled = !displayName.trim();

  const handleSave = () => {
    const payload = {
      lat: position.lat,
      lng: position.lng,
      displayName: displayName.trim(),
      officialName,
    };
    if (onSave) onSave(payload);
    else alert("Saved: " + JSON.stringify(payload, null, 2));
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 12 }}>
      <h3 className="titil" style={{ textAlign: "center" }}>Find the location</h3>

      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Search for the address"
          className="form-control"
          onKeyDown={async (e) => {
            // Simple search: when pressing Enter, search using Nominatim
            if (e.key === "Enter") {
              const q = e.target.value.trim();
              if (!q) return;
              try {
               const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=1&accept-language=en`;
                const res = await fetch(url, { headers: { "User-Agent": "doclisteo-react-app" } });
                const arr = await res.json();
                if (arr && arr[0]) {
                  const item = arr[0];
                  const lat = parseFloat(item.lat);
                  const lon = parseFloat(item.lon);
                  setPosition({ lat, lng: lon });
                  setOfficialName(item.display_name || "");
                  setDisplayName(item.display_name || "");
                } else {
                  alert("Place not found");
                }
              } catch (err) {
                console.warn(err);
                alert("An error occurred during the search");
              }
            }
          }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Official website: </strong>
        <span>{loadingName ? "Fetching location name... ⏳" : (officialName || "—")}</span>
      </div>

      <div style={{ height: 450, marginBottom: 12 }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%"  }}
          whenCreated={(map) => {
            // Ensure the map centers on the current position
            map.setView([position.lat, position.lng], 13);
          }}
          onclick={handleMapClick}
        >
          {/* Blue block from Carto / light_all gives a soft blue/gray appearance */}
   <TileLayer
  url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>'
/>
          <Marker
            position={[position.lat, position.lng]}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
            ref={markerRef}
          >
            <Popup>Drag the pin to change the location</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div style={{ marginBottom: 12 }}>
        {/* <label style={{ display: "block", marginBottom: 6 }}>Custom display name (optional):</label> */}
        <input
          type="text"
          className="form-control"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Name of the special place (optional)"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button 
        style={{backgroundColor:"#ddd"}}
          className="btn cancelbtn  btn-light"
          onClick={() => {
            // Reset to default state
            setPosition({ lat: initial.lat, lng: initial.lng });
            setOfficialName("");
            setDisplayName("");
          }}
        >
          cansel
        </button>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saveDisabled}
          style={{
            opacity: saveDisabled ? 0.6 : 1,
            cursor: saveDisabled ? "not-allowed" : "pointer",
          }}
        >
          save
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        <div>Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</div>
        <div style={{ marginTop: 4 }}>Note: Tap or drag the map to move the pin.</div>
      </div>
    </div>
  );
};

export default BlueMapPicker;
