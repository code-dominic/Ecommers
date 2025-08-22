import { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function ColorToggleButtons({ colorVariants, currColor, setCurrColor }) {
  // Use single selection (radio) instead of multiple checkboxes
  return (
    <ToggleButtonGroup
      type="radio"
      name="colors"
      value={currColor}
      onChange={(val) => setCurrColor(val)}
      className="mb-3"
    >
      {colorVariants.map((colorV, index) => (
        <ToggleButton
          key={index}
          id={`color-${index}`}
          value={colorV}
          variant={currColor === colorV ? "primary" : "outline-primary"}
        >
          {colorV}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default ColorToggleButtons;
