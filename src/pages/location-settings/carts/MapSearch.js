import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import '../../ui/css/LocationCss.css';
import { useTranslation } from "react-i18next";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "doclisteo-react-app" },
    });
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch (e) {
    console.warn(e);
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
};

const BlueMapPicker = ({ 
  initial = { lat: 51.000000, lng: 15.2551, displayName: "", officialName: "" }, 
  onSave,
  onCancel 
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ lat: initial.lat, lng: initial.lng });
  const [officialName, setOfficialName] = useState(initial.officialName || "");
  const [displayName, setDisplayName] = useState(initial.displayName || "");
  const [loadingName, setLoadingName] = useState(false);

  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const handleDragEnd = async () => {
    const marker = markerRef.current;
    if (!marker) return;
    const latLng = marker.getLatLng();
    setPosition({ lat: latLng.lat, lng: latLng.lng });

    if (mapRef.current) {
      mapRef.current.setView([latLng.lat, latLng.lng], mapRef.current.getZoom());
    }

    setLoadingName(true);
    const name = await reverseGeocode(latLng.lat, latLng.lng);
    setOfficialName(name);
    if (!displayName.trim()) {
      setDisplayName(name);
    }
    setLoadingName(false);
  };

  const handleCancel = () => {
    setPosition({ lat: initial.lat, lng: initial.lng });
    setOfficialName(initial.officialName || "");
    setDisplayName(initial.displayName || "");
    if (onCancel) onCancel();
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setPosition({ lat, lng });

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }

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
    else alert(t("Saved") + ": " + JSON.stringify(payload, null, 2));
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 12 }}>
      <div className="dc-tabscontenttitle">
        <h3>{t("LocateYourBusiness")}</h3>
      </div>

      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder={t("SearchForAddress")}
          className="form-control"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const q = e.target.value.trim();
              if (!q) return;
              try {
                const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
                  q
                )}&limit=1&accept-language=en`;
                const res = await fetch(url, {
                  headers: { "User-Agent": "doclisteo-react-app" },
                });
                const arr = await res.json();
                if (arr && arr[0]) {
                  const item = arr[0];
                  const lat = parseFloat(item.lat);
                  const lon = parseFloat(item.lon);
                  setPosition({ lat, lng: lon });

                  if (mapRef.current) {
                    mapRef.current.setView([lat, lon], 13, { animate: true });
                  }

                  setOfficialName(item.display_name || "");
                  setDisplayName(item.display_name || "");
                } else {
                  alert(t("PlaceNotFound"));
                }
              } catch (err) {
                console.warn(err);
                alert(t("SearchError"));
              }
            }
          }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>{t("OfficialWebsite")}: </strong>
        <span>
          {loadingName ? t("LoadingPlaceName") + " ⏳" : officialName || "—"}
        </span>
      </div>

      <div style={{ height: 450, marginBottom: 12 }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => { mapRef.current = map; }}
          onclick={handleMapClick}
        >
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
            <Popup>{t("DragPinMessage")}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          className="form-control"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t("SpecialPlaceNameOptional")}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{ backgroundColor: "#ddd" }}
          className="btn cancelbtn btn-light"
          onClick={handleCancel}
        >
          {t("Cancel")}
        </button>

        <button
          className="btn dc-addinfo"
          onClick={handleSave}
          disabled={saveDisabled}
          style={{
            color: "white",
            opacity: saveDisabled ? 0.6 : 1,
            cursor: saveDisabled ? "not-allowed" : "pointer",
          }}
        >
          {t("Save")}
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        <div>
          {t("Coordinates")}: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
        <div style={{ marginTop: 4 }}>
          {t("TapOrDragMapNote")}
        </div>
      </div>
    </div>
  );
};

export default BlueMapPicker;
