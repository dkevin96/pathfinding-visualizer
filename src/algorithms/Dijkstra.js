import PriorityQueue from "./PriorityQueue";
import { position } from "../components/core/index";

function Dijkstra(whichAlgo, startCallback, speed) {
  var retSearchPath = [];
  var retShortestPath = [];
  var retDirection = [];

  retShortestPath = retShortestPath.concat(
    DoDijkstra(
      whichAlgo,
      position.start,
      position.end,
      retSearchPath,
      retDirection
    )
  );

  // Execute start animation
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}

// Return the shortest path
function DoDijkstra(whichAlgo, startPos, endPos, searchPath, retDirection) {
  /*  //https://medium.com/basecs/finding-the-shortest-path-with-a-little-help-from-dijkstra-613149fbdc8e
        Create Dijkstra table 
        
        table = {pos : [shortest distance, previous vertex]}
            * start pos : [0, null]
            * use priority queue to pick the pos which contains current shortest disance.
    */

  // Set table: starting point is 0, others are infinite, all previous vertex are null
  // Set the current shortest path queue
  var table = [{}, {}];
  var i, j;
  for (i = 0; i < position.rowSize; i++) {
    for (j = 0; j < position.colSize; j++) {
      var pos = [i, j];

      // The shortest distance from the starting point to pos, the previous point, direction, total distance
      table[0][pos] = [Infinity, null, null, Infinity];
      table[1][pos] = [Infinity, null, null, Infinity]; // for determines the starting point（bidirection
    }
  }

  var end = null; // Determine the end
  var unvisited = [new PriorityQueue(), new PriorityQueue()]; // [0]: start, [1]: end
  // setup first postition
  switch (whichAlgo) {
    case "Dijkstra":
      console.log("dijkstra");
      table[0][startPos] = [0, null, "up", 0]; //Set starting point
      unvisited[0].Push(0, 0, startPos); // Set the current shortest path queue
      end = [endPos];
      console.log("end pos " + end);
      break;
    default:
      break;
  }

  /* Algorithm begins */
  var curShortestPath = [];
  var which = 1; // 0 for start, 1 for end
  var actualEnd = null;
  var isFoundEnd = false;
  var visited = [new Set(), new Set()]; // [0]: start, [1]: end

  while (unvisited[0].Length() > 0 || unvisited[1].Length() > 0) {
    // Choose which way to go
    if (unvisited[0].Length() > 0 && unvisited[1].Length() > 0) {
      which = (which + 1) % 2;
    } else if (unvisited[0].Length() > 0) {
      which = 0;
    } else if (unvisited[1].Length() > 0) {
      which = 1;
    }

    // 1. Pick the point of the current minimum
    var curPos = null;
    curPos = GetClosestNode(unvisited[which]);

    if (curPos in position.wall || visited[which].has(curPos.toString())) {
      continue; // The wall does not go, and the points that have been passed will not go. There may be the same point but different values. You can use the priority queue to catch the smallest point first, and remove the same point next time.
    }

    // 2. Calculate the points that are adjacent and have not been traversed
    // curPos: [row, column, pos]
    var up = curPos[0] - 1 >= 0 ? [curPos[0] - 1, curPos[1]] : null;
    var right =
      curPos[1] + 1 < position.colSize ? [curPos[0], curPos[1] + 1] : null;
    var down =
      curPos[0] + 1 < position.rowSize ? [curPos[0] + 1, curPos[1]] : null;
    var left = curPos[1] - 1 >= 0 ? [curPos[0], curPos[1] - 1] : null;

    // because there are variables declared outside of while but are used inside, ex: which
    // eslint-disable-next-line
    [up, right, down, left].forEach((nextPos, idx) => {
       // If it exceeds the boundary or is a wall or has found the end
       // nextPos should be undefined if wall because the if statement in line 83
      if (!nextPos || nextPos in position.wall || isFoundEnd) return;

      // I have to update the ones I have gone through
      var total = null;
      switch (whichAlgo) {
        case "Dijkstra":
          // The strategy is: only consider the current total score + turn to score
          total =
            table[which][curPos][0] + GetScore(table[which][curPos][2], idx);
          break;
        default:
          break;
      }

      // console.log(`total: ${total} and nextpos: ${table[which][nextPos][0]}`)
      if (total <= table[which][nextPos][0]) {
        table[which][nextPos][0] = total;
        table[which][nextPos][1] = curPos;
        switch (idx) {
          case 0:
            table[which][nextPos][2] = "up";
            break;
          case 1:
            table[which][nextPos][2] = "right";
            break;
          case 2:
            table[which][nextPos][2] = "down";
            break;
          case 3:
            table[which][nextPos][2] = "left";
            break;
          default:
            break;
        }

        // update new total point
        switch (whichAlgo) {
          case "Dijkstra":
            table[which][nextPos][3] = table[which][nextPos][0];
            break;
          default:
            break;
        }
      }

      // Join the points that have not been walked
      if (!visited[which].has(curPos.toString())) {
        unvisited[which].Push(
          table[which][nextPos][3],
          GetHeuristic(nextPos, endPos),
          nextPos
        );
      }

      // If the other party finds something during the search process, update actualEnd

      if (nextPos.toString() === endPos.toString()) {
        // See if you find the end
        actualEnd = nextPos;
        isFoundEnd = true;

        // Because it is looking for the surrounding area, after finding the end, add the end information to it
        table[which][actualEnd][1] = curPos;
      }

    }); // end foreach(up,right,left down)

    if (!visited[which].has(curPos.toString())) {
      searchPath.push([curPos]); // Add to search
      visited[which].add(curPos.toString()); // Join already
    }

    if (isFoundEnd) {
      // Find the end and jump out
      searchPath.push([actualEnd]);
      break;
    }
  } //  while (unvisited[0].Length() > 0 || unvisited[1].Length() > 0)

  // If you find the end point, then judge the minimum path by backtracking
  if (isFoundEnd) {
    console.log("BackTracking...");
    curPos = actualEnd;
    which = 1;
    while (curPos) {
      // Because the previous vertex when the start is found is null
      curShortestPath.unshift(curPos); 
      retDirection.unshift(table[(which + 1) % 2][curPos][2]);
      curPos = table[(which + 1) % 2][curPos][1];
    }
  }

  // Because it is looking for the surrounding area, only the surrounding area is updated, so the head information will not be updated, so remove the head and extend the current first position.
  // console.log(retDirection) if choose up direction -> [up, right ,right,...]
  retDirection.splice(0, 1);
  retDirection.unshift(retDirection[0]);
  return curShortestPath;
}

