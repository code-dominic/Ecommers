import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Table,
  Spinner,
  Badge,
  Container,
  Row,
  Col,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminOrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BackendUrl}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Handle status click
  const handleStatusClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  // Save updated status
  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(
        `${BackendUrl}/admin/orders/${selectedOrder._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state locally
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: newStatus } : o
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4 className="text-muted">Loading orders...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ margin: "0px", padding: "0px" }}>
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Orders Management
                  </h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    {orders.length} Orders
                  </Badge>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="p-0">
              {error && (
                <Alert variant="danger" className="m-3 mb-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {orders.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order._id}>
                          <td className="text-center text-muted fw-bold">
                            {index + 1}
                          </td>
                          <td>{order._id}</td>
                          <td>
                            {order.user?.username || order.user?.email}
                          </td>
                          <td>
                            {order.product?.name} (
                            {order.variant?.name || "N/A"})
                          </td>
                          <td>
                            {order.variant
                              ? order.variant.size
                              : order.product?.size}
                          </td>
                          <td>
                            {order.variant
                              ? order.variant.color
                              : order.product?.color}
                          </td>
                          <td>{order.quantity}</td>
                          <td>₹{order.totalPrice}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "Shipped"
                                  ? "info"
                                  : "warning"
                              }
                              text="dark"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleStatusClick(order)}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Orders Found</h4>
                  <p className="text-secondary mb-4">
                    There are currently no orders in the system.
                  </p>
                </div>
              )}
            </Card.Body>

            {orders.length > 0 && (
              <Card.Footer className="bg-light text-muted">
                <Row className="align-items-center">
                  <Col>
                    <small>
                      Showing {orders.length} order
                      {orders.length !== 1 ? "s" : ""}
                    </small>
                  </Col>
                </Row>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusSelect">
              <Form.Label>Select New Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminOrdersPage;
