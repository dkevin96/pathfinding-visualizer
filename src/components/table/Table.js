import TableUI from "./tablehelper/TableUI";
import { useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { sysStatusContext } from "../core/index";
import { updateContext } from "./tablehelper/TableIndex";

function Table() {
  const sysStatus = useContext(sysStatusContext);

  useEffect(() => {
    setTimeout(() => {
      sysStatus.set("IDLE");
    }, 1000);

    // clear timeout
    return () => {
      clearTimeout();
    }
  }, []);

  if (sysStatus.get === "LOADING") {
    return <Spinner animation="border" variant="warning" />;
  } else {
    return (
      <div>
        <TableUI />
      </div>
    );
  }
}

export default Table;
