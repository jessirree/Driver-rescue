import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, onSnapshot, DocumentData } from "firebase/firestore";
import { geohashForLocation, geohashQueryBounds } from "geofire-common";  // Import necessary geospatial functions
import "../App.css";

const db = getFirestore();

interface Provider {
  servicesOffered: { serviceId: string; serviceName: string }[];
  id: string;
  name: string;
  rating: number;
  phone: string;
  distance: number;
  price: number;
}

// Define props interface
interface ServicesListProps {
  serviceId: string | null;
  lat?: string | null; // Allow lat to be optional
  lng?: string | null; // Allow lng to be optional
}

function ServicesList({ serviceId, lat, lng }: ServicesListProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Use the props if available, otherwise fall back to query params
  const latitude = lat ?? queryParams.get("lat");
  const longitude = lng ?? queryParams.get("lng");

  console.log("Service ID:", serviceId);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  useEffect(() => {
    if (!serviceId || !latitude || !longitude) return;

    const providersQuery = query(collection(db, "users"), where("role", "==", "service-provider"));

    const unsubscribe = onSnapshot(providersQuery, (snapshot) => {
      const providersData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name || "Unknown",
          rating: data.rating || 0,
          phone: data.phone || "N/A",
          servicesOffered: data.servicesOffered || [],
          distance: data.distance || Math.floor(Math.random() * 10) + 1,
          price: data.price || Math.floor(Math.random() * 2000) + 500,
        } as Provider;
      });
      setProviders(providersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [serviceId, latitude, longitude]); // Ensure dependencies are correct

  return (
    <div className="container-fluid no-padding-container mt-4">
      <h2 className="text-white mb-3">Available Service Providers</h2>
      {loading ? <p>Loading service providers...</p> : providers.length === 0 ? <p>No providers found for this service.</p> : (
        <div className="row">
          {providers.map((provider) => (
            <div key={provider.id} className="col-12 mb-3">
              <div className="card p-3 shadow-sm full-width-card">
                <div className="d-flex align-items-center">
                  <img
                    src="/path-to-placeholder.png"
                    alt="Provider"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{provider.name}</h5>
                    <p className="mb-1">⭐ {provider.rating}/5</p>
                    <p className="mb-1">KES {provider.phone}</p>
                  </div>
                  <button className="btn btn-primary">Request</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesList;
