/**
 * Distance Class
 *
 * Used for tracking and managing distances from the start position to other positions
 * during pathfinding algorithms, particularly in BFS implementation.
 *
 * Key functionalities:
 * - Stores distances for each visited position
 * - Tracks maximum distance reached
 * - Reconstructs shortest path from end to start position
 *
 * Usage in BFS:
 * 1. Initialized with start position at distance 0
 * 2. As BFS explores nodes, distances are set for each new position
 * 3. Used to reconstruct the shortest path once end is reached
 * 4. Also helps determine search animation levels/waves
 */
export class Distance {
  constructor() {
    this.dict = {};
    this.max_d = 0;
  }

  /**
   * Sets distance for a position
   * @param {Array} pos - [x, y] coordinates
   * @param {number} d - distance value
   */
  set(pos, d) {
    this.dict[pos] = d;
    this.max_d = Math.max(this.max_d, d);
  }

  /**
   * Gets distance for a position
   * @param {Array} pos - [x, y] coordinates
   * @returns {number} distance value or -1 if not found
   */
  get(pos) {
    if (pos in this.dict) {
      return this.dict[pos];
    } else {
      return -1;
    }
  }

  remove(pos) {
    if (pos in this.dict) {
      return this.dict[pos];
    } else {
      return -1;
    }
  }

  clear() {
    this.dict = {};
    this.max_d = 0;
  }

  /**
   * Reconstructs shortest path from end to start position by backtracking through stored distances.
   * Starting from the end position, iteratively finds the neighboring cell with the smallest distance
   * until reaching the start position (distance 0).
   *
   * Algorithm:
   * 1. Starts at end position and checks all four adjacent cells (up, down, left, right)
   * 2. Moves to the unvisited neighbor with smallest distance value
   * 3. Records both coordinates and movement direction
   * 4. Repeats until reaching start position (distance 0)
   *
   * Note: Directions are stored from the perspective of start→end movement:
   * - When backtracking up, stores "down"
   * - When backtracking down, stores "up"
   * - When backtracking left, stores "right"
   * - When backtracking right, stores "left"
   *
   * @param {Array} endPos - [x, y] coordinates of end position
   * @returns {Array} [shortestPath, directions] where:
   *                  - shortestPath: Array of [x,y] coordinates from start to end
   *                  - directions: Array of movement directions from start to end
   *                  Returns empty array if no valid path exists
   */
  getShortestPath(endPos) {
    if (!(endPos in this.dict)) return []; //if endPos not in this.dict return empty array

    let shortest = [endPos];
    let shortestDirection = [];
    let x = endPos[0];
    let y = endPos[1];
    let visited = new Set();

    visited.add(endPos.toString());

    // startPos will have distance of 0
    while (this.max_d > 0) {
      let curD = Infinity;
      let curX = x;
      let curY = y;
      let dir = null;

      // up
      if ([x - 1, y] in this.dict && !visited.has([x - 1, y].toString())) {
        if (this.dict[[x - 1, y]] < curD) {
          curX = x - 1;
          curY = y;
          curD = this.dict[[x - 1, y]];
          dir = "down";
        }
        visited.add([x - 1, y].toString());
      }

      // down
      if ([x + 1, y] in this.dict && !visited.has([x + 1, y].toString())) {
        if (this.dict[[x + 1, y]] < curD) {
          curX = x + 1;
          curY = y;
          curD = this.dict[[x + 1, y]];
          dir = "up";
        }
        visited.add([x + 1, y].toString());
      }

      // left
      if ([x, y - 1] in this.dict && !visited.has([x, y - 1].toString())) {
        if (this.dict[[x, y - 1]] < curD) {
          curX = x;
          curY = y - 1;
          curD = this.dict[[x, y - 1]];
          dir = "right";
        }
        visited.add([x, y - 1].toString());
      }

      // right
      if ([x, y + 1] in this.dict && !visited.has([x, y + 1].toString())) {
        if (this.dict[[x, y + 1]] < curD) {
          curX = x;
          curY = y + 1;
          curD = this.dict[[x, y + 1]];
          dir = "left";
        }
        visited.add([x, y + 1].toString());
      }
      x = curX;
      y = curY;
      shortest.unshift([x, y]);
      shortestDirection.unshift(dir);
      this.max_d = curD;
    }

    if (shortest.length === 1) return []; // If no path is found (only the end point itself), then there is no need to run the shortest path
    shortestDirection.unshift(shortestDirection[0]);
    return [shortest, shortestDirection];
  }
}
