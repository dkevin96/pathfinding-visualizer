import React, { useContext } from "react";
import { NavDropdown, Nav } from "react-bootstrap";
import { algorithmContext, sysStatusContext } from "../../../core/index";
import Colored from "../../headerhelper/Colored";
import ButtonEvent from "../../../table/tablehelper/ButtonEvent";

function DropdownAlgorithm() {
  const algoContext = useContext(algorithmContext);
  const sysStatus = useContext(sysStatusContext);
  const [className, toggleHandler] = Colored();
  const buttonEvent = ButtonEvent();

  const DropdownAlgorithmHandler = (eventKey) => {
    if (sysStatus.get !== "IDLE" && sysStatus.get !== "STOP") {
      // isrunning
      return;
    }
    switch (eventKey) {
      case "Algorithm_Dijkstra":
        algoContext.set("Algorithm_Dijkstra");
        break;
      case "Algorithm_Depth_First":
        buttonEvent.ClearPath(false);
        algoContext.set("Algorithm_Depth_First");
        break;

      default:
        break;
    }
  };

  return (
    <Nav.Item>
      <NavDropdown
        xs={1}
        title={<span className={className}>Algorithms</span>}
        id="DropdownAlgorithm"
        onSelect={(eventKey) => DropdownAlgorithmHandler(eventKey)}
        onMouseEnter={toggleHandler}
        onMouseLeave={toggleHandler}
      >
        <NavDropdown.Item eventKey="Algorithm_Dijkstra">
          Dijkstra's Algorithm
        </NavDropdown.Item>
        <NavDropdown.Item eventKey="Algorithm_Depth_First">
          Depth-First Search
        </NavDropdown.Item>
      </NavDropdown>
    </Nav.Item>
  );
}

export default DropdownAlgorithm;
