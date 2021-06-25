import { useContext } from "react";
import {
  tableVar,
  touchContext,
  updateContext,
  componentKind,
  synchronize,
  originPos,
} from "./TableIndex";
import {
  SearchAnimation,
  SearchFinalAnimation,
  MazeAnimation,
  FinalAnimation,
  FinalMazeAnimation,
  stopStatus,
  resetAnimation,
  setAnimation,
  setMazeAnimation,
} from "./Animation";
import {
  sysStatusContext,
  algorithmContext,
  speedContext,
  animationStatusContext,
  position,
} from "../../core";
import { setTable } from "./SetTable";
import { WhichComponentSame } from "./WhichComp";

function ButtonEvent() {
  const [touch, update] = [useContext(touchContext), useContext(updateContext)];
  const [algorithm, sysSpeed, sysStatus, animation] = [
    useContext(algorithmContext),
    useContext(speedContext),
    useContext(sysStatusContext),
    useContext(animationStatusContext),
  ];

  const Start = (
    search = stopStatus.searchResult,
    path = stopStatus.pathResult,
    pathDirection = stopStatus.pathDirectionResult,
    speed = sysSpeed.get[1]
  ) => {
    if (stopStatus.animationStatus) {
      // If the animation is executing, pause and return directly
      stopStatus.animationStatus = false;
      return;
    }

    if (
      sysStatus.get === "IDLE" ||
      (sysStatus.get === "STOP" && algorithm.get !== stopStatus.algorithm)
    ) {
      console.log('setting animation...')
      setAnimation(search, path, pathDirection, algorithm.get);
      // resetAnimation()  // Before executing start, it will call ClearPath()
    }

    if (update.get && synchronize.update) {
      // realtime update of algorithm and shortest path, path is already searched 
      FinalAnimation(search, path, pathDirection);
    } else {
      console.log("Start");
      sysStatus.set("RUNNING");
      stopStatus.animationStatus = true;
      SearchFinalAnimation(
        search,
        path,
        pathDirection,
        speed,
        SearchAnimation,
        () => sysStatus.set("STOP"),
        () => {
          update.set("True");
          synchronize.update = true;
          sysStatus.set("IDLE");
        }
      );
    }
  };

  const ClearPath = (event = true, reset = false) => {
    if (event) {
      update.set("False");
      synchronize.update = false; //  Because the reducer will be out of sync, it needs to be processed in time
    }

    for (var i = 0; i < tableVar.rowSize * tableVar.colSize; i++) {
      if (WhichComponentSame(i) >= 3) {
        setTable(i, componentKind.background);
      } else if (WhichComponentSame(i) === 1) {
        setTable(i, componentKind.end);
      } else if (WhichComponentSame(i) === 0) {
        setTable(i, componentKind.start);
      }
    }

    if (animation.get === "Algorithm" || reset) {
      resetAnimation();
    }
  };

  const ClearWalls = () => {
    const wall = Object.keys(position.wall);
    for (var i = 0; i < wall.length; i++) {
      setTable(wall[i].split(","), componentKind.background, true);
    }

    touch.set("");
  };

  const ClearBoard = () => {
    update.set("False");
    for (var i = 0; i < tableVar.rowSize * tableVar.colSize; i++) {
      setTable(i, componentKind.background, true);
    }
    setTable(
      originPos.origin_start[0] * tableVar.colSize + originPos.origin_start[1],
      componentKind.start,
      true
    );
    setTable(
      originPos.origin_end[0] * tableVar.colSize + originPos.origin_end[1],
      componentKind.end,
      true
    );
    touch.set("");
  };

  return { Start, ClearPath, ClearWalls, ClearBoard };
}

export default ButtonEvent;