// Estimated value: expressed by distance, because it is a chessboard, it is changed to the shortest distance a few squares
function GetHeuristic(startPos, endPos) {
  return Math.abs(endPos[0] - startPos[0]) + Math.abs(endPos[1] - startPos[1]);
}

// Find the minimum score, strategy: consider all scores Current total score: previous total score + weight + turn to score + estimate
function GetClosestNode(unvisited) {
  let retPos = unvisited.Pop();
  return retPos;
}

// Get steering score
// Make the search start closest to the starting point, because turning points will add up
// Control the search direction
// Considering the turning score is to search for only one line. If there is no such score, the search will become three lines. Because the estimate of the distance to the end point may be the same, it will take three paths.
// Up right down left
function GetScore(direction, index) {
  var score = 0;
  switch (direction) {
    case "up":
      switch (index) {
        case 0:
          score = 1;
          break;
        case 1:
          score = 2;
          break;
        case 2:
          score = 3;
          break;
        case 3:
          score = 2;
          break;
        default:
          break;
      }
      break;
    case "right":
      switch (index) {
        case 0:
          score = 2;
          break;
        case 1:
          score = 1;
          break;
        case 2:
          score = 2;
          break;
        case 3:
          score = 3;
          break;
        default:
          break;
      }
      break;
    case "down":
      switch (index) {
        case 0:
          score = 3;
          break;
        case 1:
          score = 2;
          break;
        case 2:
          score = 1;
          break;
        case 3:
          score = 2;
          break;
        default:
          break;
      }
      break;
    case "left":
      switch (index) {
        case 0:
          score = 2;
          break;
        case 1:
          score = 3;
          break;
        case 2:
          score = 2;
          break;
        case 3:
          score = 1;
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return score;
}

export default Dijkstra;
