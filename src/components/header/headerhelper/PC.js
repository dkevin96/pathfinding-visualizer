import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import DropdownAlgorithm from "./elements/DropdownAlgorithm";
import NavButton from "./elements/NavButton";
import DropdownSpeed from "./elements/DropdownSpeed";
import Info from "./elements/Info";

import ButtonEvent from "../../table/tablehelper/ButtonEvent";
import Colored from "./Colored";
import { sysStatusContext } from "../../core/index";
import NavLink from "./elements/NavLink";

function PC() {
  const buttonEvent = ButtonEvent();
  const sysStatus = useContext(sysStatusContext);
  const [className, toggleHandler] = Colored();

  return (
    <>
      <Navbar collapseOnSelect expand="md" className="navbar">
        <Navbar.Toggle aria-controls="Collapse" />
        <Navbar.Collapse id="Collapse" className="nvbar-collapse">
          <Nav className="nav-bar">
            <DropdownAlgorithm />
            <NavButton />
            <NavLink names={"Clear Board"} handlers={buttonEvent.ClearBoard} />
            <NavLink names={"Clear Walls"} handlers={buttonEvent.ClearWalls} />
            <NavLink names={"Clear Path"} handlers={buttonEvent.ClearPath} />
            <DropdownSpeed />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Info />
    </>
  );
}

export default PC;
