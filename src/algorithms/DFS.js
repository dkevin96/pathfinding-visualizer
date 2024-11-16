import { position } from "../components/core/index";

function DFS(startCallback, speed) {
  var retSearchPath = [];
  var retShortestPath = [];
  var retDirection = [];

  // dfs go from bottom-up to find the shortest path
  // [x,y] = [position.start[0],position.start[0]]
  function DoDFS(x, y, endPos, visited, retSearchPath, retShortestPath, retDirection) {
    if (x < 0 || y < 0 || x >= position.rowSize || y >= position.colSize || [x, y] in position.wall || visited.has([x, y].toString())) {
      return false;
    }

    visited.add([x, y].toString());
    retSearchPath.push([[x, y]]); // Each layer is one

    if ([x, y].toString() === endPos.toString()) {
      retShortestPath.unshift([x, y]);
      return true;
    }

    // direction up right down left
    // up all the way, then right all the way, then down all the way, then left 1 turn, then up all the way,...
    if (DoDFS(x - 1, y, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      // up
      retShortestPath.unshift([x, y]);
      retDirection.unshift("up");
      return true;
    }
    if (DoDFS(x, y + 1, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      // right
      retShortestPath.unshift([x, y]);
      retDirection.unshift("right");
      return true;
    }
    if (DoDFS(x + 1, y, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      // down
      retShortestPath.unshift([x, y]);
      retDirection.unshift("down");
      return true;
    }
    if (DoDFS(x, y - 1, endPos, visited, retSearchPath, retShortestPath, retDirection)) {
      // left
      retShortestPath.unshift([x, y]);
      retDirection.unshift("left");
      return true;
    }
  }

  // do algorithment
  const visited = new Set();
  var start = position.start;

  console.log("DFS");
  DoDFS(start[0], start[1], position.end, visited, retSearchPath, retShortestPath, retDirection);

  // When bottom up, the tail is not sure of the direction, so now add the direction
  retDirection.unshift(retDirection[0]); //  Change the direction to find the method, move forward one square
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}

export default DFS;
