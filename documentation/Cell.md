# Cell css
Let me explain how the system manages cell CSS classes:

1. **Initial State**:
In `TableUI.js`, every cell is initialized with `componentKind.background` class:

```23:31:src/components/table/tablehelper/TableUI.js
            <td
              id={rowIndex * colSize + colIndex}
              key={index}
              className={componentKind.background}
              width={size}
              onMouseUp={MouseUpHandler}
              onMouseDown={MouseDownHandler}
              onMouseEnter={OnMouseEnterHanlder}
            >
```


2. **CSS Class Changes**:
The system uses `setTable` function to change cell appearances:

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


3. **Mouse Interaction Flow**:
When a user clicks on a cell:

a. `MouseDownHandler` is triggered and checks the component type using `WhichComponent`:

```43:54:src/components/table/tablehelper/MouseEvent.js
    tableVar.id = parseInt(e.target.id);
    const whichComponent = WhichComponent(tableVar.id, touch);

    if (whichComponent.type) {
      // If the wall and weight is added, it must be added immediately and reset the current path
      CheckStopStatus();
      setTable(tableVar.id, whichComponent.rKind, true);
      move.set(componentKind.add);
    } else {
      // Move start and end node
      move.set(whichComponent.kind);
    }
```


b. `WhichComponent` determines what kind of cell it is and what it should become:

```13:37:src/components/table/tablehelper/WhichComp.js
export function WhichComponent(id, touch) {
  // MouseEvent
  var pos = id;

  if (typeof id === 'number') {
    pos = [Math.floor(parseInt(id) / tableVar.colSize), parseInt(id) % tableVar.colSize];
  }

  if (position.start[0] === pos[0] && position.start[1] === pos[1]) {
    return { kind: componentKind.start, touch: touch.get.start, type: 0 };
  } else if (position.end[0] === pos[0] && position.end[1] === pos[1]) {
    return { kind: componentKind.end, touch: touch.get.end, type: 0 };
  } else if (position.wall[pos]) {
    return {
      kind: componentKind.wall,
      rKind: addComponentKind(componentKind.wall),
      type: 1,
    };
  } else {
    return {
      kind: componentKind.background,
      rKind: componentKind.add,
      type: 1,
    };
  }
```


For example:
- If clicking on a background cell → becomes wall (`componentKind.add`)
- If clicking on a wall → becomes background (`componentKind.background`)
- If clicking on start/end → allows dragging

4. **CSS Application**:
The actual CSS change happens through `setTable`:
```javascript
document.getElementById(index.toString()).className = kind;
```

The `componentKind` object in `TableIndex.js` maps all possible states to CSS class names:

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


So when a user interacts with a cell, the flow is:
1. Mouse event triggered
2. `WhichComponent` determines current and target states
3. `setTable` applies the new CSS class
4. CSS styles are applied based on the class name