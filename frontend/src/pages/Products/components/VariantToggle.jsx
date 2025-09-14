import { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function VariantToggle({ label, options, value, setValue }) {
  const [hoveredOption, setHoveredOption] = useState(null);

  // Color mapping for different variant types
  const getVariantStyle = (option, isSelected, isHovered) => {
    const baseStyle = {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isSelected
        ? "translateY(-2px)"
        : isHovered
        ? "translateY(-1px)"
        : "translateY(0)",
      boxShadow: isSelected
        ? "0 6px 15px rgba(0, 123, 255, 0.3), 0 0 0 2px rgba(0, 123, 255, 0.1)"
        : isHovered
        ? "0 3px 8px rgba(0, 0, 0, 0.1)"
        : "0 1px 4px rgba(0, 0, 0, 0.05)",
    };

    // Special handling for color variants
    if (label.toLowerCase() === "color") {
      const colorMap = {
        red: "#dc3545",
        blue: "#007bff",
        green: "#28a745",
        yellow: "#ffc107",
        purple: "#6f42c1",
        pink: "#e83e8c",
        orange: "#fd7e14",
        black: "#343a40",
        white: "#ffffff",
        gray: "#6c757d",
        grey: "#6c757d",
        brown: "#795548",
        navy: "#001f3f",
        teal: "#20c997",
      };

      const colorValue = colorMap[option.toLowerCase()];
      if (colorValue) {
        return {
          ...baseStyle,
          background: isSelected
            ? `linear-gradient(135deg, ${colorValue} 0%, ${colorValue}dd 100%)`
            : colorValue,
          border: isSelected
            ? `2px solid ${colorValue}`
            : `1px solid ${colorValue}99`,
          color: ["white", "yellow"].includes(option.toLowerCase())
            ? "#333"
            : "white",
        };
      }
    }

    // Default styling for size and other variants
    return {
      ...baseStyle,
      background: isSelected
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : isHovered
        ? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      border: isSelected ? "2px solid #667eea" : "1px solid #e9ecef",
      color: isSelected ? "white" : "#495057",
    };
  };

  const renderVariantOption = (option, index) => {
    const isSelected = value === option;
    const isHovered = hoveredOption === option;

    // For color variants
    if (label.toLowerCase() === "color") {
      return (
        <ToggleButton
          key={index}
          id={`${label}-${index}`}
          value={option}
          className="variant-option color-variant"
          style={getVariantStyle(option, isSelected, isHovered)}
          onMouseEnter={() => setHoveredOption(option)}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className="color-option-content">
            <div className="color-preview" />
            <span className="option-text">{option}</span>
          </div>
          {isSelected && <div className="selected-indicator">✓</div>}
        </ToggleButton>
      );
    }

    // For size and other variants
    return (
      <ToggleButton
        key={index}
        id={`${label}-${index}`}
        value={option}
        className="variant-option size-variant"
        style={getVariantStyle(option, isSelected, isHovered)}
        onMouseEnter={() => setHoveredOption(option)}
        onMouseLeave={() => setHoveredOption(null)}
      >
        <div className="size-option-content">
          <span className="option-text">{option}</span>
          {isSelected && <div className="selected-indicator">✓</div>}
        </div>
      </ToggleButton>
    );
  };

  return (
    <div className="variant-toggle-container">
      <div className="variant-label-container">
        <h6 className="variant-label">
          {label}
          <span className="variant-count">({options.length} options)</span>
        </h6>
        <div className="selected-value">
          Selected:{" "}
          <span className="selected-highlight">{value || "None"}</span>
        </div>
      </div>

      <ToggleButtonGroup
        type="radio"
        name={label}
        value={value}
        onChange={setValue}
        className="custom-toggle-group"
      >
        {options.map((option, index) => renderVariantOption(option, index))}
      </ToggleButtonGroup>

      <style jsx>{`
        .variant-toggle-container {
          margin-bottom: 1rem;
          padding: 15px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .variant-label-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .variant-label {
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .variant-count {
          font-size: 0.75rem;
          font-weight: 400;
          color: #6c757d;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .selected-value {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .selected-highlight {
          font-weight: 600;
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          padding: 2px 6px;
          border-radius: 5px;
        }

        .custom-toggle-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
        }

        .variant-option {
          position: relative;
          border-radius: 8px !important;
          padding: 0 !important;
          min-width: 55px;
          min-height: 35px;
          border: none !important;
          font-weight: 500;
          font-size: 0.75rem;
          overflow: hidden;
          cursor: pointer;
        }

        .color-variant {
          min-width: 65px;
          min-height: 40px;
        }

        .size-variant {
          min-width: 45px;
          min-height: 35px;
        }

        .color-option-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 6px;
          gap: 4px;
        }

        .size-option-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 8px 12px;
          position: relative;
        }

        .color-preview {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: currentColor;
          opacity: 0.9;
        }

        .option-text {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .selected-indicator {
          position: absolute;
          top: 3px;
          right: 3px;
          background: rgba(255, 255, 255, 0.9);
          color: #28a745;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
        }

        /* Responsive */
        @media (max-width: 576px) {
          .variant-label-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .custom-toggle-group {
            justify-content: center;
          }

          .variant-option {
            min-width: 40px;
            min-height: 28px;
          }

          .color-variant {
            min-width: 50px;
            min-height: 32px;
          }
            
         
        }
           /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .variant-toggle-container {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            border-color: #4a5568;
          }

          .variant-label {
            color: #e2e8f0;
          }

          .variant-count {
            background: #4a5568;
            color: #a0aec0;
          }

          .selected-value {
            color: #a0aec0;
          }

          .selected-highlight {
            color: #90cdf4;
            background: rgba(144, 205, 244, 0.2);
          }
      `}</style>
    </div>
  );
}

export default VariantToggle;




