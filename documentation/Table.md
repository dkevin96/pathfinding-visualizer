# Table Creation

## Table Dimension Calculation
- The table dimensions are dynamically calculated based on the window size
- Each cell has a fixed size (25x25 pixels)
- The number of rows and columns is adjusted to ensure odd numbers for better pathfinding. Because example: in a 5×5 grid, the center is at (2,2). But if the grid is 6x6, there is no true center cell

## Table Structure Creation
- Two arrays are generated: one for rows and one for columns
- These arrays serve as the foundation for creating the table grid
- Each cell in the table gets a unique identifier based on its position
- The ID is calculated using the formula: `rowIndex * totalColumns + columnIndex`

Imagine a 3×3 grid:
```
[0,0] [0,1] [0,2]
[1,0] [1,1] [1,2]
[2,0] [2,1] [2,2]
```
Using the formula `rowIndex * totalColumns + columnIndex`, each position gets a unique ID:
```
0 1 2
3 4 5
6 7 8
```
The reverse formula to convert an ID back to row/column coordinates is:
- `row = Math.floor(id / totalColumns)`
- `column = id % totalColumns`

## Cell Management
- Each cell is initialized with a default background state
- Cells can transition between different states:
  - Background (default empty cell)
  - Wall (obstacle)
  - Path (part of the solution)
  - Search (explored during pathfinding)
- Start and end positions are specially marked cells

## Event Handling
- Each cell responds to three mouse events:
  - Mouse Down (start of interaction)
  - Mouse Up (end of interaction)
  - Mouse Enter (for drag operations)
- These events allow users to:
  - Draw walls
  - Move start/end positions
  - Interact with the grid


