import { useEffect } from "react";
import useMouseEvents from "./hooks/useMouseEvents";
import { tableVar, componentKind, originPos } from "./constants/tableConstants";

function TableUI() {
  const [rowSize, colSize, size] = [tableVar.rowSize, tableVar.colSize, tableVar.size];

  const row = Array.from(Array(rowSize).keys());
  const col = Array.from(Array(colSize).keys());

  // Updated to use the new hook naming
  const { handleMouseDown, handleMouseUp, handleMouseEnter } = useMouseEvents();

  const createTable = row.map((rowIndex, index) => {
    return (
      <tr key={index} height={size}>
        {col.map((colIndex, index) => {
          return (
            <td
              id={rowIndex * colSize + colIndex}
              key={index}
              className={componentKind.background}
              width={size}
              onMouseUp={handleMouseUp}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
            >
              {}
            </td>
          );
        })}
      </tr>
    );
  });

  // Render start node and finish node
  useEffect(() => {
    document.getElementById((originPos.origin_start[0] * tableVar.colSize + originPos.origin_start[1]).toString()).className = componentKind.start;
    document.getElementById((originPos.origin_end[0] * tableVar.colSize + originPos.origin_end[1]).toString()).className = componentKind.end;
  }, []);

  return (
    <div className="tablePadding">
      <table id="board" className="board" align="center" border="1" cellSpacing="0">
        <tbody>{createTable}</tbody>
      </table>
    </div>
  );
}

export default TableUI;
