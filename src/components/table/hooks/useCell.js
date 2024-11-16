import { tableVar, componentKind, cellType } from "../constants/tableConstants";
import { position } from "components/core";

export function useCell() {
  /**
   * Determines the type and properties of a cell in grid
   *
   * @param {(number|Array)} id - Either a cell ID number or coordinate array [row, col]
   * @param {Object} touch - Context object tracking what's underneath movable nodes
   *
   * @returns {Object} Cell information:
   *   @property {string} kind - Type of the cell (start, end, wall, or background)
   *   @property {string} [touch] - For start/end nodes: what's underneath them
   *   @property {string} [rKind] - For walls/background: what they'll become (returned kind)
   *   @property {number} type - 0 for special nodes (start/end), 1 for regular cells (walls/background)
   *
   * A cell can be a start or end node, a wall, or a background cell.
   */
  const getCellInfo = (id, touch) => {
    let pos = id;

    if (typeof id === "number") {
      pos = [Math.floor(parseInt(id) / tableVar.colSize), parseInt(id) % tableVar.colSize];
    }

    if (position.start[0] === pos[0] && position.start[1] === pos[1]) {
      return { kind: componentKind.start, touch: touch?.get?.start, type: 0 };
    } else if (position.end[0] === pos[0] && position.end[1] === pos[1]) {
      return { kind: componentKind.end, touch: touch?.get?.end, type: 0 };
    } else if (position.wall[pos]) {
      return {
        kind: componentKind.wall,
        rKind: componentKind.add,
        type: 1,
      };
    } else {
      return {
        kind: componentKind.background,
        rKind: componentKind.add,
        type: 1,
      };
    }
  };

  const getCellType = (id) => {
    var pos = id;

    if (typeof id === "string" || typeof id === "number") {
      pos = [Math.floor(parseInt(id) / tableVar.colSize), parseInt(id) % tableVar.colSize];
    }

    if (position.start[0] === pos[0] && position.start[1] === pos[1]) {
      return cellType.START;
    } else if (position.end[0] === pos[0] && position.end[1] === pos[1]) {
      return cellType.END;
    } else if (position.wall[pos]) {
      return cellType.WALL;
    } else {
      return cellType.BACKGROUND;
    }
  };

  const getStartEndpointStyle = (type, start, end) => {
    switch (type) {
      case cellType.START:
        return start;
      case cellType.END:
        return end;
      default:
        return null;
    }
  };

  return {
    getCellInfo,
    getCellType,
    getStartEndpointStyle,
  };
}
