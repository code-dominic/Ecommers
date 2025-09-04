import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Table, Spinner, Badge, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminProductsList({ token, setProductID }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const viewProduct = (ProId) => {
        setProductID(ProId);
        navigate(`/dashboard/products-list/views`);
    };

    const editProduct = (ProId) => {
        setProductID(ProId);
        navigate(`/dashboard/products-list/edit`);
    };

    const deleteProduct = async (ProId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${BackendUrl}/admin/products/${ProId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Remove deleted product from state
                setProducts(products.filter(product => product._id !== ProId));
            } catch (error) {
                console.error("Error deleting product:", error);
                setError("Failed to delete product. Please try again.");
            }
        }
    };

    useEffect(() => {
        if (!token) return; // prevent call if token is missing

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${BackendUrl}/admin/products/list`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(res.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <h4 className="text-muted">Loading products...</h4>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid style={{margin : "0px" , padding : "0px"}} className="">
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <Row className="align-items-center">
                                <Col>
                                    <h2 className="mb-0">
                                        <i className="fas fa-boxes me-2"></i>
                                        Admin Products Management
                                    </h2>
                                </Col>
                                <Col xs="auto">
                                    <Badge bg="light" text="dark" className="fs-6">
                                        {products.length} Products
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

                            {products.length > 0 ? (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="text-center" style={{ width: '60px' }}>#</th>
                                                <th>Product Details</th>
                                                <th className="text-center">Color</th>
                                                <th className="text-center">Size</th>
                                                <th className="text-center">Cost</th>
                                                <th className="text-center">Variants</th>
                                                <th className="text-center" style={{ width: '200px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product, index) => (
                                                <tr key={product._id}>
                                                    <td className="text-center text-muted fw-bold">
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <h6 className="mb-1 text-primary">
                                                                {product.name || "Untitled Product"}
                                                            </h6>
                                                            <small className="text-muted d-block">
                                                                ID: {product._id}
                                                            </small>
                                                            {product.description && (
                                                                <small className="text-secondary">
                                                                    {product.description.length > 50 
                                                                        ? `${product.description.substring(0, 50)}...`
                                                                        : product.description
                                                                    }
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {product.color ? (
                                                            <Badge bg="info" className="text-dark">
                                                                {product.color}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {product.size ? (
                                                            <Badge bg="secondary">
                                                                {product.size}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {product.cost ? (
                                                            <span className="fw-bold text-success">
                                                                ${parseFloat(product.cost).toFixed(2)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {product.variants && product.variants.length > 0 ? (
                                                            <Badge bg="warning" text="dark">
                                                                {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                                                            </Badge>
                                                        ) : (
                                                            <Badge bg="light" text="muted">
                                                                No variants
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => viewProduct(product._id)}
                                                                title="View Product Details"
                                                            >
                                                                <i className="fas fa-eye">View</i>
                                                            </Button>
                                                            {/* <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => editProduct(product._id)}
                                                                title="Edit Product"
                                                            >
                                                              Edit  <i className="fas fa-edit"></i>
                                                            </Button> */}
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => deleteProduct(product._id)}
                                                                title="Delete Product"
                                                            >
                                                               Delete <i className="fas fa-trash"></i>
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
                                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                                    <h4 className="text-muted">No Products Found</h4>
                                    <p className="text-secondary mb-4">
                                        There are currently no products in the system.
                                    </p>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => navigate('/dashboard/products/add')}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add First Product
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                        {products.length > 0 && (
                            <Card.Footer className="bg-light text-muted">
                                <Row className="align-items-center">
                                    <Col>
                                        <small>
                                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                                        </small>
                                    </Col>
                                    <Col xs="auto">
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            onClick={() => navigate('/dashboard/products/add')}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Add New Product
                                        </Button>
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

export default AdminProductsList;