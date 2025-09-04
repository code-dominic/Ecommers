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
} from "react-bootstrap";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminCancellation({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BackendUrl}/admin/orders/cancel`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching cancelled orders:", error);
        setError("Failed to fetch cancelled orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCancelledOrders();
  }, [token]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="danger" className="mb-3" />
          <h4 className="text-muted">Loading cancelled orders...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ margin: "0px", padding: "0px" }}>
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-danger text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">
                    <i className="fas fa-times-circle me-2"></i>
                    Cancelled Orders
                  </h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    {orders.length} Cancelled
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
                    <thead className="table-danger">
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
                          <td>{order.user?.username || order.user?.email}</td>
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
                            <Badge bg="danger" className="px-3 py-2">
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
                  <i className="fas fa-ban fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Cancelled Orders</h4>
                  <p className="text-secondary mb-4">
                    There are currently no cancelled orders in the system.
                  </p>
                </div>
              )}
            </Card.Body>

            {orders.length > 0 && (
              <Card.Footer className="bg-light text-muted">
                <Row className="align-items-center">
                  <Col>
                    <small>
                      Showing {orders.length} cancelled order
                      {orders.length !== 1 ? "s" : ""}
                    </small>
                  </Col>
                </Row>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminCancellation;
