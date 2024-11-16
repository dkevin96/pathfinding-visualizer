import React, { useContext } from "react";
import { NavDropdown, Nav } from "react-bootstrap";
import { algorithmContext, sysStatusContext } from "../../../core/index";
import Colored from "../../headerhelper/Colored";
import { useButtonEvents } from "../../../table/hooks/useButtonEvents";

function DropdownAlgorithm() {
  const algoContext = useContext(algorithmContext);
  const sysStatus = useContext(sysStatusContext);
  const [className, toggleHandler] = Colored();
  const { clearPath } = useButtonEvents();

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
        clearPath(false);
        algoContext.set("Algorithm_Depth_First");
        break;
      case "Algorithm_Breadth_First":
        clearPath(false);
        algoContext.set("Algorithm_Breadth_First");
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
        <NavDropdown.Item eventKey="Algorithm_Dijkstra">Dijkstra's Algorithm</NavDropdown.Item>
        <NavDropdown.Item eventKey="Algorithm_Depth_First">Depth-First Search</NavDropdown.Item>
        <NavDropdown.Item eventKey="Algorithm_Breadth_First">Breadth-First Search</NavDropdown.Item>
      </NavDropdown>
    </Nav.Item>
  );
}

export default DropdownAlgorithm;
