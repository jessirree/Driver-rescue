import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/navbar";

interface Service {
  id: string;
  title: string;
  image: string;
}

function ServiceGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "serviceslist"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

// Handle service selection, navigate to location picker
const handleServiceSelect = (serviceId: string) => {
  navigate( `/pick-location?serviceId=${serviceId}`);
};
  return (
    <>
    <Navbar /> {/* Add Navbar here */}
    <div className="container py-4 mt-5"> {/* margin-top to avoid overlap */}
      <h1 className="text-center mb-4">Request Assistance</h1>
      <div className="row g-3">
        {services.map((service) => (
          <div
            className="col-6 col-md-4"
            key={service.id}
            onClick={() => handleServiceSelect(service.id)} // On click, redirect to Location Picker
          >
            <Card title={service.title} image={`/assets/${service.image}`} />
          </div>
        ))}
      </div>
    </div>
  </>
);
}
export default ServiceGrid;