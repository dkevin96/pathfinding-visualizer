export class Distance {
  constructor() {
    this.dict = {};
    this.max_d = 0;
  }

  set(pos, d) {
    this.dict[pos] = d;
    this.max_d = Math.max(this.max_d, d);
  }

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

  getShortestPath(endPos) {
    if (!endPos in this.dict) return []; //if endPos not in this.dict return empty array

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
      if ([x - 1, y] in this.dict && !visited.has([x - 1, y]).toString()) {
        if (this.dict[(x - 1, y)] < curD) {
          curX = x - 1;
          curY = y;
          curD = this.dict[(x - 1, y)];
          dir = "down";
        }
        visited.add([x - 1, y].toString());
      }

      // down
      if ([x + 1, y] in this.dict && !visited.has([x + 1, y]).toString()) {
        if (this.dict[(x + 1, y)] < curD) {
          curX = x + 1;
          curY = y;
          curD = this.dict[(x + 1, y)];
          dir = "up";
        }
        visited.add([x + 1, y].toString());
      }

      // left
      if ([x, y - 1] in this.dict && !visited.has([x, y - 1]).toString()) {
        if (this.dict[(x, y - 1)] < curD) {
          curX = x;
          curY = y - 1;
          curD = this.dict[(x, y - 1)];
          dir = "right";
        }
        visited.add([x, y - 1].toString());
      }

      // right
      if ([x, y + 1] in this.dict && !visited.has([x, y + 1]).toString()) {
        if (this.dict[(x, y + 1)] < curD) {
          curX = x;
          curY = y + 1;
          curD = this.dict[(x, y + 1)];
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
