import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import DropdownAlgorithm from "./elements/DropdownAlgorithm";
import NavButton from "./elements/NavButton";
import DropdownSpeed from "./elements/DropdownSpeed";
import Info from "./elements/Info";
import AlgorithmDescriptor from "./elements/AlgorithmDescriptor";
import { useButtonEvents } from "../table/hooks/useButtonEvents";
import NavLink from "./elements/NavLink";

function PC() {
  const { clearPath, clearWalls, clearBoard } = useButtonEvents();
  return (
    <>
      <Navbar collapseOnSelect expand="md" className="navbar">
        <Navbar.Toggle aria-controls="Collapse" />
        <Navbar.Collapse id="Collapse" className="nvbar-collapse">
          <Nav className="nav-bar">
            <DropdownAlgorithm />
            <NavButton />
            <NavLink names={"Reset Board"} handlers={clearBoard} />
            <NavLink names={"Clear Walls"} handlers={clearWalls} />
            <NavLink names={"Clear Path"} handlers={clearPath} />
            <DropdownSpeed />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Info />
      <AlgorithmDescriptor />
    </>
  );
}

export default PC;
