import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const BlueMapPicker = ({
  initial = { lat: 30.0444, lng: 31.2357, displayName: "", officialName: "" },
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ lat: initial.lat, lng: initial.lng });
  const [officialName, setOfficialName] = useState(initial.officialName || "");
  const [displayName, setDisplayName] = useState(initial.displayName || "");
  const [loadingName, setLoadingName] = useState(false);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBhkhbZdP9JlwOlJkmBkmUMll0jiNcKHXQ", // 🔑 ضع API Key بتاعك
    libraries: ["places"],
  });

  const reverseGeocode = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBhkhbZdP9JlwOlJkmBkmUMll0jiNcKHXQ&language=ar`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch (e) {
      console.warn(e);
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    setLoadingName(true);
    const name = await reverseGeocode(lat, lng);
    setOfficialName(name);
    if (!displayName.trim()) setDisplayName(name);
    setLoadingName(false);
  };

  const handleDragEnd = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    setLoadingName(true);
    const name = await reverseGeocode(lat, lng);
    setOfficialName(name);
    if (!displayName.trim()) setDisplayName(name);
    setLoadingName(false);
  };

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

  if (!isLoaded) return <div>{t("LoadingMap")}...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 12 }}>
      <div className="dc-tabscontenttitle">
        <h3>{t("LocateYourBusiness")}</h3>
      </div>

      {/* البحث */}
      <input
        type="text"
        className="form-control"
        placeholder={t("SearchForAddress")}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            const q = e.target.value.trim();
            if (!q) return;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              q
            )}&key=YOUR_API_KEY&language=ar`;
            try {
              const res = await fetch(url);
              const data = await res.json();
              if (data.results && data.results[0]) {
                const loc = data.results[0].geometry.location;
                setPosition({ lat: loc.lat, lng: loc.lng });
                setOfficialName(data.results[0].formatted_address);
                setDisplayName(data.results[0].formatted_address);
                mapRef.current.panTo(loc);
              } else {
                alert(t("PlaceNotFound"));
              }
            } catch {
              alert(t("SearchError"));
            }
          }
        }}
        style={{ marginBottom: 8 }}
      />

      <div style={{ marginBottom: 8 }}>
        <strong>{t("OfficialWebsite")}: </strong>
        {loadingName ? t("LoadingPlaceName") + " ⏳" : officialName || "—"}
      </div>

      <div style={{ height: 450, marginBottom: 12 }}>
  <GoogleMap
  center={position}
  zoom={13}
  mapContainerStyle={{ width: "100%", height: "100%" }}
  onClick={handleMapClick}
  onLoad={(map) => (mapRef.current = map)}
  options={{
    styles: [
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [
          { color: "#dde2e3" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "all",
        stylers: [
          { color: "#c6e8b3" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          { color: "#c6e8b3" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "on" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          { color: "#c1d1d6" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          { color: "#a9b8bd" },
          { visibility: "on" }
        ]
      },
      {
        featureType: "road.local",
        elementType: "all",
        stylers: [{ color: "#f8fbfc" }]
      },
      {
        featureType: "road.local",
        elementType: "labels.text",
        stylers: [
          { color: "#979a9c" },
          { visibility: "on" },
          { weight: 0.5 }
        ]
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          { visibility: "on" },
          { color: "#827e7e" }
        ]
      },
      {
        featureType: "road.local",
        elementType: "labels.text.stroke",
        stylers: [
          { color: "#3b3c3c" },
          { visibility: "off" }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          { color: "#a6cbe3" },
          { visibility: "on" }
        ]
      }
    ]
  }}
>
  <Marker
    position={position}
    draggable={true}
    onDragEnd={handleDragEnd}
  />
</GoogleMap>
      </div>

      <input
        type="text"
        className="form-control"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder={t("SpecialPlaceNameOptional")}
        style={{ marginBottom: 12 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="btn btn-light" onClick={onCancel}>
          {t("Cancel")}
        </button>
        <button
          className="btn dc-addinfo"
          onClick={handleSave}
          disabled={!displayName.trim()}
        >
          {t("Save")}
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        <div>
          {t("Coordinates")}: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
        <div>{t("TapOrDragMapNote")}</div>
      </div>
    </div>
  );
};

export default BlueMapPicker;
