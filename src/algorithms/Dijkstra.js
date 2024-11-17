/**
 * Dijkstra's Pathfinding Algorithm Implementation
 *
 *
 * INITIALIZE:
 * 1. Create table with all positions set to [Infinity, null, null] meaning [totalCost, previousPosition, direction]
 * 2. Set start position in table to [0, null, UP]
 * 3. Create empty visited set
 * 4. Create empty priority queue for unvisited nodes
 * 5. Initialize empty arrays for searchPath and retDirection
 *
 * MAIN ALGORITHM (findShortestPath):
 * 1. Push start position to priority queue
 * 2. WHILE priority queue is not empty:
 *     a. Pop current position from queue
 *     b. IF position is wall OR already visited, CONTINUE
 *
 *     c. FOR each neighbor (up, right, down, left):
 *         - Skip if neighbor is null, wall, or end already found
 *         - Calculate total cost = current cost + direction change cost
 *         - IF total cost is better than existing cost for neighbor:
 *             * Update table entry with [total, currentPos, direction]
 *         - IF neighbor not visited:
 *             * Add to priority queue
 *         - IF neighbor is end position:
 *             * Update table and mark end as found
 *
 *     d. Add current position to visited set and searchPath
 *     e. IF end found, BREAK
 *
 * PATH RECONSTRUCTION:
 * 1. IF end was found:
 *     a. Start from end position
 *     b. WHILE current position exists:
 *         - Add position to start of path array
 *         - Add direction to start of retDirection array
 *         - Move to previous position from table
 *     c. Adjust first direction
 *     d. Return path
 * 2. ELSE:
 *     Return empty path
 *
 * DIRECTION SCORING:
 * - Straight movement = 1 point
 * - 90° turn = 2 points
 * - 180° turn (U-turn) = 3 points
 *
 * TABLE ENTRY FORMAT: [totalCost, previousPosition, direction]
 */

import PriorityQueue from "./PriorityQueue";
import { position } from "../components/core/index";

const DIRECTIONS = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  LEFT: "left",
};

/*
 * Direction scoring system for path movements:
 * - Keys represent current direction (UP, RIGHT, DOWN, LEFT)
 * - Values are costs for turning to each direction (0=UP, 1=RIGHT, 2=DOWN, 3=LEFT)
 * - Scoring: 1=continue straight, 2=90° turn, 3=180° U-turn
 * - Lower scores are preferred, creating more natural paths with fewer turns
 */
const DIRECTION_SCORES = {
  up: { 0: 1, 1: 2, 2: 3, 3: 2 }, // up, right, down, left
  right: { 0: 2, 1: 1, 2: 2, 3: 3 },
  down: { 0: 3, 1: 2, 2: 1, 3: 2 },
  left: { 0: 2, 1: 3, 2: 2, 3: 1 },
};

class DijkstraPathfinder {
  constructor(startPos, endPos) {
    this.startPos = startPos;
    this.endPos = endPos;
    this.visited = new Set();
    this.unvisited = new PriorityQueue();
    this.table = this.initializeTable();
  }

  initializeTable() {
    const table = {};
    for (let i = 0; i < position.rowSize; i++) {
      for (let j = 0; j < position.colSize; j++) {
        const pos = [i, j];
        table[pos] = [Infinity, null, null];
      }
    }
    table[this.startPos] = [0, null, DIRECTIONS.UP];
    return table;
  }

  /**
   * Returns an object containing the valid neighboring positions for a given position
   * @param {Array} curPos - Current position as [row, col]
   * @returns {Object} Neighboring positions in all four directions (up, right, down, left)
   * - Each direction returns either:
   *   - A valid position as [row, col]
   *   - null if the position would be outside the grid boundaries
   * - Boundary checks:
   *   - UP: ensures row-1 >= 0
   *   - RIGHT: ensures col+1 < grid width
   *   - DOWN: ensures row+1 < grid height
   *   - LEFT: ensures col-1 >= 0
   */
  getNeighbors(curPos) {
    return {
      up: curPos[0] - 1 >= 0 ? [curPos[0] - 1, curPos[1]] : null,
      right: curPos[1] + 1 < position.colSize ? [curPos[0], curPos[1] + 1] : null,
      down: curPos[0] + 1 < position.rowSize ? [curPos[0] + 1, curPos[1]] : null,
      left: curPos[1] - 1 >= 0 ? [curPos[0], curPos[1] - 1] : null,
    };
  }

  calculateHeuristic(startPos, endPos) {
    return Math.abs(endPos[0] - startPos[0]) + Math.abs(endPos[1] - startPos[1]);
  }

  getDirectionScore(currentDirection, newDirectionIndex) {
    return DIRECTION_SCORES[currentDirection]?.[newDirectionIndex] || Infinity;
  }

