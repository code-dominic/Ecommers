import axios from "axios";
import { useState } from "react";
const  BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const FormElement = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    color: "",
    size: "",
    cost: 0,
    imageUrl: "",
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
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // handle variant field changes
  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // add variant into product.variants[]
  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, variant],
    });
    // reset variant form
    setVariant({ size: "", color: "", cost: "", imageUrl: "" });
  };

  // submit full product
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Product:", product);

    try {
      const response = await axios.post(`${backendURL}/products`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      console.log("Saved:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded-md">
      <h2 className="text-xl font-bold">Add Products</h2>

      {/* Product Fields */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="color"
        placeholder="Default Color"
        value={product.color}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="size"
        placeholder="Default Size"
        value={product.size}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="cost"
        placeholder="Base Cost"
        value={product.cost}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="imageUrl"
        placeholder="Product Image URL"
        value={product.imageUrl}
        onChange={handleProductChange}
        className="border p-2 w-full"
      />

      {/* Variants Section */}
      <h3 className="text-lg font-semibold">Variants</h3>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={variant.color}
          onChange={handleVariantChange}
          className="border p-2"
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={variant.size}
          onChange={handleVariantChange}
          className="border p-2"
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={variant.cost}
          onChange={handleVariantChange}
          className="border p-2"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Variant Image URL"
          value={variant.imageUrl}
          onChange={handleVariantChange}
          className="border p-2"
        />
        <button
          type="button"
          onClick={addVariant}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Variant
        </button>
      </div>

      {/* Show added variants */}
      <ul className="list-disc pl-5">
        {product.variants.map((v, i) => (
          <li key={i}>
            {v.color} - {v.size} (Cost: {v.cost}, Image: {v.imageUrl})
          </li>
        ))}
      </ul>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Product
      </button>
    </form>
  );
};

export default FormElement;
