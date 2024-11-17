/**
 * Depth-First Search (DFS) Pathfinding Algorithm Implementation
 *
 * ALGORITHM OVERVIEW:
 * DFS explores as far as possible along each branch before backtracking.
 *
 * INITIALIZE:
 * 1. Create empty arrays for searchPath, shortestPath, and direction
 * 2. Create empty visited set
 *
 * MAIN ALGORITHM (DoDFS):
 * 1. Base cases:
 *    - Return false if position is:
 *      * Out of bounds
 *      * Wall
 *      * Already visited
 * 2. Add current position to visited set and searchPath
 * 3. If current position is end position:
 *    - Add to shortestPath
 *    - Return true
 * 4. Recursively explore in order: UP, RIGHT, DOWN, LEFT
 *    For each direction:
 *    - If recursive call returns true:
 *      * Add current position to shortestPath
 *      * Add direction to retDirection
 *      * Return true
 *
 * DIRECTION PRIORITY:
 * Explores in fixed order: UP → RIGHT → DOWN → LEFT
 * This creates a preference for paths that go up and right when possible
 */

import { position } from "../components/core/index";

function DFS(startCallback, speed) {
  var retSearchPath = [];
  var retShortestPath = [];
  var retDirection = [];

  function DoDFS(x, y, endPos, visited, retSearchPath, retShortestPath, retDirection) {
    if (x < 0 || y < 0 || x >= position.rowSize || y >= position.colSize || [x, y] in position.wall || visited.has([x, y].toString())) {
      return false;
    }

    visited.add([x, y].toString());
    retSearchPath.push([[x, y]]);

    if ([x, y].toString() === endPos.toString()) {
      retShortestPath.unshift([x, y]);
      return true;
    }

    // direction up right down left
    // up all the way, then right all the way, then down all the way, then left 1 turn, then up all the way,...
    if (DoDFS(x - 1, y, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      retShortestPath.unshift([x, y]);
      retDirection.unshift("up");
      return true;
    }
    if (DoDFS(x, y + 1, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      retShortestPath.unshift([x, y]);
      retDirection.unshift("right");
      return true;
    }
    if (DoDFS(x + 1, y, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      retShortestPath.unshift([x, y]);
      retDirection.unshift("down");
      return true;
    }
    if (DoDFS(x, y - 1, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      retShortestPath.unshift([x, y]);
      retDirection.unshift("left");
      return true;
    }
  }

  const visited = new Set();
  var start = position.start;

  console.log("Start DFS algorithm");
  DoDFS(start[0], start[1], position.end, visited, retSearchPath, retShortestPath, retDirection);

  // When bottom up, the tail is not sure of the direction, so now add the direction
  retDirection.unshift(retDirection);
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}

export default DFS;
