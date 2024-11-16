import React, { useState, useEffect, useContext } from "react";
import Nav from "react-bootstrap/Nav";

import { algorithmContext, sysStatusContext, speedContext, animationStatusContext } from "../../core/index";
import { usePathFindingAnimation } from "../../table/hooks/usePathFindingAnimation";
import { useButtonEvents } from "../../table/hooks/useButtonEvents";
import Dijkstra from "../../../algorithms/Dijkstra";
import DFS from "../../../algorithms/DFS";
import BFS from "../../../algorithms/BFS";

const NavButton = () => {
  const [buttonName, setButtonName] = useState("Visualize !");
  const [myVariant, setMyVariant] = useState("");
  const algoContext = useContext(algorithmContext);
  const sysStatus = useContext(sysStatusContext);
  const animationStatus = useContext(animationStatusContext);
  const speed = useContext(speedContext);
  const { clearPath, start: startPath } = useButtonEvents();
  const { pathFindingState: stopStatus } = usePathFindingAnimation();

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
        case "Algorithm_Depth_First":
          name = "DFS";
          break;
        case "Algorithm_Breadth_First":
          name = "BFS";
          break;
        default:
          name = "";
          break;
      }
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

  // use to call clearpath when change algorithment
  const callback = (func1, func2) => {
    func1();
    func2();
  };

  const handler = () => {
    //Change system state
    if (sysStatus.get === "RUNNING") {
      startPath(); // Pause status changes within this function
      return;
    } else if (sysStatus.get === "STOP") {
      if (algoContext.get === stopStatus.algorithm) {
        startPath();
        return;
      }
    }

    if (algoContext.get === "") {
      setButtonName("Pick an Algorithm");
    } else {
      callback(
        () => clearPath(),
        () => {
          switch (algoContext.get) {
            case "Algorithm_Dijkstra":
              Dijkstra(startPath, speed.get[1]);
              break;
            case "Algorithm_Depth_First":
              DFS(startPath, speed.get[1]);
              break;
            case "Algorithm_Breadth_First":
              console.log("Staring Bfs");
              BFS(startPath, speed.get[1]);
              break;
            default:
              break;
          }
        },
      );
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
