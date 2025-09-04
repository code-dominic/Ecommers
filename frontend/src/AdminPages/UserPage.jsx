import { useState, useEffect } from "react";
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

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BackendUrl}/dashboard/users`);
        setUsers(res.data);
      } catch (error) {
        console.error("Error in fetching Users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4 className="text-muted">Loading users...</h4>
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
                    <i className="fas fa-users me-2"></i>
                    Users Management
                  </h2>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    {users.length} Users
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

              {users.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center" style={{ width: "60px" }}>
                          #
                        </th>
                        <th>Username</th>
                        <th>Email</th>
                        <th className="text-center">Cart Items</th>
                        <th className="text-center">Orders Placed</th>
                        <th className="text-center">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user._id}>
                          <td className="text-center text-muted fw-bold">
                            {index + 1}
                          </td>
                          <td>
                            <div>
                              <h6 className="mb-1 text-primary">
                                {user.username}
                              </h6>
                              <small className="text-muted d-block">
                                ID: {user._id}
                              </small>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td className="text-center">
                            <Badge bg="info" text="dark">
                              {user.cart ? user.cart.length : 0}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="warning" text="dark">
                              {user.orders ? user.orders.length : 0}
                            </Badge>
                          </td>
                          <td className="text-center">
                            {user.Role === "admin" ? (
                              <Badge bg="danger">Admin</Badge>
                            ) : (
                              <Badge bg="secondary">User</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No Users Found</h4>
                  <p className="text-secondary mb-4">
                    There are currently no registered users in the system.
                  </p>
                </div>
              )}
            </Card.Body>
            {users.length > 0 && (
              <Card.Footer className="bg-light text-muted">
                <Row className="align-items-center">
                  <Col>
                    <small>
                      Showing {users.length} user
                      {users.length !== 1 ? "s" : ""}
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

export default UserPage;

