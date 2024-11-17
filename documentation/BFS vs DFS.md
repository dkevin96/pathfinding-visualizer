# BFS vs DFS Path Finding Algorithms

## Path Length Guarantees

### BFS (Breadth-First Search)

- **GUARANTEES** the shortest possible path between start and end points
- This guarantee exists because:
  1. BFS explores all nodes at distance K before any nodes at distance K+1
  2. The first time we reach the end node is guaranteed to be via the shortest path
  3. We cannot find a shorter path later, as all shorter distances were already explored

### DFS (Depth-First Search)

- Does **NOT** guarantee the shortest path
- The path length depends on:
  1. The order of direction exploration (in our implementation: UP → RIGHT → DOWN → LEFT)
  2. The first valid path found, which might not be optimal
  3. The structure of the grid

## Algorithm Characteristics

### BFS

- Explores in "levels" or "waves"
- Good for finding shortest paths
- Uses more memory (needs to store all nodes at current level)
- Better for wider, more open spaces

### DFS

- Explores as deep as possible along each branch
- Good for maze-like structures
- Uses less memory (only stores current path)
- Better for narrow, winding paths