  /**
   * Processes a neighboring position to update distances and check if end is found
   * @param {Array|null} nextPos - The neighboring position to process [row, col]
   * @param {Array} curPos - Current position being evaluated [row, col]
   * @param {number} directionIndex - Index representing direction (0=UP, 1=RIGHT, 2=DOWN, 3=LEFT)
   * @param {boolean} isFoundEnd - Whether the end position has already been found
   * @returns {Object} Object containing:
   *   - isFoundEnd: boolean indicating if end position was found
   *   - actualEnd: Array of end position coordinates if found, null otherwise
   */
  processNeighbor(nextPos, curPos, directionIndex, isFoundEnd) {
    if (!nextPos || nextPos in position.wall || isFoundEnd) return { isFoundEnd, actualEnd: null };

    const total = this.table[curPos][0] + this.getDirectionScore(this.table[curPos][2], directionIndex);

    if (total <= this.table[nextPos][0]) {
      this.updateTableEntry(nextPos, total, curPos, directionIndex);
    }

    if (!this.visited.has(curPos.toString())) {
      this.unvisited.Push(this.table[nextPos][0], 0, nextPos);
    }

    if (nextPos.toString() === this.endPos.toString()) {
      this.table[nextPos][1] = curPos;
      return { isFoundEnd: true, actualEnd: nextPos };
    }

    return { isFoundEnd, actualEnd: null };
  }

  /**
   * Updates the routing table entry for a given position
   * @param {Array} pos - The position to update [row, col]
   * @param {number} total - The total cost to reach this position from start
   * @param {Array} previousPos - Reference to the previous position [row, col]
   * @param {number} directionIndex - Index representing direction (0=UP, 1=RIGHT, 2=DOWN, 3=LEFT)
   *
   * Table entry format: [totalCost, previousPosition, direction]
   * - totalCost: Cost to reach this position from start
   * - previousPosition: Reference for path reconstruction
   * - direction: String direction taken to reach this position
   */
  updateTableEntry(pos, total, previousPos, directionIndex) {
    const directions = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];
    this.table[pos] = [total, previousPos, directions[directionIndex]];
  }

  /**
   * Reconstructs the shortest path from start to end position
   * @param {Array} actualEnd - The end position coordinates [row, col]
   * @returns {Array} Array of positions representing the shortest path. Direction array is also built for animation purposes.
   *
   * Path reconstruction process:
   * 1. Builds path array by backtracking from end position using table references
   *    - index 0 is totalCost, index 1 is previousPosition, index 2 is direction
   * 2. Simultaneously builds direction array for animation purposes
   * 3. Special handling for start position's direction:
   *    - Removes initial null direction from start position
   *    - Duplicates first valid direction to ensure smooth animation start
   *    Example:
   *    - Initial: [null, "right", "down", "right"]
   *    - After splice: ["right", "down", "right"]
   *    - Final: ["right", "right", "down", "right"]
   */
  reconstructPath(actualEnd) {
    const path = [];
    const directions = [];
    let curPos = actualEnd;

    while (curPos) {
      path.unshift(curPos);
      directions.unshift(this.table[curPos][2]);
      curPos = this.table[curPos][1];
    }

    if (directions.length > 0) {
      directions.splice(0, 1);
      directions.unshift(directions[0]);
    }

    return { path, directions };
  }

  findShortestPath() {
    /*
     * Algorithm Overview:
     * Standard Dijkstra's algorithm implementation that searches from start position
     * until it finds the end position or exhausts all possible paths.
     */
    this.unvisited.Push(0, 0, this.startPos);
    let isFoundEnd = false;
    let actualEnd = null;
    const searchPath = [];

    while (this.unvisited.Length() > 0) {
      const curPos = this.unvisited.Pop();
      if (curPos in position.wall || this.visited.has(curPos.toString())) continue;

      const neighbors = this.getNeighbors(curPos); // each node has 4 neighbors
      const neighborEntries = Object.entries(neighbors);
      for (let i = 0; i < neighborEntries.length; i++) {
        const [_, nextPos] = neighborEntries[i];
        const result = this.processNeighbor(nextPos, curPos, i, isFoundEnd);
        isFoundEnd = result.isFoundEnd;
        if (result.actualEnd) actualEnd = result.actualEnd;
      }

      if (!this.visited.has(curPos.toString())) {
        searchPath.push([curPos]);
        this.visited.add(curPos.toString());
      }

      if (isFoundEnd) {
        searchPath.push([actualEnd]);
        break;
      }
    }

    if (!isFoundEnd) return { path: [], directions: [], searchPath: [] };

    const { path, directions } = this.reconstructPath(actualEnd);
    return { path, directions, searchPath };
  }
}

function Dijkstra(startCallback, speed) {
  const pathfinder = new DijkstraPathfinder(position.start, position.end);
  const { path: shortestPath, directions, searchPath } = pathfinder.findShortestPath();
  startCallback(searchPath, shortestPath, directions, speed);
}

export default Dijkstra;
