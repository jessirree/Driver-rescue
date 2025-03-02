import Card from "../components/card";
import "../App.css";

function ServiceGrid() {
  const services = [
    { title: "Fuel Delivery", image: "/assets/fuel.png" },
    { title: "Battery Issues", image: "/assets/battery.png" },
    { title: "Towing", image: "/assets/tow.png" },
    { title: "Flat Tyre", image: "/assets/flat_tyre.png" },
    { title: "Key Fob", image: "/assets/key.png" },
    { title: "Accident", image: "/assets/accident.png" },
  ];

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Request Assistance</h1>
      <div className="row g-3">
        {services.map((service, index) => (
          <div className="col-6 col-md-4" key={index}>
            <Card title={service.title} image={service.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceGrid;
