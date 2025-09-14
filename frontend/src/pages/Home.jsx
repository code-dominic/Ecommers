import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import HeroSection from "../section/HeroSection";
import ProductCard from "../components/ProductCard";
import FooterSection from "../section/FooterSection";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const Home = ({ handelClick }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/products`);
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

      <div className="container my-5 home-wrapper">
        <h2 className="text-center mb-4">
          Featured <span style={{ color: "teal" }}>Products</span>
        </h2>
        <p className="text-center text-muted mb-5">
          Discover our most popular plastic products, designed with quality and sustainability in mind.
        </p>

        {Array.isArray(products) && products.length > 0 ? (
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
                  <ProductCard product={product} handelClick={handelClick} />
                </Col>
              ))}
            </Row>
          </Container>
        ) : (
          <div className="text-center py-5">
            <h5 className="text-muted">No products available right now.</h5>
          </div>
        )}
      </div>

      <FooterSection />

      {/* ✅ Inline CSS for responsiveness */}
      <style>
        {`
          @media (max-width: 500px) {
            .home-wrapper {
              padding: 0 10px;
            }

            .home-wrapper h2 {
              font-size: 1.6rem !important;
            }

            .home-wrapper p {
              font-size: 0.9rem !important;
            }

            .home-wrapper .text-center {
              text-align: center !important;
            }

            .home-wrapper .btn {
              font-size: 0.8rem !important;
              padding: 0.3rem 0.6rem !important;
            }
               /* Reduce font sizes */
      h2 {
        font-size: 1.2rem !important;
      }
      h4 {
        font-size: 1rem !important;
      }
      h5 {
        font-size: 0.9rem !important;
      }
      strong {
        font-size: 0.9rem !important;
      }
      span, div, label {
        font-size: 0.8rem !important;
      }

      /* Shrink buttons */
      .btn {
        font-size: 0.75rem !important;
        padding: 0.25rem 0.5rem !important;
      }

      /* Shrink checkout button */
      .btn-lg {
        font-size: 0.85rem !important;
        padding: 0.4rem 0.8rem !important;
      }

      /* Shrink textarea */
      textarea {
        font-size: 0.8rem !important;
      }

            
          }
        `}
      </style>
    </>
  );
};

export default Home;
