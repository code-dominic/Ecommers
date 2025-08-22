import { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function VariantToggle({ label, options, value, setValue }) {
  return (
    <div className="mb-3">
      <h6>{label}</h6>
      <ToggleButtonGroup
        type="radio"
        name={label}
        value={value}
        onChange={setValue}
      >
        {options.map((option, index) => (
          <ToggleButton key={index} id={`${label}-${index}`} value={option}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

export default VariantToggle;
