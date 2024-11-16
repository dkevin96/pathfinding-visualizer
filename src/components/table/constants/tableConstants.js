import { ensureOdd } from "misc/helpfunctions";

const getObjectHeight = () => {
  return 162 + 100;
};

const getCellSize = () => {
  return 25;
};

export const tableVar = {
  rowSize: ensureOdd(Math.floor((window.innerHeight - getObjectHeight()) / getCellSize())),
  colSize: ensureOdd(Math.floor(window.screen.availWidth / getCellSize())),
  size: getCellSize(),

  id: 0, // MouseEvent ID
  newId: 0,
};

export const cellType = {
  START: 0,
  END: 1,
  WALL: 2,
  BACKGROUND: 3,
};

export const originPos = {
  origin_start: [
    ensureOdd(Math.floor(tableVar.rowSize / 2)), // Middle Row
    ensureOdd(Math.floor(tableVar.colSize / 4)), // 1/4 from left
  ],
  origin_end: [ensureOdd(Math.floor(tableVar.rowSize / 2)), ensureOdd(tableVar.colSize - Math.floor(tableVar.colSize / 4))],
};

// All Css
export const componentKind = {
  add: "wall",
  wall: "wall",

  /*---------dynamic---------*/

  start: "start",
  startSearch: "startSearch",
  startPath: "startPath",

  end: "end",
  endSearch: "endSearch",
  endPath: "endPath",

  search: "search",
  path: "path",

  /*----------static-----------*/
  searchStatic: "searchStatic",
  pathStatic: "pathStatic",

  /*----------------------------*/
  pathHead: "pathHead",
  pathHeadLeft: "pathHeadLeft",
  pathHeadRight: "pathHeadRight",
  pathHeadUp: "pathHeadUp",
  pathHeadDown: "pathHeadDown",

  background: "background",
};

export const synchronize = {
  update: true, // Added because the reducer is out of sync
  animation: "Algorithm",

  algorithm: "", // Because the first addEventListener reducer will be blank
  sysStatus: "IDLE",
};
