import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = ({ token , setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

 useEffect(() => {
  if (token && window.location.pathname === '/login') {
    navigate('/');
  }
}, [token, navigate]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-teal" to="/" style={{ color: "#2d9382" }}>
          PlasticPro
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/product">Product</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/form">Add Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>

            <li className="nav-item">
              {token ? (
                <button className="btn nav-link border-0 bg-transparent" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link className="nav-link" to="/login">Login</Link>
              )}
            </li>

          </ul>

          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
