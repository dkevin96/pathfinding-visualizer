import { position } from "../components/core/index";
import { Queue } from "./Queue";
import { Distance } from "../components/core/Distance";

/**
 * Breadth-First Search (BFS) Pathfinding Algorithm Implementation
 *
 * ALGORITHM OVERVIEW:
 * BFS explores nodes in "levels" or "waves" based on their distance from the start position.
 * - Level 0: Contains only the start cell
 * - Level 1: All cells ONE step away (adjacent to start)
 * - Level 2: All cells TWO steps away
 * And so on...
 *
 * NODE STRUCTURE:
 * Each node in the queue is represented as: [[x, y], level]
 * - [x, y]: Coordinates of the cell in the grid
 * - level: Distance from the start position
 * Example: [[2, 3], 1] represents:
 * - Position: [2, 3] (x=2, y=3)
 * - Level: 1 step away from start
 *
 * GRID VS BINARY TREE BFS:
 * Unlike binary tree BFS which only has left/right children:
 * - Each cell can expand in 4 directions (up, down, left, right)
 * - Levels are based on distance from start, not parent-child relationships
 * - Multiple cells in the same level can be adjacent to each other
 *
 * ANIMATION OPTIMIZATION:
 * The algorithm organizes retSearchPath as an array of arrays, where:
 * - Each sub-array represents one level (distance from start)
 * - All nodes at the same distance are grouped together
 *
 * Example structure:
 * retSearchPath = [
 *   [[startX, startY]],              // Level 0: start position
 *   [[x1, y1], [x2, y2], [x3, y3]], // Level 1: all cells 1 step away
 *   [[x4, y4], [x5, y5]],           // Level 2: all cells 2 steps away
 *   ...
 * ]
 *
 * INITIALIZE:
 * 1. Create queue for tracking nodes to visit
 * 2. Create visited set to avoid revisiting nodes
 * 3. Initialize distance tracking for path reconstruction
 *
 * MAIN ALGORITHM:
 * 1. Start from initial position (Level 0)
 * 2. For each node:
 *    - Explore all 4 adjacent nodes (LEFT, UP, RIGHT, DOWN)
 *    - Add unvisited valid nodes to queue as: [[newX, newY], nextLevel]
 *    - Group nodes by their level (distance from start)
 *    - Continue until end is found or no paths remain
 */

function BFS(startCallback, speed) {
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
    var nextD = node[1] + 1; // nextD represents the next level/distance from start

    // Ensure we have an array to store nodes for the current level
    // Example: if nextD = 2, we need searchPath to be at least length 2
    if (nextD > searchPath.length) searchPath.push([]);

    if ([x, y].toString() === endPos.toString()) break;

    // For each direction (left/up/right/down):
    // - nextD represents the actual distance/level number (starts at 1)
    // - But array indices start at 0, so we use (nextD - 1) as the index
    // Example: Level 1 nodes are stored at searchPath[0]
    //          Level 2 nodes are stored at searchPath[1]

    if (y - 1 >= 0 && !([x, y - 1] in position.wall) && !visited.has([x, y - 1].toString())) {
      // left
      queue.append([[x, y - 1], nextD]);
      searchPath[nextD - 1].push([x, y - 1]);
      distance.set([x, y - 1], nextD);
      visited.add([x, y - 1].toString());
    }

    if (x - 1 >= 0 && !([x - 1, y] in position.wall) && !visited.has([x - 1, y].toString())) {
      // up
      queue.append([[x - 1, y], nextD]);
      searchPath[nextD - 1].push([x - 1, y]);
      distance.set([x - 1, y], nextD);
      visited.add([x - 1, y].toString());
    }

    if (y + 1 < position.colSize && !([x, y + 1] in position.wall) && !visited.has([x, y + 1].toString())) {
      // right
      queue.append([[x, y + 1], nextD]);
      searchPath[nextD - 1].push([x, y + 1]);
      distance.set([x, y + 1], nextD);
      visited.add([x, y + 1].toString());
    }

    if (x + 1 < position.rowSize && !([x + 1, y] in position.wall) && !visited.has([x + 1, y].toString())) {
      // down
      queue.append([[x + 1, y], nextD]);
      searchPath[nextD - 1].push([x + 1, y]);
      distance.set([x + 1, y], nextD);
      visited.add([x + 1, y].toString());
    }
  }

  // Only clean up searchPath if:
  // 1. A path to the end exists
  // 2. We have more levels than needed
  while (distance.get(endPos) !== -1 && searchPath.length > distance.get(endPos)) {
    searchPath.pop();
  }

  retSearchPath = retSearchPath.concat(searchPath);

  const shortest = distance.getShortestPath(endPos);
  retShortestPath = retShortestPath.concat(shortest[0]);
  retDirection = retDirection.concat(shortest[1]);

  retSearchPath.unshift([position.start]);
  console.log("Start BFS algorithm");
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}

export default BFS;
