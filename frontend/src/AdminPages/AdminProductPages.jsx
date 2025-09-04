import { useEffect, useState } from "react";
import { 
    Button, Modal, Form, Card, Container, Row, Col, 
    Badge, Spinner, Alert, Image, ButtonGroup, Tabs, Tab 
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminProductPages({ token, productID }) {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    // Product update modal states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedCost, setUpdatedCost] = useState("");
    const [updatedImageUrl, setUpdatedImageUrl] = useState("");
    const [updatedColor, setUpdatedColor] = useState("");
    const [updatedSize, setUpdatedSize] = useState("");

    // Variant update modal states
    const [showVariantUpdateModal, setShowVariantUpdateModal] = useState(false);
    const [currentVariant, setCurrentVariant] = useState(null);
    const [updatedVariantColor, setUpdatedVariantColor] = useState("");
    const [updatedVariantSize, setUpdatedVariantSize] = useState("");
    const [updatedVariantCost, setUpdatedVariantCost] = useState("");
    const [updatedVariantImageUrl, setUpdatedVariantImageUrl] = useState("");

    // Edit Product submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${BackendUrl}/admin/products/${productID}`,
                {
                    name: updatedName,
                    description: updatedDescription,
                    color: updatedColor,
                    size: updatedSize,
                    cost: updatedCost,
                    imageUrl: updatedImageUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProduct(res.data.product || res.data);
            setShowUpdateModal(false);
            setError(null);
        } catch (error) {
            console.error("Error updating product", error);
            setError("Failed to update product. Please try again.");
        }
    };

    // Open Variant Modal
    const EditVariant = (variant) => {
        setCurrentVariant(variant);
        setUpdatedVariantColor(variant.color || "");
        setUpdatedVariantSize(variant.size || "");
        setUpdatedVariantCost(variant.cost || "");
        setUpdatedVariantImageUrl(variant.imageUrl || "");
        setShowVariantUpdateModal(true);
    };

    // Save Variant Update
    const handleVariantUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${BackendUrl}/admin/products/variants/${currentVariant._id}`,
                {
                    color: updatedVariantColor,
                    size: updatedVariantSize,
                    cost: updatedVariantCost,
                    imageUrl: updatedVariantImageUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProduct((prev) => ({
                ...prev,
                variant: prev.variant.map((v) =>
                    v._id === currentVariant._id ? res.data.variant || res.data : v
                ),
            }));

            setShowVariantUpdateModal(false);
            setError(null);
        } catch (error) {
            console.error("Error updating variant", error);
            setError("Failed to update variant. Please try again.");
        }
    };

    // Delete Variant
    const DeleteVariant = async (variantId) => {
        if (!window.confirm("Are you sure you want to delete this variant?")) return;
        
        try {
            await axios.delete(`${BackendUrl}/admin/products/${productID}/variants/${variantId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProduct((prev) => ({
                ...prev,
                variant: prev.variant.filter((v) => v._id !== variantId),
            }));
            setError(null);
        } catch (error) {
            console.error("Error in Deleting Variant", error);
            setError("Failed to delete variant. Please try again.");
        }
    };

    const DeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        
        try {
            await axios.delete(`${BackendUrl}/admin/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/dashboard/products-list");
        } catch (error) {
            console.error("Error in Deleting Product:", error);
            setError(error.response?.data?.message || "Failed to delete product. Please try again.");
        }
    };

    // Fetch Product
    useEffect(() => {
        if (!token || !productID) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${BackendUrl}/admin/products/${productID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const productData = res.data.product || res.data;
                setProduct(productData);

                // preload product data for modal
                setUpdatedName(productData.name || "");
                setUpdatedDescription(productData.description || "");
                setUpdatedColor(productData.color || "");
                setUpdatedSize(productData.size || "");
                setUpdatedCost(productData.cost || "");
                setUpdatedImageUrl(productData.imageUrl || "");
            } catch (error) {
                console.error("There is some error in fetching product", error);
                setError("Failed to fetch product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [token, productID]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <h4 className="text-muted">Loading product details...</h4>
                </div>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="text-center py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h2 className="text-muted">Product Not Found</h2>
                <p>The requested product could not be found.</p>
                <Button variant="primary" onClick={() => navigate('/dashboard/products-list')}>
                    Back to Products List
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </Alert>
            )}

            <Row>
                <Col lg={8}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                            <Row className="align-items-center">
                                <Col>
                                    <h3 className="mb-0">
                                        <i className="fas fa-box me-2"></i>
                                        {product.name}
                                    </h3>
                                    <small className="opacity-75">ID: {product._id}</small>
                                </Col>
                                <Col xs="auto">
                                    <ButtonGroup>
                                        <Button 
                                            variant="light" 
                                            size="sm"
                                            onClick={() => navigate('/dashboard/products-list')}
                                        >
                                            <i className="fas fa-arrow-left me-1"></i>
                                            Back
                                        </Button>
                                        <Button 
                                            variant="warning" 
                                            size="sm"
                                            onClick={() => setShowUpdateModal(true)}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => DeleteProduct(product._id)}
                                        >
                                            <i className="fas fa-trash me-1"></i>
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                                <Tab eventKey="details" title={<><i className="fas fa-info-circle me-1"></i> Details</>}>
                                    <Row>
                                        <Col md={6}>
                                            <div className="text-center mb-3">
                                                <Image 
                                                    src={product.imageUrl || '/placeholder-image.jpg'} 
                                                    alt={product.name}
                                                    fluid
                                                    rounded
                                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="product-info">
                                                <h5 className="mb-3">Product Information</h5>
                                                <div className="mb-3">
                                                    <strong>Description:</strong>
                                                    <p className="text-muted mt-1">
                                                        {product.description || "No description available"}
                                                    </p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Price:</strong>
                                                    <span className="text-success fs-4 ms-2">
                                                        ₹{parseFloat(product.cost || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <Row>
                                                    <Col>
                                                        <strong>Color:</strong>
                                                        {product.color ? (
                                                            <Badge bg="info" className="ms-2">{product.color}</Badge>
                                                        ) : (
                                                            <span className="text-muted ms-2">Not specified</span>
                                                        )}
                                                    </Col>
                                                    <Col>
                                                        <strong>Size:</strong>
                                                        {product.size ? (
                                                            <Badge bg="secondary" className="ms-2">{product.size}</Badge>
                                                        ) : (
                                                            <span className="text-muted ms-2">Not specified</span>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab>
                                
                                <Tab eventKey="variants" title={<><i className="fas fa-layer-group me-1"></i> Variants ({product.variant?.length || 0})</>}>
                                    {product.variant && product.variant.length > 0 ? (
                                        <Row>
                                            {product.variant.map((variant, index) => (
                                                <Col md={6} lg={4} className="mb-4" key={variant._id}>
                                                    <Card className="h-100 border-0 shadow-sm">
                                                        <div className="text-center p-3">
                                                            <Image 
                                                                src={variant.imageUrl || product.imageUrl || '/placeholder-image.jpg'}
                                                                alt={`Variant ${index + 1}`}
                                                                style={{ height: '150px', width: '150px', objectFit: 'cover' }}
                                                                rounded
                                                            />
                                                        </div>
                                                        <Card.Body className="pt-0">
                                                            <h6 className="card-title">Variant {index + 1}</h6>
                                                            <div className="mb-2">
                                                                <Badge bg="info" className="me-2">{variant.color}</Badge>
                                                                <Badge bg="secondary">{variant.size}</Badge>
                                                            </div>
                                                            <p className="text-success fw-bold">₹{parseFloat(variant.cost || 0).toFixed(2)}</p>
                                                        </Card.Body>
                                                        <Card.Footer className="bg-transparent border-0 pt-0">
                                                            <ButtonGroup className="w-100">
                                                                <Button 
                                                                    variant="outline-warning" 
                                                                    size="sm"
                                                                    onClick={() => EditVariant(variant)}
                                                                >
                                                                    <i className="fas fa-edit">Edit</i>
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm"
                                                                    onClick={() => DeleteVariant(variant._id)}
                                                                >
                                                                    <i className="fas fa-trash">Delete</i>
                                                                </Button>
                                                            </ButtonGroup>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-layer-group fa-3x text-muted mb-3"></i>
                                            <h5 className="text-muted">No Variants Available</h5>
                                            <p className="text-secondary">This product doesn't have any variants yet.</p>
                                        </div>
                                    )}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Reviews Section */}
                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-star me-2"></i>
                                Customer Reviews
                                <Badge bg="light" text="dark" className="ms-2">
                                    {Array.isArray(product.reviews) ? product.reviews.length : 0}
                                </Badge>
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <Card className="mb-3 border-0 bg-light" key={review._id}>
                                        <Card.Body className="py-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="text-warning">
                                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                </div>
                                                <small className="text-muted">
                                                    Rating: {review.rating}/5
                                                </small>
                                            </div>
                                            <p className="card-text mb-0">{review.text}</p>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                                    <h6 className="text-muted">No Reviews Yet</h6>
                                    <p className="text-secondary small">This product hasn't received any reviews.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Update Product Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <i className="fas fa-edit me-2"></i>
                        Update Product
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Product Name *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={updatedName} 
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Cost *</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={updatedCost} 
                                        onChange={(e) => setUpdatedCost(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={updatedDescription} 
                                onChange={(e) => setUpdatedDescription(e.target.value)} 
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Color</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={updatedColor} 
                                        onChange={(e) => setUpdatedColor(e.target.value)} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Size</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={updatedSize} 
                                        onChange={(e) => setUpdatedSize(e.target.value)} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Image URL</Form.Label>
                            <Form.Control 
                                type="url" 
                                value={updatedImageUrl} 
                                onChange={(e) => setUpdatedImageUrl(e.target.value)} 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className="fas fa-save me-1"></i>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Update Variant Modal */}
            <Modal show={showVariantUpdateModal} onHide={() => setShowVariantUpdateModal(false)} centered>
                <Modal.Header closeButton className="bg-warning">
                    <Modal.Title>
                        <i className="fas fa-edit me-2"></i>
                        Update Variant
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleVariantUpdateSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={updatedVariantColor}
                                        onChange={(e) => setUpdatedVariantColor(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Size</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={updatedVariantSize}
                                        onChange={(e) => setUpdatedVariantSize(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Cost</Form.Label>
                            <Form.Control
                                type="number"
                                value={updatedVariantCost}
                                onChange={(e) => setUpdatedVariantCost(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Image URL</Form.Label>
                            <Form.Control
                                type="url"
                                value={updatedVariantImageUrl}
                                onChange={(e) => setUpdatedVariantImageUrl(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowVariantUpdateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <i className="fas fa-save me-1"></i>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default AdminProductPages;