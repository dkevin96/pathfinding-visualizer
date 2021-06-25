import React, { useState, useContext, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { sysStatusContext } from "../../../core/index";
import { speedContext } from "../../../core/index";
import Colored from "../Colored";

function DropdownSpeed() {
  const [title, setTitle] = useState("Average");
  const sysStatus = useContext(sysStatusContext);
  const speed = useContext(speedContext);
  const [className, toggleHandler] = Colored();


  useEffect(() => {
    setTitle(speed.get[0]);
  }, [speed.get]);

  const DropdownSpeedHandler = (eventKey) => {
    if (sysStatus.get !== "IDLE" && sysStatus.get !== "STOP") {
      return;
    }

    switch (eventKey) {
      case "Fast":
        speed.set("Fast");
        break;
      case "Average":
        speed.set("Average");
        break;
      case "Slow":
        speed.set("Slow");
        break;
      default:
        break;
    }
  };

  return (
    <NavDropdown
      xs={1}
      title={<span className={className}>Speed: {title}</span>}
      id="DropdownSpeed"
      onSelect={DropdownSpeedHandler}
      onMouseEnter={toggleHandler}
      onMouseLeave={toggleHandler}
    >
      <NavDropdown.Item eventKey="Fast">Fast</NavDropdown.Item>
      <NavDropdown.Item eventKey="Average">Average</NavDropdown.Item>
      <NavDropdown.Item eventKey="Slow">Slow</NavDropdown.Item>
    </NavDropdown>
  );
}

export default DropdownSpeed;
