const ReturnTimeline = ({ returnInfo }) => {
  // Use lowercase keys for consistency
  const returnSteps = [
    { key: "requested", label: "Requested" },
    { key: "approved", label: "Approved" },
    { key: "pickedup", label: "Picked Up" },
    { key: "completed", label: "Completed" },
  ];

  // Convert status to lowercase for safe comparison
  const currentIndex = returnSteps.findIndex(
    (s) => s.key === returnInfo?.status?.toLowerCase()
  );

  return (
    <div className="return-timeline mt-2" style={{ width: "100%" }}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ position: "relative" }}
      >
        {returnSteps.map((step, index) => {
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
                  backgroundColor: isActive ? "#dc3545" : "#dee2e6", // red theme
                  zIndex: 2,
                }}
              />

              {/* Label */}
              <small
                className="mt-2"
                style={{
                  whiteSpace: "nowrap",
                  color: isActive ? "#dc3545" : "#6c757d",
                }}
              >
                {step.label}
              </small>

              {/* Connector Line */}
              {index < returnSteps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "7px",
                    left: "50%",
                    width: "100%",
                    height: "2px",
                    backgroundColor:
                      index < currentIndex ? "#dc3545" : "#dee2e6",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Return info */}
      <div className="small text-muted mt-2 text-center">
        Status: {returnInfo?.status} <br />
        Date:{" "}
        {returnInfo?.processedAt
          ? new Date(returnInfo.processedAt).toLocaleDateString()
          : new Date(returnInfo.requestedAt).toLocaleDateString()}
      </div>

      {returnInfo?.reason && (
        <div className="small text-muted text-center">
          Reason: {returnInfo.reason}
        </div>
      )}
    </div>
  );
};

export default ReturnTimeline;
