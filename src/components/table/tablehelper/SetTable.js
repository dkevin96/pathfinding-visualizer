import { componentKind, tableVar } from "./TableIndex";
import { position } from "../../core/index";

export function setTable(index, kind, setPosition = false) {
  if (typeof index !== "number") {
    // Let [posx, posy] and ID both be the input of this function
    // ex: row 0 will have index from left to right 0 , 1 , 2 , 3 
    index = parseInt(index[0]) * tableVar.colSize + parseInt(index[1]);

  }

  if (index < 0) {
    return;
  }
  // change css
  document.getElementById(index.toString()).className = kind;

  if (setPosition) {
    //Some scenes call setTable just to change the CSS without updating the position

    const pos = [
      Math.floor(index / tableVar.colSize),
      index % tableVar.colSize,
    ];
    // Delete wall if there is wall already
    if (position.wall[pos]) {
      delete position.wall[pos];
    }
    if (kind === componentKind.wall) {
      //there is wall
      position.wall[pos] = true;
    } else if (kind === componentKind.start) {
      //there is start position, update start position
      position.start = pos;
    } else if (kind === componentKind.end) {
      position.end = pos;
    }
  }
}
