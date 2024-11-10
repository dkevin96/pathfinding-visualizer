import { tableVar, componentKind } from './TableIndex';
import { position } from '../../core/index';

function addComponentKind(kind) {
  switch (kind) {
    case componentKind.add:
      return componentKind.background;
    default:
      return componentKind.add;
  }
}

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
}

export function WhichComponentSame(id) {
  // component classification

  var pos = id;

  if (typeof id === 'string' || typeof id === 'number') {
    pos = [Math.floor(parseInt(id) / tableVar.colSize), parseInt(id) % tableVar.colSize];
  }

  if (position.start[0] === pos[0] && position.start[1] === pos[1]) {
    return 0;
  } else if (position.end[0] === pos[0] && position.end[1] === pos[1]) {
    return 1;
  } else if (position.wall[pos]) {
    return 2;
  } else {
    return 3;
  }
}

export function StartEnd(type, start, end) {
  //  Return which type is start end

  switch (type) {
    case 0:
      return start;
    case 1:
      return end;
    default:
      return null;
  }
}
