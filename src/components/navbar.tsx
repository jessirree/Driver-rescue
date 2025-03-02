import "bootstrap-icons/font/bootstrap-icons.css" // Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; // Custom styles

const Navbar = () => {
  return (
    <nav className="navbar fixed-bottom navbar-expand">
      <div className="container-fluid d-flex justify-content-around">
        <a href="#" className="nav-item text-white text-center">
          <i className="bi bi-house-door"></i>
          <p className="nav-label">Home</p>
        </a>
        <a href="#" className="nav-item text-white text-center">
          <i className="bi bi-activity"></i>
          <p className="nav-label">Activity</p>
        </a>
        <a href="#" className="nav-item text-white text-center">
          <i className="bi bi-bell"></i>
          <p className="nav-label">Notifications</p>
        </a>
        <a href="#" className="nav-item text-white text-center">
          <i className="bi bi-person"></i>
          <p className="nav-label">Account</p>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;