import Dijkstra from '../../../algorithms/Dijkstra';

export function UpdateTable(Start, ClearPath, algorithm, speed) {
  // Real-time update of Algorithm results
  ClearPath(false);
  switch (algorithm.get) {
    case 'Algorithm_Dijkstra':
      Dijkstra('Dijkstra', Start, speed.get[1]);
      break;
    default:
      break;
  }
}
