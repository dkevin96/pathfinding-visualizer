import { useContext, useEffect } from "react";
import { sysStatusContext, algorithmContext, speedContext, animationStatusContext } from "components/core";
import { tableVar, componentKind, synchronize } from "../constants/tableConstants";
import { touchContext, moveContext, updateContext } from "../contexts/TableContext";
import { useTable } from "./useTable";  
import { useCell } from "./useCell";
import { useButtonEvents } from "./useButtonEvents";

// Renamed to follow the 'use' prefix convention
function useMouseEvents() {
  const [touch, move, update, animation] = [
    useContext(touchContext),
    useContext(moveContext),
    useContext(updateContext),
    useContext(animationStatusContext),
  ];
  const [algorithm, speed, sysStatus] = [useContext(algorithmContext), useContext(speedContext), useContext(sysStatusContext)];

  const { start, clearPath } = useButtonEvents();
  const { updateTable, setTable } = useTable();
  const { getCellInfo } = useCell();

  useEffect(() => {
    // Because the first time addEventListener algorithm.get sysStatus.get will be blank
    synchronize.algorithm = algorithm;
    synchronize.sysStatus = sysStatus;
  }, [algorithm, sysStatus]);

  const checkStopStatus = () => {
    if (sysStatus.get === "STOP") {
      clearPath();
    }
    sysStatus.set("IDLE");
  };

  const handleMouseDown = (e) => {
    if ((sysStatus.get !== "IDLE" && sysStatus.get !== "STOP") || componentKind.add === false || sysStatus.get === "RUNNING") {
      return;
    }

    e.preventDefault();

    tableVar.id = parseInt(e.target.id);
    const cellInfo = getCellInfo(tableVar.id, touch);

    if (cellInfo.type) {
      // If the wall is added, it must be added immediately
      checkStopStatus();
      setTable(tableVar.id, cellInfo.rKind, true);
      move.set(componentKind.add);
    } else {
      // Move start and end node
      move.set(cellInfo.kind);
    }
  };

  const handleMouseUp = (e) => {
    if ((sysStatus.get !== "IDLE" && sysStatus.get !== "STOP") || componentKind.add === false) {
      return;
    }

    move.set("");
  };

  /**
   * Handles mouse enter events for grid cells during drag operations
   *
   * This function manages two main interactions:
   * 1. Wall Drawing: When dragging to create walls
   * 2. Node Movement: When dragging start/end nodes
   *
   * State Management:
   * - Uses moveContext to track what's being dragged (wall, start, or end)
   * - Uses touchContext to remember what's underneath start/end nodes
   * - Updates table cell classes and positions
   *
   * @param {MouseEvent} e - Mouse enter event object
   */
  const handleMouseEnter = (e) => {
    if ((sysStatus.get !== "IDLE" && sysStatus.get !== "STOP") || componentKind.add === false || sysStatus.get === "RUNNING") {
      return;
    }

    if (e.buttons === 0) {
      move.set("");
      touch.set({
        componentKind: "",
        under: "",
      });
      return;
    }

    tableVar.newId = parseInt(e.target.id);
    const oldCellInfo = getCellInfo(tableVar.id, touch);
    const newCellInfo = getCellInfo(tableVar.newId, touch);

    if (move.get === componentKind.add && newCellInfo.type) {
      // Drawing Walls
      setTable(tableVar.newId, newCellInfo.rKind, true);
      tableVar.id = parseInt(tableVar.newId);
      checkStopStatus();
    } else if (move.get !== componentKind.add && move.get !== "" && newCellInfo.type) {
      // Moving Start/End Nodes
      // Step 1: Clear the old position (restore what was underneath)
      setTable(tableVar.id, oldCellInfo.touch, true);

      touch.set({
        componentKind: oldCellInfo.kind, // what we're moving (start/end)
        under: newCellInfo.kind, // what's at the new position
      });

      setTable(tableVar.newId, oldCellInfo.kind, true);
      tableVar.id = parseInt(tableVar.newId);
      checkStopStatus();

      if (update.get && move.get !== "") {
        updateTable(start, clearPath, algorithm, speed);
      }
    }
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
  };
}

export default useMouseEvents;
