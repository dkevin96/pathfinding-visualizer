# Animation System
Let me explain how the animation system works in this pathfinding visualizer:

1. **Animation States**
The animation system uses `stopStatus` to track animation state:

```6:24:src/components/table/tablehelper/Animation.js
export const stopStatus = {
  // Store the state to resume
  searchStop: [0, 0],
  search: [0, 0],
  path: 0,
  pathID: [-1, -1],

  searchResult: [],
  pathResult: [],
  pathDirectionResult: [],

  algorithm: '',

  maze: 0,
  mazeResult: [],

  animationStatus: false,
  complete: true,
};
```


2. **Animation Flow**
There are two main animation phases:

a) **Search Animation** (`SearchFinalAnimation`):
- Visualizes the algorithm's exploration process
- Changes cells to search state using `componentKind.search`
- For start/end nodes, uses special search states (`componentKind.startSearch`, `componentKind.endSearch`)


```45:74:src/components/table/tablehelper/Animation.js
export function SearchFinalAnimation(search, path, pathDirection, speed, SearchAnimation, sysStatusFunction, updateFunction) {
  // stopStatus.complete = false;
  var count = stopStatus.searchStop[0];
  const searchFinalAnimation = setInterval(() => {
    if (count === search.length) {
      stopStatus.searchStop = [search.length, 0];
      // finish search, call animation
      SearchAnimation(path, pathDirection, speed, PathAnimation, sysStatusFunction, updateFunction);
      clearInterval(searchFinalAnimation);
    } else {
      for (var i = (count === stopStatus.searchStop[0]) * stopStatus.searchStop[1]; i < search[count].length; i++) {
        if (stopStatus.animationStatus === false) {
          stopStatus.searchStop = [count, i];
          sysStatusFunction();
          clearInterval(searchFinalAnimation);
          return;
        } else {
          if (WhichComponentSame(search[count][i]) > 1) {
            // set search path
            setTable(search[count][i], componentKind.search);
          } else {
            // set start and end
            setTable(search[count][i], StartEnd(WhichComponentSame(search[count][i]), componentKind.startSearch, componentKind.endSearch));
          }
        }
      }
    }
    count += 1;
  }, speed);
}
```


b) **Path Animation** (`PathAnimation`):
- Shows the final path found
- Uses directional indicators (up/down/left/right arrows)
- Changes cells to path state using `componentKind.path` and directional variants


```84:118:src/components/table/tablehelper/Animation.js
export function PathAnimation(path, speed, pathDirection, sysStatusFunction, updateFunction) {
  var [id, newid] = [stopStatus.pathID[0], stopStatus.pathID[1]];
  var count = stopStatus.path;

  const pathAnimation = setInterval(() => {
    if (count === path.length) {
      resetAnimation();
      updateFunction();
      clearInterval(pathAnimation);
    } else {
      if (stopStatus.animationStatus === false) {
        stopStatus.path = count;
        stopStatus.pathID = [id, newid];
        sysStatusFunction();
        clearInterval(pathAnimation);
        return;
      } else {
        if (WhichComponentSame(path[count]) > 1) {
          newid = path[count];
          // set shortest path ( yellow)
          setTable(id, componentKind.path);
          // set rocket path
          setTable(newid, direction(pathDirection[count]));

          id = newid;
        } else {
          // WhichComponentSame(path[count]) < 1 ( start, end node)
          setTable(id, componentKind.path);
          setTable(path[count], StartEnd(WhichComponentSame(path[count]), direction(pathDirection[count]), direction(pathDirection[count])));
        }
      }
    }
    count += 1;
  }, speed);
}
```


3. **CSS Class Application**
The animation applies different CSS classes through `setTable`:

```4:16:src/components/table/tablehelper/SetTable.js
export function setTable(index, kind, setPosition = false) {
  if (typeof index !== 'number') {
    // Let [posx, posy] and ID both be the input of this function
    // ex: row 0 will have index from left to right 0 , 1 , 2 , 3
    index = parseInt(index[0]) * tableVar.colSize + parseInt(index[1]);
  }

  if (index < 0) {
    return;
  }
  // change css
  document.getElementById(index.toString()).className = kind;

```


4. **Direction Handling**
For path animation, it determines which directional CSS class to use:

```140:153:src/components/table/tablehelper/Animation.js
function direction(kind) {
  switch (kind) {
    case 'left':
      return componentKind.pathHeadLeft;
    case 'right':
      return componentKind.pathHeadRight;
    case 'up':
      return componentKind.pathHeadUp;
    case 'down':
      return componentKind.pathHeadDown;
    default:
      return componentKind.path;
  }
}
```


The animation uses these CSS classes from `componentKind`:

