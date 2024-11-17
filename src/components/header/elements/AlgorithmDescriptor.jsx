import { useState, useContext, useEffect } from "react";
import { algorithmContext, animationStatusContext } from "components/core";

function AlgorithmDescriptor() {
  const [algorithmName, setAlgorithmName] = useState("Pick algorithm and visualize!");
  const [discription1, setDiscription1] = useState("");
  const [discription2, setDiscription2] = useState("");
  const algoContext = useContext(algorithmContext);
  const animationContext = useContext(animationStatusContext);

  useEffect(() => {
    var algoName = "";
    var d1 = "";
    var d2 = "";
    switch (algoContext.get) {
      case "Algorithm_Dijkstra":
        algoName = "Dijkstra's Algorithm";
        d1 = "weighted";
        d2 = "guarantees";
        break;
      case "Algorithm_Breadth_First":
        algoName = "Breath-first Search";
        d1 = "unweighted";
        d2 = "guarantee";
        break;
      case "Algorithm_Depth_First":
        algoName = "Depth-first Search";
        d1 = "unweighted";
        d2 = "does not guarantee";
        break;
      default:
        algoName = "Pick algorithm and visualize!";
        d1 = "";
        d2 = "";
        break;
    }

    setAlgorithmName(algoName);
    setDiscription1(d1);
    setDiscription2(d2);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoContext.get]);

  if (algoContext.get === "" && animationContext.get === "Algorithm") {
    return <div id="algorithmDescriptor">{algorithmName}</div>;
  } else {
    return (
      <div id="algorithmDescriptor">
        <b>{algorithmName}</b> is <i>{discription1}</i> and <i>{discription2}</i> the shortest path!
      </div>
    );
  }
}

export default AlgorithmDescriptor;
