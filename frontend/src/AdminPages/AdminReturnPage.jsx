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

function AdminReturnPage({ token }) {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BackendUrl}/admin/returns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReturns(res.data.returns || []);
      } catch (error) {
        console.error("Error fetching returns:", error);
        setError("Failed to fetch return requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, [token]);

  // Handle status click
  const handleStatusClick = (ret) => {
    setSelectedReturn(ret);
    setNewStatus(ret.return?.status || "requested");
    setShowModal(true);
  };

  // Save updated return status
  const handleSaveStatus = async () => {
    if (!selectedReturn) return;
    try {
      await axios.put(
        `${BackendUrl}/admin/returns/${selectedReturn._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state locally
      setReturns((prev) =>
        prev.map((r) =>
          r._id === selectedReturn._id
            ? { ...r, return: { ...r.return, status: newStatus } }
            : r
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating return status:", error);
      alert("Failed to update return status");
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
          <h4 className="text-muted">Loading return requests...</h4>
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
                    <i className="fas fa-undo-alt me-2"></i>
                    Returns Management
                  </h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    {returns.length} Returns
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

              {returns.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Return ID</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Requested At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returns.map((ret, index) => (
                        <tr key={ret._id}>
                          <td className="text-center text-muted fw-bold">
                            {index + 1}
                          </td>
                          <td>{ret._id}</td>
                          <td>{ret.user?.username || ret.user?.email}</td>
                          <td>
                            {ret.product?.name} (
                            {ret.variant?.name || "N/A"})
                          </td>
                          <td>{ret.quantity}</td>
                          <td>{ret.return?.reason || "-"}</td>
                          <td>
                            <Badge
                              bg={
                                ret.return?.status === "completed"
                                  ? "success"
                                  : ret.return?.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                              text="dark"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleStatusClick(ret)}
                            >
                              {ret.return?.status || "requested"}
                            </Badge>
                          </td>
                          <td>
                            {ret.return?.requestedAt
                              ? new Date(
                                  ret.return.requestedAt
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Returns Found</h4>
                  <p className="text-secondary mb-4">
                    There are currently no return requests.
                  </p>
                </div>
              )}
            </Card.Body>

            {returns.length > 0 && (
              <Card.Footer className="bg-light text-muted">
                <Row className="align-items-center">
                  <Col>
                    <small>
                      Showing {returns.length} return
                      {returns.length !== 1 ? "s" : ""}
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
          <Modal.Title>Update Return Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusSelect">
              <Form.Label>Select New Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pickedUp">Picked Up</option>
                <option value="completed">Completed</option>
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

export default AdminReturnPage;
