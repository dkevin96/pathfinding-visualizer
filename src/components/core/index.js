import React from 'react';
import { tableVar, adjust } from '../table/tablehelper/TableIndex';

// component position
export var position = {
  start: [adjust(Math.floor(tableVar.rowSize / 2)), adjust(Math.floor(tableVar.colSize / 4))],
  end: [adjust(Math.floor(tableVar.rowSize / 2)), adjust(tableVar.colSize - Math.floor(tableVar.colSize / 4))],
  wall: [],
  rowSize: tableVar.rowSize,
  colSize: tableVar.colSize,
};

// Current System Status
export const sysStatusContext = React.createContext();
export const initialsysStatus = 'LOADING';
export const sysStatusReducer = (state, action) => {
  switch (action) {
    case 'IDLE':
      return 'IDLE';
    case 'STOP':
      return 'STOP';
    case 'RUNNING':
      return 'RUNNING';
    case 'LOADING':
      return 'LOADING';
    default:
      return initialsysStatus;
  }
};

// Current animation status
export const animationStatusContext = React.createContext();
export const animationStatusInitial = 'Algorithm';
export const animationStatusReducer = (state, action) => {
  switch (action) {
    case 'Maze':
      return 'Maze';
    case 'Algorithm':
      return 'Algorithm';
    default:
      return animationStatusInitial;
  }
};

// Speed
export const speedContext = React.createContext();
export const speedInitial = ['Fast', 20];
export const speedReducer = (state, action) => {
  switch (action) {
    case 'Fast':
      alert('fast');
      return ['Fast', 20];
    case 'Average':
      return ['Average', 100];
    case 'Slow':
      return ['Slow', 1000];
    default:
      return speedInitial;
  }
};

// What kind of algorithm is the current system
export const algorithmContext = React.createContext();
export const initialAlgorithm = '';
export const algorithmReducer = (state, action) => {
  switch (action) {
    case 'Algorithm_Dijkstra':
      return 'Algorithm_Dijkstra';
    case 'Algorithm_Breadth_First':
      return 'Algorithm_Breadth_First';
    case 'Algorithm_Depth_First':
      return 'Algorithm_Depth_First';
    default:
      return initialAlgorithm;
  }
};
