function Info() {
  return (
    <div id="mainInfo">
      <ul>
        <li>
          {' '}
          <div className="Info-Start-Node"></div>Start Node{' '}
        </li>
        <li>
          {' '}
          <div className="Info-End-Node"></div>Target Node{' '}
        </li>
        <li>
          {' '}
          <div className="Info-Unvisited-Node"></div>Unvisited Node{' '}
        </li>
        <li>
          {' '}
          <div className="Info-Visited-Node"></div>Visited Node{' '}
        </li>
        <li>
          {' '}
          <div className="Info-ShortestPathNode-Node"></div>Shortest-Path Node{' '}
        </li>
        <li>
          {' '}
          <div className="Info-WallNode-Node"></div>Wall Node{' '}
        </li>
      </ul>
    </div>
  );
}

export default Info;