```39:68:src/components/table/tablehelper/TableIndex.js
export const componentKind = {
  add: 'wall',
  wall: 'wall',

  /*---------dynamic---------*/

  start: 'start',
  startSearch: 'startSearch',
  startPath: 'startPath',

  end: 'end',
  endSearch: 'endSearch',
  endPath: 'endPath',

  search: 'search',
  path: 'path',

  /*----------static-----------*/
  searchStatic: 'searchStatic',
  pathStatic: 'pathStatic',

  /*----------------------------*/
  pathHead: 'pathHead',
  pathHeadLeft: 'pathHeadLeft',
  pathHeadRight: 'pathHeadRight',
  pathHeadUp: 'pathHeadUp',
  pathHeadDown: 'pathHeadDown',

  background: 'background',
};
```


The animation flow is:
1. Algorithm runs and collects search and path data
2. `SearchFinalAnimation` visualizes the search process
3. Once search completes, `PathAnimation` shows the final path
4. Each step updates cell CSS classes using `setTable`
5. CSS transitions handle the smooth visual changes

## Speed logic 
 
- The search and final is already calculated, so in order to make the animation faster or slower, we can just wrap the `SearchFinalAnimation` and `PathAnimation` with a function that has a delay (ex: `setTimeout`).

# User flow

1. When the visualize button is clicked, it calls Dijkstra with three parameters:

```83:83:src/components/header/headerhelper/elements/NavButton.js
              Dijkstra('Dijkstra', buttonEvent.Start, speed.get[1]);
```


2. Inside Dijkstra.js, the algorithm:
- Calculates the shortest path
- Stores the search path, shortest path, and direction information
- Finally calls the callback function (buttonEvent.Start) with these calculated results and the animation speed:

```13:14:src/algorithms/Dijkstra.js
  startCallback(retSearchPath, retShortestPath, retDirection, speed);
}
```


3. The buttonEvent.Start callback then handles the animation by:

```27:65:src/components/table/tablehelper/ButtonEvent.js
  const Start = (
    search = stopStatus.searchResult,
    path = stopStatus.pathResult,
    pathDirection = stopStatus.pathDirectionResult,
    speed = sysSpeed.get[1]
  ) => {
    if (stopStatus.animationStatus) {
      // If the animation is executing, pause and return directly
      stopStatus.animationStatus = false;
      return;
    }

    if (sysStatus.get === 'IDLE' || (sysStatus.get === 'STOP' && algorithm.get !== stopStatus.algorithm)) {
      console.log('setting animation...');
      setAnimation(search, path, pathDirection, algorithm.get);
      // resetAnimation()  // Before executing start, it will call ClearPath()
    }

    if (update.get && synchronize.update) {
      // realtime update of algorithm and shortest path, path is already searched
      FinalAnimation(search, path, pathDirection);
    } else {
      console.log('Start');
      sysStatus.set('RUNNING');
      stopStatus.animationStatus = true;
      SearchFinalAnimation(
        search,
        path,
        pathDirection,
        speed,
        SearchAnimation,
        () => sysStatus.set('STOP'),
        () => {
          update.set('True');
          synchronize.update = true;
          sysStatus.set('IDLE');
        }
      );
    }
```


The flow is:
1. User clicks "Visualize" → NavButton.js
2. Calls Dijkstra algorithm with buttonEvent.Start as callback
3. Dijkstra calculates paths and calls buttonEvent.Start with results
4. buttonEvent.Start handles the actual animation of showing the pathfinding process

This callback pattern allows separation between:
- The algorithm logic (calculating paths)
- The visualization logic (animating the results)

The algorithm doesn't need to know how the results will be displayed - it just calculates and passes the data to the callback function which handles the visualization.

# Animation Visual

This CSS code defines the animation for cells that are being "searched" in what appears to be a pathfinding visualization.


1. The `.search` class:
```css
.search {
  background-color: var(--search);
  animation-name: searchAnimation;
  animation-duration: 0.5s;
}
```
- Applies a background color defined by the `--search` CSS variable
- Applies an animation named "searchAnimation"
- The animation lasts 0.5 seconds

2. The `@keyframes searchAnimation`:
```css
@keyframes searchAnimation {
  0% {   /* Animation start */
    background-color: var(--search-animation-0);
    border-radius: 50%;
  }
  25% {  /* Quarter way through */
    background-color: var(--search-animation-25);
    border-radius: 80%;
  }
  50% {  /* Halfway point */
    background-color: var(--search-animation-50);
    border-radius: 90%;
  }
  100% { /* Animation end */
    background-color: var(--search-animation-100);
    border-radius: 100%;
  }
}
```
This creates a smooth transition effect where:
- The cell starts with one color and a 50% border radius (slightly rounded square)
- Gradually changes color through different shades (defined by CSS variables)
- The border radius increases, making the cell become more circular
- Ends with the final color and a completely round shape (border-radius: 100%)

This animation helps visualize the search process in the pathfinding algorithm, making cells "pulse" with color changes and shape transformations as they're being explored. We also applied similar animation to the path.
