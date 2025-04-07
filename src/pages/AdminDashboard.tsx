import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/navbar"; 
import "../App.css";

function AdminDashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState("Service@123"); // Default password
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]); // Store users list
  const [selectedServices, setSelectedServices] = useState<{ serviceId: string; serviceName: string }[]>([]);
  const [availableServices, setAvailableServices] = useState<{ serviceId: string; serviceName: string }[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [services, setServices] = useState<any[]>([]);

  // Fetch services and users from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, "serviceslist"));
      const servicesArray = querySnapshot.docs.map((doc) => ({
        serviceId: doc.id,
        serviceName: doc.data().title || "Unnamed Service",
      }));
      setAvailableServices(servicesArray);
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchServices();
    fetchUsers();
  }, []);

  const handleCreateServiceProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        userId,
        name,
        phone,
        email,
        role: "service-provider",
        servicesOffered: selectedServices,
        createdAt: serverTimestamp(),
        passwordChanged: false,
      });

      setUsers((prevUsers) => [
        ...prevUsers,
        { id: userId, name, phone, email, role: "service-provider", servicesOffered: selectedServices },
      ]);

      setMessage(`Service provider account for ${email} created successfully!`);
      alert(`Service provider ${email} has been created successfully!`);
      setName("");
      setPhone("");
      setEmail("");
      setSelectedServices([]);
    } catch (err) {
      setMessage("An error occurred while creating the account.");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !serviceDescription) {
      setMessage("Please fill in all service details.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "serviceslist"), {
        title: serviceName,
        description: serviceDescription,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "serviceslist", docRef.id), {
        serviceId: docRef.id,
      });

      setMessage(`Service "${serviceName}" added successfully!`);
      alert(`Service "${serviceName}" has been added successfully!`);
      setServiceName("");
      setServiceDescription("");
      setServices([...services, { serviceId: docRef.id, serviceName, description: serviceDescription }]);
    } catch (err) {
      setMessage("Error adding service.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
      setMessage("User deleted successfully!");
    } catch (err) {
      setMessage("Error deleting user.");
    }
  };

  return (
    <div className="container mt-5">
      <Navbar /> {/* Navbar component */}

      <h2>Admin Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {/* ADD SERVICE FORM */}
        <div className="col-md-6">
          <h3>Add New Service</h3>
          <form onSubmit={handleAddService} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Service Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Service Description</label>
              <textarea
                className="form-control"
                placeholder="Enter service description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Service</button>
          </form>
        </div>

        {/* CREATE SERVICE PROVIDER FORM */}
        <div className="col-md-6">
          <h3>Create Service Provider</h3>
          <form onSubmit={handleCreateServiceProvider}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Service Provider Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Service Provider Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter service provider email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Services Offered</label>
              {availableServices.map((service) => (
                <div key={service.serviceId} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={service.serviceId}
                    checked={selectedServices.some((s) => s.serviceId === service.serviceId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServices((prev) => [...prev, { serviceId: service.serviceId, serviceName: service.serviceName }]);
                      } else {
                        setSelectedServices((prev) => prev.filter((s) => s.serviceId !== service.serviceId));
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor={service.serviceId}>{service.serviceName}</label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-success">Create Account</button>
          </form>
        </div>
      </div>

      <hr />

      <h3>Manage Users</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Services</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.servicesOffered ? user.servicesOffered.map((service: { serviceId: string; serviceName: string }) => service.serviceName).join(", ") : "N/A"}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
