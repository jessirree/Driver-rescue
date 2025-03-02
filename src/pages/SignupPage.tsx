import"../App.css"

function SignUpPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#002f6c" }}>
      <div className="card shadow-lg p-4" style={{ width: "24rem", borderRadius: "10px" }}>
        <h3 className="text-center" style={{ color: "#002f6c", fontWeight: "bold" }}>
          Signup
        </h3>
        <hr className="w-25 mx-auto" style={{ border: "2px solid #002f6c" }} />
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Already have an account? <a href="#" className="text-primary">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
