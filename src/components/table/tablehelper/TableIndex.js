import { createContext } from 'react';

// Guarantee Odd
export function adjust(size) {
  if (size % 2 === 0) {
    return size - 1;
  } else {
    return size;
  }
}

// cell height, width
const size = () => {
  return 25;
};

const objectHeight = () => {
  return 162 + 100;
};

export const tableVar = {
  rowSize: adjust(Math.floor((window.innerHeight - objectHeight()) / size())),
  colSize: adjust(Math.floor(window.screen.availWidth / size())),
  size: size(),

  id: 0, // MouseEvent ID
  newId: 0,
};

export const originPos = {
  origin_start: [
    adjust(Math.floor(tableVar.rowSize / 2)), // rowsize in this case is 19
    adjust(Math.floor(tableVar.colSize / 4)), // columnSize in this case is 63
  ],
  origin_end: [adjust(Math.floor(tableVar.rowSize / 2)), adjust(tableVar.colSize - Math.floor(tableVar.colSize / 4))],
};

// All Css
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

export const synchronize = {
  update: true, // Added because the reducer is out of sync
  animation: 'Algorithm',

  algorithm: '', // Because the first addEventListener reducer will be blank
  sysStatus: 'IDLE',
};

// touch status // record which component the start, end overlaps with
export const touchContext = createContext();
export const touchInitial = {
  start: componentKind.background,
  end: componentKind.background,
};
export const touchReducer = (state, action) => {
  switch (action.componentKind) {
    case componentKind.start:
      return { ...state, start: action.under };
    case componentKind.end:
      return { ...state, end: action.under };
    default:
      return touchInitial;
  }
};

// Record which component the mouse is currently catching
export const moveContext = createContext();
export const moveInitial = '';
export const moveReducer = (state, action) => {
  switch (action) {
    case componentKind.start:
      return action;
    case componentKind.end:
      return action;
    case componentKind.wall:
      return action;
    default:
      return moveInitial;
  }
};

// Determine whether to directly display the results of the algorithm
export const updateContext = createContext();
export const updateInitial = false;
export const updateReducer = (state, action) => {
  switch (action) {
    case 'True':
      return true;
    case 'False':
      return false;
    default:
      return updateInitial;
  }
};
