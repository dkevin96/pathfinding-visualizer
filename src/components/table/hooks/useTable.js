import { useCallback } from "react";
import { componentKind, tableVar } from "../constants/tableConstants";
import { position } from "components/core";
import Dijkstra from "algorithms/Dijkstra";
import DFS from "algorithms/DFS";
import BFS from "algorithms/BFS";

export function useTable() {
  /**
   * Updates the visual and logical state of a cell in the pathfinding grid
   * @param {number|array} index - Either a cell ID number or [row, col] coordinates
   * @param {string} kind - The type of cell (wall, start, end, etc.) from componentKind
   * @param {boolean} setPosition - Whether to update the position tracking object
   *
   * This function:
   * 1. Converts array coordinates to a single index if needed
   * 2. Updates the cell's CSS class to change its visual appearance
   * 3. If setPosition is true, updates the position tracking object:
   *    - Removes existing wall entries if needed
   *    - Records walls, start, or end positions in the position object
   */
  const setTable = useCallback((index, kind, setPosition = false) => {
    if (typeof index !== "number") {
      // Convert [row, col] to ID
      index = parseInt(index[0]) * tableVar.colSize + parseInt(index[1]);
    }

    if (index < 0) {
      return;
    }
    document.getElementById(index.toString()).className = kind;

    if (setPosition) {
      const pos = [Math.floor(index / tableVar.colSize), index % tableVar.colSize];
      // Cleanup before setting again
      if (position.wall[pos]) {
        delete position.wall[pos];
      }

      if (kind === componentKind.wall) {
        position.wall[pos] = true;
      } else if (kind === componentKind.start) {
        position.start = pos;
      } else if (kind === componentKind.end) {
        position.end = pos;
      }
    }
  }, []);

  /**
   * Updates the pathfinding visualization when start/end nodes are moved
   * @param {Function} Start - Function to initiate the pathfinding algorithm
   * @param {Function} ClearPath - Function to clear the previous path visualization
   * @param {Object} algorithm - Context object containing the selected algorithm type
   * @param {Object} speed - Context object containing animation speed settings
   *
   * This function:
   * 1. Clears the previous path visualization
   * 2. Runs the selected pathfinding algorithm (Dijkstra, DFS, or BFS)
   * 3. Is called during drag operations of start/end nodes to provide real-time
   *    path updates as nodes are moved
   */
  const updateTable = useCallback((Start, ClearPath, algorithm, speed) => {
    ClearPath(false);
    switch (algorithm.get) {
      case "Algorithm_Dijkstra":
        Dijkstra(Start, speed.get[1]);
        break;
      case "Algorithm_Depth_First":
        DFS(Start, speed.get[1]);
        break;
      case "Algorithm_Breadth_First":
        console.log("Staring Bfs");
        BFS(Start, speed.get[1]);
        break;
      default:
        break;
    }
  }, []);

  return { setTable, updateTable };
}
