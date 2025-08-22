import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

const UpdateProductModal = ({ show, setShow, product, productID, setProduct }) => {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedCost, setUpdatedCost] = useState("");
  const [updatedImageUrl, setUpdatedImageUrl] = useState("");

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BackendUrl}/products/${productID}`, {
        name: updatedName || product.name,
        description: updatedDescription || product.description,
        cost: updatedCost || product.cost,
        imageUrl: updatedImageUrl || product.imageUrl,
      });

      const updated = await axios.get(`${BackendUrl}/products/${productID}`);
      setProduct(updated.data);
      setShow(false);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleUpdateSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cost</Form.Label>
            <Form.Control type="number" value={updatedCost} onChange={(e) => setUpdatedCost(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Photo Link</Form.Label>
            <Form.Control type="text" value={updatedImageUrl} onChange={(e) => setUpdatedImageUrl(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
