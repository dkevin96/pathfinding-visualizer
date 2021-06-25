### headerhelper

#### elements/Navbutton

- visualize button
- when changing the algorithment dropdown will change the text rendered in this button

- algorithmContext : What kind of algorithm is the current system
- speedContext: speed, ["fast",20]
- animationStatusContext: Current animation status ( maze || algorithm)
- sysStatusContext: Current System Status (idle, stop, running, loading)

In TableIndex

- touchContext: touch status, record which component the start, end overlaps with (start, end)
- moveContext: Record which component the mouse is currently catching( start, end, wall)
- updateContext: Determine whether to directly display the results of the algorithm ( state: true, false)

## 20.06

- SetTable: interact wihh mouse event, update location of wall, start, end
- UpdateTable: dispatch algorithm, Real-time update of Algorithm results

## Algorithment flow

- NavButton click -> call Dijkstra function , with name, buttonEvent.start as startCallBack and speed
- Dijkstra function will call DoDijkstra to calculate the path -> then it call startCallBack to simulate the animation
  .startCallback(aka buttonEvent.start) will have parameter(searchpath, shortestpath, direction, speed)
  . while it is simulating, if we pause and resume, it doesnt call the dijkstra function again, instead it will call the buttonEvent.start. Implementing with the use of sysStatus.get

### ButtonEvent

- Components: Start, ClearPath, ClearWalls, ClearBoard
- Start: is called from dijkstra function
  . 1. it will check if is running ( when run, the animationstatus is true), if so, set it to false and return
  . 2. it will setAnimation (store the parameter value from dijkstra startCallBack to stopStatus obj). This function is called only at once at the beginning of simulation ( when sysStatus is idle) and when it is updating (realtime change). If we pause and resume the animation, we will use the varible store in stopStatus obj)
  . 3. it will check if the animation if completed or not, if completed, call FinalAnimation to update realtime without re-animation
  . 4. If all 3 steps above is pass, it will call SearchFinalAnimation , set sysStatus to running (if pause the sysStatus is Stop, not Idle) -> for setAnimation function to call only once, set animationStatus to true -> for pause/resume feature

### Animation.js

[X] Fix bug when pause and resume shortest path, it has to do search again then set shortest path
->in searchFinalAnimation, if count === search.length, then set stopstatus.searchtop = search.length, becasue when we pause and resume, var count = stopstatus.searchstop

- Animation is the same as setting css, using setTable
- SearchFinalAnimation: will have parameter: search, path, pathdirection, speed, searchanimation, sysstatusfunction, updatefunction
  . count = stopStatus.searchStop[0] : store variable state
  . if count === search.length -> finish setting css for searching -> call SearchAnimation to run PathAnimation ( set shorttest path css)
  . else -> setTable for path and if finised path, setTable for start and endNode

- SearchAnimation: call pathAnimation to set shortest path css
- PathAnimation: set shortest path ( in yellow) and rocket path

### dijkstra.js

- 4 main variable: retSearchPath, retShortestPath, retDirection, speed
- it will call Dodijkstra to calculate shortest path and then concat to new array
- Then it will pass the 4 variable to startCallback ( buttonEvent.start) to set animation ( change css)

#### Dodijkstra

- var table = [{}, {}];
- table[0][pos] = [Infinity, null, null, Infinity]; -> startpoint to pos, prev point, direction, total distance
  -> set all node with the same value
  -> table[0]
- var unvisited = [new PriorityQueue(), new PriorityQueue()]; // [0]: start, [1]: end

1. Set starting point, end point, current shortest path queue
2. while (unvisited[0].Length() > 0 || unvisited[1].Length() > 0)
   . Pick the point of the current minimum: curPos
   . Calculate the points that are adjacent and have not been traversed: up, right, down, left from curPos
   . Foreach 4 points aroung curPos, calculate total, if total is smaller than  table[which][nextPos][0] , exchange, then set  table[which][nextPos][1] (prevpoint) = curPos 
   
