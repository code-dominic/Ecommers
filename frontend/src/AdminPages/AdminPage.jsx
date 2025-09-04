import axios from "axios";
import { useEffect, useState } from "react";
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

function AdminPage({ token }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BackendUrl}/dashboard/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Failed to fetch admins. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [token]);

  const handleEditClick = (admin) => {
    setEditingAdmin(admin);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${BackendUrl}/dashboard/admin/${editingAdmin._id}`,
        editingAdmin,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins((prev) =>
        prev.map((a) => (a._id === editingAdmin._id ? editingAdmin : a))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      setError("Failed to update admin. Try again.");
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`${BackendUrl}/dashboard/admin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins((prev) => prev.filter((a) => a._id !== adminId));
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin. Try again.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4 className="text-muted">Loading admins...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">
                    <i className="fas fa-user-shield me-2"></i>
                    Admin Management
                  </h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    {admins.length} Admins
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

              {admins.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center" style={{ width: "60px" }}>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th className="text-center" style={{ width: "200px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin, index) => (
                        <tr key={admin._id || admin.email}>
                          <td className="text-center text-muted fw-bold">{index + 1}</td>
                          <td>{admin.username}</td>
                          <td>{admin.email}</td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => alert(JSON.stringify(admin, null, 2))}
                                title="View Admin"
                              >
                                <i className="fas fa-eye">View</i>
                              </Button>
                              <Button
                                variant="outline-warning"
                                className="me-2"
                                onClick={() => handleEditClick(admin)}
                                title="Edit Admin"
                              >
                                <i className="fas fa-edit">Edit</i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(admin._id)}
                                title="Delete Admin"
                              >
                                <i className="fas fa-trash">Delete</i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Admins Found</h4>
                  <p className="text-secondary mb-4">
                    There are currently no admins in the system.
                  </p>
                  <Button variant="primary">
                    <i className="fas fa-plus me-2"></i>
                    Add First Admin
                  </Button>
                </div>
              )}
            </Card.Body>
            {admins.length > 0 && (
              <Card.Footer className="bg-light text-muted">
                <Row className="align-items-center">
                  <Col>
                    <small>
                      Showing {admins.length} admin{admins.length !== 1 ? "s" : ""}
                    </small>
                  </Col>
                  <Col xs="auto">
                    <Button variant="success">
                      <i className="fas fa-plus me-2"></i>
                      Add New Admin
                    </Button>
                  </Col>
                </Row>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Edit Admin Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingAdmin && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAdmin.username}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, username: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) =>
                    setEditingAdmin({ ...editingAdmin, email: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;
