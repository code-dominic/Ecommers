import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import HeroSection from "../section/HeroSection";
import ProductCard from "../components/ProductCard";
import FooterSection from "../section/FooterSection";
const  BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const Home = ({ handelClick }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BackendUrl}`);
        console.log("👉 Server response:", res.data); 
        setProducts(res.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeroSection />

      {/* ✅ Featured Products Section */}
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
          Featured <span style={{ color: "teal" }}>Products</span>
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555", marginTop: "10px" }}>
          Discover our most popular plastic products, designed with quality and sustainability in mind.
        </p>
      </section>

      <div style={{ padding: "20px" }}>
        {Array.isArray(products) ? (
          <Container fluid>
            <Row className="g-4">
              {products.map((product, index) => (
                <Col
                  key={index}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{ display: "flex" }}
                >
                  {/* ✅ Corrected onClick */}
                  <ProductCard
                    className =""
                    product={product}
                    handelClick={handelClick}
                    
                  />
                </Col>
              ))}
            </Row>
          </Container>
        ) : (
          <p className="text-center">Loading or no products found.</p>
        )}
      </div>

      <FooterSection/>
    </>
  );
};

export default Home;
