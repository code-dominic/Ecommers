const HeroSection = () => {
  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
        textAlign: "center",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "#d4f0ea",
          color: "#1c5d53",
          padding: "0.4rem 1rem",
          borderRadius: "2rem",
          fontSize: "0.9rem",
          fontWeight: "500",
          marginBottom: "1rem",
        }}
      >
        ★ Premium Quality Guaranteed
      </div>

      {/* Heading */}
      <h1 className="fw-bold display-5">
        Modern <span style={{ color: "#2d9382" }}>Plastic</span> Solutions
      </h1>

      {/* Description */}
      <p
        style={{
          maxWidth: "650px",
          margin: "1rem auto",
          color: "#5c6b73",
          fontSize: "1.1rem",
        }}
      >
        Discover our premium collection of innovative plastic products designed
        for modern living. Quality, durability, and style in every piece.
      </p>

      {/* Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          className="btn btn-lg"
          style={{
            backgroundColor: "#2d9382",
            color: "white",
            borderRadius: "0.5rem",
          }}
        >
          Shop Collection →
        </button>
        <button
          className="btn btn-lg btn-outline-secondary"
          style={{ borderRadius: "0.5rem" }}
        >
          Explore Categories
        </button>
      </div>

      {/* Stats */}
      <div className="d-flex justify-content-center gap-5 mt-5 flex-wrap">
        <div>
          <h4 className="fw-bold text-success">500+</h4>
          <p className="mb-0 text-muted">Products</p>
        </div>
        <div>
          <h4 className="fw-bold text-success">10K+</h4>
          <p className="mb-0 text-muted">Happy Customers</p>
        </div>
        <div>
          <h4 className="fw-bold text-success">15+</h4>
          <p className="mb-0 text-muted">Years Experience</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
