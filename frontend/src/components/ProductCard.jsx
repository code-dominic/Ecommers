import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

const ProductCard = ({ product ,handelClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="shadow-sm"
      onClick={()=> handelClick(product._id)}
      style={{
        padding : '0',
        backgroundColor :'rbg(0 ,0 0)',
        height: "500px",
        width: "400px",
           borderRadius: "15px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease", // smooth animation
        transform: hovered ? "scale(1.025)" : "scale(1)", // zoom on hover
        boxShadow: hovered
      ? "0px 12px 24px rgba(0, 0, 0, 0.25)" // deeper shadow on hover
      : "0px 4px 12px rgba(0, 0, 0, 0.15)", // light shadow normally
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <div
        className="image-container"
        style={{
          height: "80%",
          background: `url(${product.imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderTopLeftRadius: "15px",
        borderTopRightRadius: "15px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hover Button */}
        {hovered && (
          <Button
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              backgroundColor: "teal",
              borderRadius: "8px",
              padding: "5px",
              transition: "all 0.3s ease",
            }}
            className="w-100"
            onClick={() => alert("Added to cart")}
          >
            🛒 Add to Cart
          </Button>
        )}
      </div>

      {/* Text Section */}
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <span style={{ color: "gold" }}>★★★★☆</span>
          <small className="text-muted ms-2">(156)</small>
        </div>

        <Card.Title style={{ fontSize: "1rem" }}>
          {product.name} - BBA Free
        </Card.Title>

        <div>
          <span className="fw-bold text-success">${product.cost}</span>{" "}
          <del className="text-muted"></del>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
