import { useCallback, useRef } from "react";
import { componentKind, cellType } from "../constants/tableConstants";
import { useTable } from "./useTable";
import { useCell } from "./useCell";

export const pathFindingStateRef = {
  searchStop: [0, 0],
  search: [0, 0],
  path: 0,
  pathID: [-1, -1],
  searchResult: [],
  pathResult: [],
  pathDirectionResult: [],
  algorithm: "",
  animationStatus: false,
  complete: true,
};

export function usePathFindingAnimation() {
  const { setTable } = useTable();
  const { getCellType, getStartEndpointStyle } = useCell();
  const pathFindingState = useRef(pathFindingStateRef);

  const setPathFindingState = useCallback((search, path, pathDirection, algorithm) => {
    pathFindingState.current.searchResult = search;
    pathFindingState.current.pathResult = path;
    pathFindingState.current.pathDirectionResult = pathDirection;
    pathFindingState.current.algorithm = algorithm;
  }, []);

  const resetAnimationState = useCallback(() => {
    pathFindingState.current.search = [0, 0];
    pathFindingState.current.searchStop = [0, 0];
    pathFindingState.current.path = 0;
    pathFindingState.current.pathID = [-1, -1];
    pathFindingState.current.animationStatus = false;
    pathFindingState.current.complete = true;
  }, []);

  const getDirection = useCallback((kind) => {
    const directionMap = {
      left: componentKind.pathHeadLeft,
      right: componentKind.pathHeadRight,
      up: componentKind.pathHeadUp,
      down: componentKind.pathHeadDown,
    };
    return directionMap[kind] || componentKind.path;
  }, []);

  /**
   * Animates the shortest path with directional indicators
   * Runs after search animation completes
   * @param {Array} path - Array of cell coordinates representing the shortest path
   * @param {number} speed - Animation speed in milliseconds
   * @param {Array} pathDirection - Array of directions ('left', 'right', 'up', 'down')
   * @param {Function} sysStatusFunction - Callback for system status updates
   * @param {Function} updateFunction - Callback to update UI after animation
   */
  const animateShortestPath = useCallback(
    (path, speed, pathDirection, sysStatusFunction, updateFunction) => {
      let [id, newid] = [pathFindingState.current.pathID[0], pathFindingState.current.pathID[1]];
      let count = pathFindingState.current.path;

      const pathAnimation = setInterval(() => {
        if (count === path.length) {
          resetAnimationState();
          updateFunction();
          clearInterval(pathAnimation);
          return;
        }

        if (!pathFindingState.current.animationStatus) {
          pathFindingState.current.path = count;
          pathFindingState.current.pathID = [id, newid];
          sysStatusFunction();
          clearInterval(pathAnimation);
          return;
        }

        if (getCellType(path[count]) > cellType.END) {
          newid = path[count];
          // set shortest path ( yellow) and rocket path
          setTable(id, componentKind.path);
          setTable(newid, getDirection(pathDirection[count]));
          id = newid;
        } else {
          setTable(id, componentKind.path);
          setTable(
            path[count],
            getStartEndpointStyle(getCellType(path[count]), getDirection(pathDirection[count]), getDirection(pathDirection[count])),
          );
        }
        count++;
      }, speed);
    },
    [getDirection, resetAnimationState, setTable],
  );

  /**
   * Animates the algorithm's search process showing explored cells
   * @param {Array<Array>} search - 2D array of coordinates representing search steps
   * @param {Array} path - Array of coordinates for the final path
   * @param {Array} pathDirection - Array of directions for path animation
   * @param {number} speed - Animation speed in milliseconds
   * @param {Function} sysStatusFunction - Callback for system status updates
   * @param {Function} updateFunction - Callback to update UI after animation
   */
  const handleSearchAnimation = useCallback(
    (search, path, pathDirection, speed, sysStatusFunction, updateFunction) => {
      let count = pathFindingState.current.searchStop[0];

      const searchAnimation = setInterval(() => {
        if (count === search.length) {
          pathFindingState.current.searchStop = [search.length, 0];
          animateShortestPath(path, speed, pathDirection, sysStatusFunction, updateFunction);
          clearInterval(searchAnimation);
          return;
        }

        for (let i = (count === pathFindingState.current.searchStop[0]) * pathFindingState.current.searchStop[1]; i < search[count].length; i++) {
          if (!pathFindingState.current.animationStatus) {
            pathFindingState.current.searchStop = [count, i];
            sysStatusFunction();
            clearInterval(searchAnimation);
            return;
          }

          if (getCellType(search[count][i]) > cellType.END) {
            setTable(search[count][i], componentKind.search);
          } else {
            setTable(search[count][i], getStartEndpointStyle(getCellType(search[count][i]), componentKind.startSearch, componentKind.endSearch));
          }
        }
        count++;
      }, speed);
    },
    [animateShortestPath, setTable],
  );

  /**
   * Instantly renders the final state of both search area and path
   * Used for non-animated visualization of results
   * @param {Array<Array>} search - 2D array of all cells explored during search
   * @param {Array} path - Array of cells in the final path
   * @param {Array} pathDirection - Array of directions for path cells
   */
  const renderStaticState = useCallback(
    (search, path, pathDirection) => {
      search.forEach((searchRow) => {
        searchRow.forEach((cell) => {
          if (getCellType(cell) > cellType.END) {
            setTable(cell, componentKind.searchStatic);
          } else {
            setTable(cell, getStartEndpointStyle(getCellType(cell), componentKind.startSearch, componentKind.endSearch));
          }
        });
      });

      path.forEach((pathCell, index) => {
        if (getCellType(pathCell) > cellType.END) {
          setTable(pathCell, componentKind.pathStatic);
        } else {
          setTable(pathCell, getStartEndpointStyle(getCellType(pathCell), getDirection(pathDirection[index]), getDirection(pathDirection[index])));
        }
      });
    },
    [getDirection, setTable],
  );

  return {
    pathFindingState: pathFindingState.current,
    setPathFindingState,
    resetAnimationState,
    handleSearchAnimation,
    renderStaticState,
  };
}
