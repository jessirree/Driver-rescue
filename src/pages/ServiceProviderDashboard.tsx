import "../App.css";
import ProviderRating from "../components/ProviderRating";
import Navbar from "../components/navbar"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { Container, Card, Button, Table, Form } from "react-bootstrap"; // Import Bootstrap components

const db = getFirestore();
const auth = getAuth();

interface Service {
  serviceId: string;
  serviceName: string;
}

interface Request {
  id: string;
  clientName: string;
  cliendId: string;
  service: string;
  location: string;
  status?: string;
}

function ServiceProviderDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const checkPasswordChanged = async () => {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.passwordChanged) {
          navigate("/change-password");
        }
      }
    };

    checkPasswordChanged();
  }, [user, navigate]);

  useEffect(() => {
    const fetchAvailableServices = async () => {
      const querySnapshot = await getDocs(collection(db, "serviceslist"));
      const servicesArray = querySnapshot.docs.map((doc) => doc.data().title);
      setAvailableServices(servicesArray);
    };
    fetchAvailableServices();
  }, []);

  const fetchProviderServices = async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "service-provider") {
        setServices(userData.servicesOffered || []);
      } else {
        console.error("User is not a service provider");
        setServices([]);
      }
    } else {
      console.error("User document not found");
    }
  };

  useEffect(() => {
    fetchProviderServices();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const requestQuery = query(
      collection(db, "requests"),
      where("userId", "==", user.uid)
    );
    const unsubscribeRequests = onSnapshot(requestQuery, (snapshot) => {
      setRequests(
        snapshot.docs.map((doc) => {
          const requestData = doc.data() as Partial<Request>;
          return {
            id: doc.id,
            clientName: requestData.clientName ?? "Unknown",
            service: requestData.service ?? "Unknown",
            location: requestData.location ?? "Not provided",
            status: requestData.status ?? "Pending",
          } as Request;
        })
      );
    });

    return () => unsubscribeRequests();
  }, [user]);

  const handleAddService = async () => {
    if (!selectedService) {
      alert("Please select a service.");
      return;
    }

    if (services.some((service) => service.serviceName === selectedService)) {
      alert("You have already added this service.");
      return;
    }

    try {
      const userRef = doc(db, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedServices = [
          ...(userData.servicesOffered || []),
          { name: selectedService },
        ];

        await updateDoc(userRef, { servicesOffered: updatedServices });

        setServices(updatedServices);
        setSelectedService("");
        alert("Service added successfully!");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service.");
    }
  };

  const handleDeleteService = async (serviceName: string) => {
    try {
      const userRef = doc(db, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedServices = userData.servicesOffered.filter(
          (service: { serviceName: string }) => service.serviceName !== serviceName
        );

        await updateDoc(userRef, { servicesOffered: updatedServices });

        setServices(updatedServices);
        alert("Service deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  return (
    <>
      <Navbar /> {/* Reusable navbar */}
      <Container className="mt-4">
        <h2 className="mb-3">Service Provider Dashboard</h2>
        <p>Welcome, {user?.email}</p>

        {/* Add Service Section */}
        <Card className="mb-4 p-3 shadow-sm">
          <h4>Add a Service</h4>
          <Form.Group>
            <Form.Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              <option value="">Select a Service</option>
              {availableServices
                .filter((service) => !services.some((s) => s.serviceName === service))
                .map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Button onClick={handleAddService} className="mt-2" variant="primary">
            Add Service
          </Button>
        </Card>

       {/* Services Offered Section */}
<Card className="mb-4 p-3 shadow-sm">
  <h4>Services Offered</h4>
  {services.length === 0 ? (
    <p>No services added yet.</p>
  ) : (
    <div className="row row-cols-1 row-cols-md-2 g-4"> {/* Grid layout with 2 columns */}
      {services.map((service) => (
        <div key={service.serviceId} className="col">
          <Card>
            <Card.Body>
              <Card.Title>{service.serviceName}</Card.Title>
              <Button
                onClick={() => handleDeleteService(service.serviceName)}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  )}
</Card>

        {/* Requests Section */}
        <Card className="mb-4 p-3 shadow-sm">
          <h4>Service Requests</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.clientName}</td>
                  <td>{request.service}</td>
                  <td>{request.location}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Service Ratings Section */}
        <Card className="p-3 shadow-sm">
          <h4>Service Ratings</h4>
          <ProviderRating />
        </Card>
      </Container>
    </>
  );
}

export default ServiceProviderDashboard;
