// Footer.js
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const FooterSection = () => {
  return (
    <footer style={{ backgroundColor: "#fff", padding: "40px 20px", borderTop: "1px solid #eaeaea" }}>
      <Container>
        <Row className="text-start">
          {/* Brand Info */}
          <Col md={3} sm={6} className="mb-4">
            <h5 style={{ fontWeight: "bold", color: "teal" }}>PlasticPro</h5>
            <p style={{ color: "#555" }}>
              Leading provider of premium plastic products for modern living.
              Quality, durability, and innovation in every piece.
            </p>
            <div className="d-flex gap-3">
              <a href="#"><FaFacebookF style={{ fontSize: "1.2rem", color: "teal" }} /></a>
              <a href="#"><FaTwitter style={{ fontSize: "1.2rem", color: "teal" }} /></a>
              <a href="#"><FaInstagram style={{ fontSize: "1.2rem", color: "teal" }} /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Quick Links</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>About Us</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Products</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Categories</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Contact</a></li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Customer Service</h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Shipping Info</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Returns</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>FAQ</a></li>
              <li><a href="#" style={{ color: "#555", textDecoration: "none" }}>Support</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Contact Info</h6>
            <p style={{ margin: 0, color: "#555" }}><MdEmail /> hello@plasticpro.com</p>
            <p style={{ margin: 0, color: "#555" }}><MdPhone /> +1 (555) 123-4567</p>
            <p style={{ margin: 0, color: "#555" }}><MdLocationOn /> 123 Business Ave, City, ST 12345</p>
          </Col>
        </Row>

        {/* Bottom bar */}
        <Row>
          <Col className="text-center mt-3">
            <p style={{ color: "#555", fontSize: "0.9rem" }}>
              © 2024 PlasticPro. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterSection;
