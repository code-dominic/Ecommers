import axios from "axios";
import { useState } from "react";
const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const FormElement = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    color: "",
    size: "",
    cost: 0,
    imageUrl: "",
    imageFile : "",
    variants: [],
  });

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    cost: "",
    imageUrl: "",
  });

  // handle product field changes
 const handleProductChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "imageFile") {
    setProduct({ ...product, imageFile: files[0] }); // store file object
  } else {
    setProduct({ ...product, [name]: value });
  }
};

  // handle variant field changes
  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // add variant into product.variants[]
  const addVariant = () => {
    if (variant.color && variant.size && variant.cost) {
      setProduct({
        ...product,
        variants: [...product.variants, variant],
      });
      // reset variant form
      setVariant({ size: "", color: "", cost: "", imageUrl: "" });
    }
  };

  // remove variant
  const removeVariant = (index) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: updatedVariants });
  };

  // submit full product
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting Product:", product);

  try {
    // create FormData object
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("color", product.color);
    formData.append("size", product.size);
    formData.append("cost", product.cost);

    if (product.imageFile) {
      formData.append("image", product.imageFile); // "image" should match upload.single("image") in backend
    }

    // variants need to be stringified for form-data
    formData.append("variants", JSON.stringify(product.variants));

    const response = await axios.post(`${BackendUrl}/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Saved:", response.data);

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
};


  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Add New Product
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Product Information Section */}
                <div className="mb-4">
                  <h4 className="text-secondary mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Product Information
                  </h4>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productName" className="form-label fw-bold">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleProductChange}
                        className="form-control"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productCost" className="form-label fw-bold">
                        Base Cost *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          id="productCost"
                          name="cost"
                          placeholder="0.00"
                          value={product.cost}
                          onChange={handleProductChange}
                          className="form-control"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label fw-bold">
                      Description
                    </label>
                    <textarea
                      id="productDescription"
                      name="description"
                      placeholder="Enter product description"
                      value={product.description}
                      onChange={handleProductChange}
                      className="form-control"
                      rows="3"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productColor" className="form-label fw-bold">
                        Default Color
                      </label>
                      <input
                        type="text"
                        id="productColor"
                        name="color"
                        placeholder="e.g., Blue, Red, Black"
                        value={product.color}
                        onChange={handleProductChange}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="productSize" className="form-label fw-bold">
                        Default Size
                      </label>
                      <input
                        type="text"
                        id="productSize"
                        name="size"
                        placeholder="e.g., M, L, XL"
                        value={product.size}
                        onChange={handleProductChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="productImage" className="form-label fw-bold">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      id="productImage"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={product.imageUrl}
                      onChange={handleProductChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImage" className="form-label fw-bold">
                      Product Image 
                    </label>
                    <input
                      type="file"
                      id="productImage"
                      name="imageFile"
                      onChange={handleProductChange}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Variants Section */}
                <div className="mb-4">
                  <h4 className="text-secondary mb-3">
                    <i className="fas fa-layer-group me-2"></i>
                    Product Variants
                  </h4>
                  
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-3 text-muted">Add Variant</h6>
                      <div className="row">
                        <div className="col-md-3 mb-2">
                          <input
                            type="text"
                            name="color"
                            placeholder="Color"
                            value={variant.color}
                            onChange={handleVariantChange}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div className="col-md-3 mb-2">
                          <input
                            type="text"
                            name="size"
                            placeholder="Size"
                            value={variant.size}
                            onChange={handleVariantChange}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div className="col-md-3 mb-2">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              name="cost"
                              placeholder="Cost"
                              value={variant.cost}
                              onChange={handleVariantChange}
                              className="form-control"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 mb-2">
                          <div className="input-group">
                            <input
                              type="url"
                              name="imageUrl"
                              placeholder="Image URL"
                              value={variant.imageUrl}
                              onChange={handleVariantChange}
                              className="form-control form-control-sm"
                            />
                            <button
                              type="button"
                              onClick={addVariant}
                              className="btn btn-outline-primary btn-sm"
                              disabled={!variant.color || !variant.size || !variant.cost}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display added variants */}
                  {product.variants.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-muted mb-2">Added Variants ({product.variants.length})</h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-secondary">
                            <tr>
                              <th>Color</th>
                              <th>Size</th>
                              <th>Cost</th>
                              <th>Image</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.variants.map((v, i) => (
                              <tr key={i}>
                                <td>
                                  <span className="badge bg-info">{v.color}</span>
                                </td>
                                <td>
                                  <span className="badge bg-secondary">{v.size}</span>
                                </td>
                                <td>
                                  <strong>${v.cost}</strong>
                                </td>
                                <td>
                                  {v.imageUrl ? (
                                    <i className="fas fa-image text-success" title="Image added"></i>
                                  ) : (
                                    <i className="fas fa-image text-muted" title="No image"></i>
                                  )}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(i)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Remove variant"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => {
                      setProduct({
                        name: "",
                        description: "",
                        color: "",
                        size: "",
                        cost: 0,
                        imageUrl: "",
                        variants: [],
                      });
                      setVariant({ size: "", color: "", cost: "", imageUrl: "" });
                    }}
                  >
                    <i className="fas fa-undo me-2"></i>
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={!product.name || !product.cost}
                  >
                    <i className="fas fa-save me-2"></i>
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormElement;