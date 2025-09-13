// Footer.js
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const FooterSection = () => {
  const styles = {
    footer: {
      backgroundColor: "#fff",
      padding: "40px 20px",
      borderTop: "1px solid #eaeaea",
    },
    brandTitle: {
      fontWeight: "bold",
      color: "teal",
    },
    text: {
      color: "#555",
    },
    socialIcon: {
      fontSize: "1.2rem",
      color: "teal",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    link: {
      color: "#555",
      textDecoration: "none",
    },
    bottomText: {
      color: "#555",
      fontSize: "0.9rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <Container>
        <Row className="text-start">
          {/* Brand Info */}
          <Col md={3} sm={6} className="mb-4">
            <h5 style={styles.brandTitle}>PlasticPro</h5>
            <p style={styles.text}>
              Leading provider of premium plastic products for modern living.
              Quality, durability, and innovation in every piece.
            </p>
            <div className="d-flex gap-3">
              <a href="#"><FaFacebookF style={styles.socialIcon} /></a>
              <a href="#"><FaTwitter style={styles.socialIcon} /></a>
              <a href="#"><FaInstagram style={styles.socialIcon} /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Quick Links</h6>
            <ul style={styles.list}>
              <li><a href="#" style={styles.link}>About Us</a></li>
              <li><a href="#" style={styles.link}>Products</a></li>
              <li><a href="#" style={styles.link}>Categories</a></li>
              <li><a href="#" style={styles.link}>Contact</a></li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Customer Service</h6>
            <ul style={styles.list}>
              <li><a href="#" style={styles.link}>Shipping Info</a></li>
              <li><a href="#" style={styles.link}>Returns</a></li>
              <li><a href="#" style={styles.link}>FAQ</a></li>
              <li><a href="#" style={styles.link}>Support</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={3} sm={6} className="mb-4">
            <h6 style={{ fontWeight: "bold" }}>Contact Info</h6>
            <p style={styles.text}><MdEmail /> hello@plasticpro.com</p>
            <p style={styles.text}><MdPhone /> +1 (555) 123-4567</p>
            <p style={styles.text}><MdLocationOn /> 123 Business Ave, City, ST 12345</p>
          </Col>
        </Row>

        {/* Bottom bar */}
        <Row>
          <Col className="text-center mt-3">
            <p style={styles.bottomText}>
              © 2024 PlasticPro. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterSection;
