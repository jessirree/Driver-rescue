import { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom"; 

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -1.286389, // Default to Nairobi
  lng: 36.817223,
};

// Define props for the component
interface LocationPickerProps {
  serviceId: string | null;
}

const LocationPicker = ({ serviceId }: LocationPickerProps) => {
  const [location, setLocation] = useState(defaultCenter);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => {
          console.warn("Geolocation failed, using default location.");
        }
      );
    }
  }, []);

  const handleMarkerDrag = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    }
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        () => {
          console.error("Failed to get location.");
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported.");
    }
  };

  const handleConfirmLocation = () => {
    if (location.lat && location.lng && serviceId) {
      // Navigate to the services list with the serviceId and location coordinates
      navigate(`/services-list/${serviceId}?lat=${location.lat}&lng=${location.lng}`);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <div>
        <button onClick={handleUseMyLocation} disabled={loading} style={{ marginBottom: "10px" }}>
          {loading ? "Getting Location..." : "Use My Location"}
        </button>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={location}>
          <Marker position={location} draggable={true} onDragEnd={handleMarkerDrag} />
        </GoogleMap>
        {location.lat && (
          <p>Latitude: {location.lat}, Longitude: {location.lng}</p>
        )}
        <button onClick={handleConfirmLocation} disabled={!location.lat}>
          Confirm Location
        </button>
      </div>
    </LoadScript>
  );
};

export default LocationPicker;
