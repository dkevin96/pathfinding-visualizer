import { position } from "../components/core/index";
import { Queue } from "../components/core/Queue";
import { Distance } from "../components/core/Distance";
import dist from "javascript-priority-queue";

export function BFS(startCallback, speed) {
  var retSearchPath = [];
  var retShortestPath = [];
  var retDirection = [];

  var searchPath = [];
  const visited = new Set();
  const queue = new Queue();
  var distance = new Distance();
  var startPos = position.start;
  var endPos = position.end;

  distance.set(startPos, 0);
  queue.append([startPos, 0]);
  visited.add(startPos.toString());
  while (queue.getLength() > 0) {
    var node = queue.popleft();
    var x = node[0][0];
    var y = node[0][1];
    var nextD = node[1] + 1;

    if (nextD > searchPath.length) searchPath.push([]);

    if ([x, y].toString() === endPos.toString()) break;

    // left
    if (y - 1 >= 0 && !([x, y - 1] in position.wall) && !visited.has([x, y - 1].toString())) {
      queue.append([[x, y - 1], nextD]);
      searchPath[nextD - 1].push([x, y - 1]);
      distance.set([x, y - 1], nextD);
      visited.add([x, y - 1].toString());
    }

    // up
    if (x - 1 >= 0 && !([x - 1, y] in position.wall) && !visited.has([x - 1, y].toString())) {
      queue.append([[x - 1, y], nextD]);
      searchPath[nextD - 1].push([x - 1, y]);
      distance.set([x - 1, y], nextD);
      visited.add([x - 1, y].toString());
    }

    // right
    if (y + 1 < position.colSize && !([x, y + 1] in position.wall) && !visited.has([x, y + 1].toString())) {
      queue.append([[x, y + 1], nextD]);
      searchPath[nextD - 1].push([x, y + 1]);
      distance.set([x, y + 1], nextD);
      visited.add([x, y + 1].toString());
    }

    // down
    if (x + 1 < position.rowSize && !([x + 1, y] in position.wall) && !visited.has([x + 1, y].toString())) {
      queue.append([[x + 1, y], nextD]);
      searchPath[nextD - 1].push([x + 1, y]);
      distance.set([x + 1, y], nextD);
      visited.add([x + 1, y].toString());
    }
  }

  while (distance.get(endPos) !== -1 && searchPath.length > distance.get(endPos)) {
    searchPath.pop();
  }

  retSearchPath = retSearchPath.concat(searchPath);

  var shortest = distance.getShortestPath(endPos);
  retShortestPath = retShortestPath.concat(shortest[0]);
  retDirection = retDirection.concat(shortest[1]);

  retSearchPath.unshift([position.start]);

  // console.log(retShortestPath);
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}
