const HorizontalCard = ({ product, handelClick }) => {
  return (
    <div
      className="card mb-3"
      style={{ maxWidth: "76rem", maxHeight: "300px", overflow: "hidden" }}
      key={product._id}
      onClick={() => handelClick(product._id)}
    >
      <div className="row g-0 h-100">
        {/* Image Section */}
        <div className="col-md-4">
          <img
            src={product.imageUrl}
            className="img-fluid rounded-start"
            alt={product.name}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Text Section */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
