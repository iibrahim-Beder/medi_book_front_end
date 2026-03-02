import  { useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

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

const BlueMapPicker = ({ value, onChange }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loadingName, setLoadingName] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries: ["places"],
  });

  const reverseGeocode = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&language=ar`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.results?.[0]?.formatted_address || "";
    } catch {
      return "";
    }
  };

  const updateLocation = async (lat, lng) => {
    setLoadingName(true);
    const officialName = await reverseGeocode(lat, lng);

onChange({
  ...value,
  lat,
  lng,
  officialName,
  displayName: value.displayName || officialName,
});

    setLoadingName(false);
  };

  const handleMapClick = (e) => {
    updateLocation(e.latLng.lat(), e.latLng.lng());
  };

  const handleDragEnd = (e) => {
    updateLocation(e.latLng.lat(), e.latLng.lng());
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
onChange({
  ...value,
  lat,
  lng,
  officialName: place.formatted_address,
  displayName: place.formatted_address,
});

    mapRef.current?.panTo({ lat, lng });
  };

  if (!isLoaded) return <div>{t("LoadingMap")}...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          className="form-control mb-2"
          placeholder={t("SearchForAddress")}
        />
      </Autocomplete>

      {loadingName && (
        <div style={{ fontSize: 13 }}>{t("LoadingPlaceName")}...</div>
      )}

      <GoogleMap
        center={{ lat: value.lat, lng: value.lng }}
        zoom={13}
        options={{ styles: mapStyles }}   
        mapContainerStyle={{ height: 450 }}
        onLoad={(map) => (mapRef.current = map)}
        onClick={handleMapClick}
      >
        <Marker
          position={{ lat: value.lat, lng: value.lng }}
          draggable
          onDragEnd={handleDragEnd}
        />
      </GoogleMap>
      <label className="mt-2 mb-0">{t("Place Name")}</label>
      <input
      color="var(--terthemecolor)"
        className="form-control"
        value={value.displayName}
        onChange={(e) =>
onChange({
  ...value,
  displayName: e.target.value,
})        }
        placeholder={t("SpecialPlaceNameOptional")}
      />
    </div>
  );
};

export default BlueMapPicker;