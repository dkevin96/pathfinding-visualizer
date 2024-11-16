import { useContext } from "react";
import { tableVar, componentKind, synchronize, originPos, cellType } from "../constants/tableConstants";
import { touchContext, updateContext } from "../contexts/TableContext";
import { sysStatusContext, algorithmContext, speedContext, animationStatusContext, position } from "../../core";
import { useTable } from "./useTable";
import { usePathFindingAnimation } from "./usePathFindingAnimation";
import { useCell } from "./useCell";

export function useButtonEvents() {
  const touch = useContext(touchContext);
  const update = useContext(updateContext);
  const algorithm = useContext(algorithmContext);
  const sysSpeed = useContext(speedContext);
  const sysStatus = useContext(sysStatusContext);
  const animation = useContext(animationStatusContext);
  const { setTable } = useTable();
  const {
    pathFindingState: stopStatus,
    setPathFindingState,
    resetAnimationState,
    handleSearchAnimation,
    renderStaticState,
  } = usePathFindingAnimation();
  const { getCellType } = useCell();
  const handleStart = (
    search = stopStatus.searchResult,
    path = stopStatus.pathResult,
    pathDirection = stopStatus.pathDirectionResult,
    speed = sysSpeed.get[1],
  ) => {
    if (stopStatus.animationStatus) {
      stopStatus.animationStatus = false;
      return;
    }

    if (sysStatus.get === "IDLE" || (sysStatus.get === "STOP" && algorithm.get !== stopStatus.algorithm)) {
      console.log("setting animation...");
      setPathFindingState(search, path, pathDirection, algorithm.get);
    }

    if (update.get && synchronize.update) {
      renderStaticState(search, path, pathDirection);
    } else {
      sysStatus.set("RUNNING");
      stopStatus.animationStatus = true;

      handleSearchAnimation(
        search,
        path,
        pathDirection,
        speed,
        () => sysStatus.set("STOP"),
        () => {
          update.set("True");
          synchronize.update = true;
          sysStatus.set("IDLE");
        },
      );
    }
  };

  const handleClearPath = (event = true, reset = false) => {
    if (event) {
      update.set("False");
      synchronize.update = false;
    }

    for (let i = 0; i < tableVar.rowSize * tableVar.colSize; i++) {
      if (getCellType(i) >= cellType.BACKGROUND) {
        setTable(i, componentKind.background);
      } else if (getCellType(i) === cellType.END) {
        setTable(i, componentKind.end);
      } else if (getCellType(i) === cellType.START) {
        setTable(i, componentKind.start);
      }
    }

    if (animation.get === "Algorithm" || reset) {
      resetAnimationState();
    }
  };

  const handleClearWalls = () => {
    const wall = Object.keys(position.wall);
    for (let i = 0; i < wall.length; i++) {
      setTable(wall[i].split(","), componentKind.background, true);
    }
    touch.set("");
  };

  const handleClearBoard = () => {
    update.set("False");
    for (let i = 0; i < tableVar.rowSize * tableVar.colSize; i++) {
      setTable(i, componentKind.background, true);
    }
    setTable(originPos.origin_start[0] * tableVar.colSize + originPos.origin_start[1], componentKind.start, true);
    setTable(originPos.origin_end[0] * tableVar.colSize + originPos.origin_end[1], componentKind.end, true);
    touch.set("");
  };

  return {
    start: handleStart,
    clearPath: handleClearPath,
    clearWalls: handleClearWalls,
    clearBoard: handleClearBoard,
  };
}
