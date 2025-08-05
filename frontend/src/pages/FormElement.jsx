import { useState } from "react";
import axios from "axios";

const FormElement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cost, setCost] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("PRODUCT SUBMIT!!");
    console.log({ name, description, imageUrl, cost });

    try {
      const response = await axios.post("http://localhost:5000/", {
        name,
        description,
        imageUrl,
        cost,
      });

      console.log("Server response:", response.data);

      // Reset form
      setName("");
      setDescription("");
      setImageUrl("");
      setCost(0);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <>
      <h1>Add Products</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <label htmlFor="cost">Cost:</label>
        <input
          type="number"
          id="cost"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
        />
        <br /><br />

        <label htmlFor="imageUrl">Image URL:</label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default FormElement;
