import React, { useState, useEffect, useContext } from "react";
import Nav from "react-bootstrap/Nav";

import {
  algorithmContext,
  sysStatusContext,
  speedContext,
  animationStatusContext,
} from "../../../core/index";
import ButtonEvent from "../../../table/tablehelper/ButtonEvent";
import { stopStatus } from "../../../table/tablehelper/Animation";
import Dijkstra from "../../../../algorithms/Dijkstra";

const NavButton = () => {
  const [buttonName, setButtonName] = useState("Visualize !");
  const [myVariant, setMyVariant] = useState("");
  const algoContext = useContext(algorithmContext);
  const sysStatus = useContext(sysStatusContext);
  const animationStatus = useContext(animationStatusContext);
  const speed = useContext(speedContext);
  const animation = useContext(animationStatusContext);
  const buttonEvent = ButtonEvent();

  useEffect(() => {
    setMyVariant("buttonEnable");
  }, []);

  // Change text in button according to algorithm
  useEffect(() => {
    if (animationStatus.get === "Algorithm") {
      var name = "";
      switch (algoContext.get) {
        case "Algorithm_Dijkstra":
          name = "Dijkstra's";
          break;
        default:
          name = "";
          break;
      }
    } else if (animationStatus.get === "Maze") {
      name = "Maze";
    }
    setButtonName(`Visualize ${name}!`);
  }, [algoContext.get, animationStatus.get]);

  useEffect(() => {
    if (sysStatus.get === "RUNNING") {
      setMyVariant("buttonDisable");
    } else {
      setMyVariant("buttonEnable");
    }
  }, [sysStatus.get]);

  const handler = () => {
    //Change system state
    if (sysStatus.get === "RUNNING") {
      buttonEvent.Start(); // Pause status changes within this function
      return;
    } else if (sysStatus.get === "STOP") {
      if (algoContext.get === stopStatus.algorithm) {
        buttonEvent.Start();
        return;
      }
    }

    if (algoContext.get === "") {
      setButtonName("Pick an Algorithm");
    } else {
      switch (algoContext.get) {
        case "Algorithm_Dijkstra":
          Dijkstra("Dijkstra", buttonEvent.Start, speed.get[1]);
          break;
        default:
          break;
      }
    }
  };

  return (
    <Nav.Item>
      <button className={myVariant} onClick={handler}>
        {buttonName}
      </button>
    </Nav.Item>
  );
};

export default NavButton;
