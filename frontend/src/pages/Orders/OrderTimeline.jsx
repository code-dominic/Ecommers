const OrderTimeline = ({ status, createdAt }) => {
  const steps = [
    { key: "placed", label: "Placed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentIndex = steps.findIndex(
    (s) => s.key === status?.toLowerCase()
  );

  // If canceled, show a canceled banner
  if (status?.toLowerCase() === "canceled") {
    return (
      <div className="timeline-canceled text-center py-2 px-3 rounded bg-light">
        <span className="text-danger font-weight-bold">Order Canceled</span>
        <div className="small text-muted">
          Ordered on {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div className="order-timeline mt-2" style={{ width: "100%" }}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ position: "relative" }}
      >
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <div
              key={step.key}
              className="d-flex flex-column align-items-center"
              style={{ flex: 1, position: "relative" }}
            >
              {/* Dot */}
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#28a745" : "#dee2e6",
                  zIndex: 2,
                }}
              />

              {/* Label */}
              <small
                className="mt-2"
                style={{
                  whiteSpace: "nowrap",
                  color: isActive ? "#28a745" : "#6c757d",
                }}
              >
                {step.label}
              </small>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "7px",
                    left: "50%",
                    width: "100%",
                    height: "2px",
                    backgroundColor:
                      index < currentIndex ? "#28a745" : "#dee2e6",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Order date */}
      <div className="small text-muted mt-2 text-center">
        Ordered on {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default OrderTimeline;
