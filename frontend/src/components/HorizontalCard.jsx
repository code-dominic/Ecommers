


const HorizontalCard = ({ product , handelClick }) => {
  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }} key={product._id} onClick={ () => {handelClick(product._id)}}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={product.imageUrl} className="img-fluid rounded-start" alt="..." />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.description}</p>
            {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;

