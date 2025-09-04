import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    if (token && window.location.pathname === "/login") {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(90deg, #2d9382, #1c5d53)",
        padding: "0.8rem 1.5rem",
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: "#fff", fontSize: "1.4rem" }}
        >
          PlasticPro
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "#fff" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link className="nav-link text-white fw-medium" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-medium" to="/dashboard">
                DashBoard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-medium" to="/orders">
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-medium" to="/cart">
                Cart
              </Link>
            </li>
            <li className="nav-item">
              {token ? (
                <button
                  className="btn btn-light btn-sm fw-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link className="btn btn-light btn-sm fw-semibold" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
