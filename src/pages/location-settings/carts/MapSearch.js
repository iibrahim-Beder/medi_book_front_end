import React, { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const BlueMapPicker = ({
  initial = { lat: 30.0444, lng: 31.2357, displayName: "", officialName: "" },
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  // state for map position
  const [position, setPosition] = useState({
    lat: initial.lat,
    lng: initial.lng,
  });

  // state for official place name (from Google Maps API)
  const [officialName, setOfficialName] = useState(initial.officialName || "");

  // state for custom/display name chosen by the user
  const [displayName, setDisplayName] = useState(initial.displayName || "");

  // state to show loading when fetching place name
  const [loadingName, setLoadingName] = useState(false);

  // ref for Google Autocomplete instance
  const [autocomplete, setAutocomplete] = useState(null);

  // reference to map instance
  const mapRef = useRef(null);

  // load Google Maps API
  const { isLoaded } = useJsApiLoader({

    googleMapsApiKey: "AIzaSyBhkhbZdP9JlwOlJkmBkmUMll0jiNcKHXQ", //  API Key
    libraries: ["places"],
  });

  // custom map styles
  const mapStyles = [
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#dde2e3" }, { visibility: "on" }],
    },
    {
      featureType: "poi.park",
      elementType: "all",
      stylers: [{ color: "#c6e8b3" }, { visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#c1d1d6" }, { visibility: "on" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#a9b8bd" }, { visibility: "on" }],
    },
    {
      featureType: "road.local",
      elementType: "all",
      stylers: [{ color: "#f8fbfc" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#827e7e" }, { visibility: "on" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a6cbe3" }, { visibility: "on" }],
    },
    
  ];

  // get location name from latitude and longitude
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

  // when user clicks on map
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

  // when user drags the marker
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

  // save location data
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

  // when user selects a place from autocomplete search box
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setPosition({ lat, lng });
        setOfficialName(place.formatted_address || "");
        setDisplayName(place.formatted_address || "");
        if (mapRef.current) mapRef.current.panTo({ lat, lng });
      } else {
        alert(t("PlaceNotFound"));
      }
    }
  };

  // show loading until map is ready
  if (!isLoaded) return <div>{t("LoadingMap")}...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 12 }}>
      <div className="dc-tabscontenttitle">
        <h3>{t("LocateYourBusiness")}</h3>
      </div>

      {/* search input with autocomplete */}
      <Autocomplete
        onLoad={(autoC) => setAutocomplete(autoC)}
        onPlaceChanged={onPlaceChanged}
        options={{
          fields: ["geometry", "formatted_address"],
          componentRestrictions: { country: "eg" },
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder={t("SearchForAddress")}
          style={{ marginBottom: 8 }}
        />
      </Autocomplete>

      {/* show official place name */}
      <div style={{ marginBottom: 8 }}>
        <strong>{t("OfficialWebsite")}: </strong>
        {loadingName ? t("LoadingPlaceName") + " ⏳" : officialName || "—"}
      </div>

      {/* google map container */}
      <div className="table-card" style={{ height: 450, marginBottom: 12, padding:"20px"  }}>
        <GoogleMap
          center={position}
          zoom={13}
          options={{ styles: mapStyles }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onClick={handleMapClick}
          onLoad={(map) => (mapRef.current = map)}
        >
          <Marker
            position={position}
            draggable={true}
            onDragEnd={handleDragEnd}
          />
        </GoogleMap>
      </div>

      {/* custom place name input */}
      <input
        type="text"
        className="form-control"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder={t("SpecialPlaceNameOptional")}
        style={{ marginBottom: 12 }}
      />

      {/*  Buttons section    */}
      {/* <div style={{ display: "flex", justifyContent: "space-between"}}>
        <button className="btn btn-light" onClick={onCancel}> */}

      {/* action buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          className="btn-simple"
          onClick={onCancel}
        >
          {t("Cancel")}
        </button>
        <button
          type="submit"
          className="second-btn"
          style={{ minWidth: "100px" }}
          onClick={handleSave}
          disabled={!displayName.trim()}
        >
          {t("Save")}
        </button>
      </div>

      {/* footer with coordinates */}
      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
        <div>
          {t("Coordinates")}: {position.lat.toFixed(6)},{" "}
          {position.lng.toFixed(6)}
        </div>
        <div>{t("TapOrDragMapNote")}</div>
      </div>
    </div>
  );
};

export default BlueMapPicker;
