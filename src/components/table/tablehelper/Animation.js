import { componentKind } from './TableIndex';
import { setTable } from './SetTable';
import { WhichComponentSame, StartEnd } from './WhichComp';
import { position } from '../../core/index';

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

export function setAnimation(search, path, pathDirection, algorithm) {
  stopStatus.searchResult = search;
  stopStatus.pathResult = path;
  stopStatus.pathDirectionResult = pathDirection;
  stopStatus.algorithm = algorithm;
}

export function resetAnimation() {
  stopStatus.search = [0, 0];
  stopStatus.searchStop = [0, 0];
  stopStatus.path = 0;
  stopStatus.pathID = [-1, -1];

  stopStatus.animationStatus = false;
  stopStatus.complete = true;
}

/* Search */

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

export function SearchAnimation(path, pathDirection, speed, PathAnimation, sysStatusFunction, updateFunction) {
  const searchAnimation = setInterval(() => {
    // set shortest path css
    PathAnimation(path, speed, pathDirection, sysStatusFunction, updateFunction);
    clearInterval(searchAnimation);
  }, speed);
}

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

export function FinalAnimation(search, path, pathDirection) {
  for (var i = 0; i < search.length; i++) {
    for (var j = 0; j < search[i].length; j++) {
      if (WhichComponentSame(search[i][j]) > 1) {
        setTable(search[i][j], componentKind.searchStatic);
      } else {
        setTable(search[i][j], StartEnd(WhichComponentSame(search[i][j]), componentKind.startSearch, componentKind.endSearch));
      }
    }
  }
  for (i = 0; i < path.length; i++) {
    if (WhichComponentSame(path[i]) > 1) {
      // wall
      setTable(path[i], componentKind.pathStatic);
    } else {
      setTable(path[i], StartEnd(WhichComponentSame(path[i]), direction(pathDirection[i]), direction(pathDirection[i])));
    }
  }
}

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
