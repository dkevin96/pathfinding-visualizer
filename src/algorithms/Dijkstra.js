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
  [DIRECTIONS.UP]: { 0: 1, 1: 2, 2: 3, 3: 2 }, // up, right, down, left
  [DIRECTIONS.RIGHT]: { 0: 2, 1: 1, 2: 2, 3: 3 },
  [DIRECTIONS.DOWN]: { 0: 3, 1: 2, 2: 1, 3: 2 },
  [DIRECTIONS.LEFT]: { 0: 2, 1: 3, 2: 2, 3: 1 },
};

class DijkstraPathfinder {
  constructor(startPos, endPos) {
    this.startPos = startPos;
    this.endPos = endPos;
    this.searchPath = [];
    this.retDirection = [];
    this.visited = [new Set(), new Set()];
    this.unvisited = [new PriorityQueue(), new PriorityQueue()];
    this.table = this.initializeTable();
  }

  initializeTable() {
    const table = [{}, {}];
    for (let i = 0; i < position.rowSize; i++) {
      for (let j = 0; j < position.colSize; j++) {
        const pos = [i, j];
        // [distance, previousNode, direction, totalDistance]
        table[0][pos] = [Infinity, null, null, Infinity];
        table[1][pos] = [Infinity, null, null, Infinity];
      }
    }
    table[0][this.startPos] = [0, null, DIRECTIONS.UP, 0];
    return table;
  }

  getNeighbors(curPos) {
    return {
      [DIRECTIONS.UP]: curPos[0] - 1 >= 0 ? [curPos[0] - 1, curPos[1]] : null,
      [DIRECTIONS.RIGHT]: curPos[1] + 1 < position.colSize ? [curPos[0], curPos[1] + 1] : null,
      [DIRECTIONS.DOWN]: curPos[0] + 1 < position.rowSize ? [curPos[0] + 1, curPos[1]] : null,
      [DIRECTIONS.LEFT]: curPos[1] - 1 >= 0 ? [curPos[0], curPos[1] - 1] : null,
    };
  }

  calculateHeuristic(startPos, endPos) {
    return Math.abs(endPos[0] - startPos[0]) + Math.abs(endPos[1] - startPos[1]);
  }

  getDirectionScore(currentDirection, newDirectionIndex) {
    return DIRECTION_SCORES[currentDirection]?.[newDirectionIndex] || Infinity;
  }

  processNeighbor(nextPos, curPos, directionIndex, which, isFoundEnd) {
    if (!nextPos || nextPos in position.wall || isFoundEnd) return { isFoundEnd, actualEnd: null };

    const total = this.table[which][curPos][0] + this.getDirectionScore(this.table[which][curPos][2], directionIndex);

    if (total <= this.table[which][nextPos][0]) {
      this.updateTableEntry(which, nextPos, total, curPos, directionIndex);
    }

    if (!this.visited[which].has(curPos.toString())) {
      this.unvisited[which].Push(this.table[which][nextPos][3], this.calculateHeuristic(nextPos, this.endPos), nextPos);
    }

    if (nextPos.toString() === this.endPos.toString()) {
      this.table[which][nextPos][1] = curPos;
      return { isFoundEnd: true, actualEnd: nextPos };
    }

    return { isFoundEnd, actualEnd: null };
  }

  updateTableEntry(which, pos, total, previousPos, directionIndex) {
    const directions = [DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT];
    this.table[which][pos] = [total, previousPos, directions[directionIndex], total];
  }

  reconstructPath(actualEnd, which) {
    const path = [];
    let curPos = actualEnd;

    while (curPos) {
      path.unshift(curPos);
      this.retDirection.unshift(this.table[which][curPos][2]);
      curPos = this.table[which][curPos][1];
    }

    if (this.retDirection.length > 0) {
      this.retDirection.splice(0, 1);
      this.retDirection.unshift(this.retDirection[0]);
    }

    return path;
  }

  findPath() {
    this.unvisited[0].Push(0, 0, this.startPos);
    let isFoundEnd = false;
    let actualEnd = null;
    let which = 0;

    while (this.unvisited[0].Length() > 0 || this.unvisited[1].Length() > 0) {
      which = this.determineSearchDirection(which);

      const curPos = this.unvisited[which].Pop();
      if (curPos in position.wall || this.visited[which].has(curPos.toString())) continue;

      const neighbors = this.getNeighbors(curPos);
      const neighborEntries = Object.entries(neighbors);
      for (let i = 0; i < neighborEntries.length; i++) {
        const [_, nextPos] = neighborEntries[i];
        const result = this.processNeighbor(nextPos, curPos, i, which, isFoundEnd);
        isFoundEnd = result.isFoundEnd;
        if (result.actualEnd) actualEnd = result.actualEnd;
      }

      if (!this.visited[which].has(curPos.toString())) {
        this.searchPath.push([curPos]);
        this.visited[which].add(curPos.toString());
      }

      if (isFoundEnd) {
        this.searchPath.push([actualEnd]);
        break;
      }
    }

    return isFoundEnd ? this.reconstructPath(actualEnd, which) : [];
  }

  determineSearchDirection(which) {
    if (this.unvisited[0].Length() > 0 && this.unvisited[1].Length() > 0) {
      return (which + 1) % 2;
    }
    return this.unvisited[0].Length() > 0 ? 0 : 1;
  }
}

function Dijkstra(startCallback, speed) {
  const pathfinder = new DijkstraPathfinder(position.start, position.end);
  const shortestPath = pathfinder.findPath();
  console.log(pathfinder.retDirection);
  startCallback(pathfinder.searchPath, shortestPath, pathfinder.retDirection, speed);
}

export default Dijkstra;
