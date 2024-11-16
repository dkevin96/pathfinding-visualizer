import { createContext } from "react";
import { componentKind } from "../constants/tableConstants";

/**
 * Context to track what's underneath start/end nodes during drag operations
 *
 * @typedef {Object} TouchState
 * @property {string} start - Component type underneath the start node (e.g., 'wall', 'background')
 * @property {string} end - Component type underneath the end node (e.g., 'wall', 'background')
 *
 * @typedef {Object} TouchAction
 * @property {string} componentKind - Which node is being moved ('start' or 'end')
 * @property {string} under - What component is underneath at the new position
 *
 * Usage:
 * - When dragging start/end nodes, we need to remember what type of cell was underneath
 * - This allows us to restore the correct cell type when the node is moved away
 * - Example: If you drag start node over a wall, we store 'wall' as the underlying component
 *
 * @see useMouseEvents hook for implementation (handleMouseEnter method)
 */
export const touchContext = createContext();
export const touchInitial = {
  start: componentKind.background,
  end: componentKind.background,
};
export const touchReducer = (state, action) => {
  switch (action.componentKind) {
    case componentKind.start:
      return { ...state, start: action.under };
    case componentKind.end:
      return { ...state, end: action.under };
    default:
      return touchInitial;
  }
};

// Record which component the mouse is currently catching
export const moveContext = createContext();
export const moveInitial = "";
export const moveReducer = (state, action) => {
  switch (action) {
    case componentKind.start:
      return action;
    case componentKind.end:
      return action;
    case componentKind.wall:
      return action;
    default:
      return moveInitial;
  }
};

// Determine whether to directly display the results of the algorithm
export const updateContext = createContext();
export const updateInitial = false;
export const updateReducer = (state, action) => {
  switch (action) {
    case "True":
      return true;
    case "False":
      return false;
    default:
      return updateInitial;
  }
};
