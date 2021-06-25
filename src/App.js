import { useReducer } from "react";

import Header from "./components/header/Header";
import Table from "./components/table/Table";
import Footer from "./components/footer/Footer"

import {
  algorithmReducer,
  initialAlgorithm,
  algorithmContext,
} from "./components/core";
import {
  sysStatusReducer,
  initialsysStatus,
  sysStatusContext,
} from "./components/core";
import { speedContext, speedInitial, speedReducer } from "./components/core";
import {
  animationStatusContext,
  animationStatusInitial,
  animationStatusReducer,
} from "./components/core";
import {
  updateReducer,
  updateInitial,
  updateContext,
} from "./components/table/tablehelper/TableIndex";
import {
  moveReducer,
  moveInitial,
  moveContext,
} from "./components/table/tablehelper/TableIndex";
import {
  touchReducer,
  touchInitial,
  touchContext,
} from "./components/table/tablehelper/TableIndex";

import { position } from "./components/core/index";

function App() {
  const [curAlgorithm, setCurAlgorithm] = useReducer(
    algorithmReducer,
    initialAlgorithm
  );
  const [curSysStatus, setCurSysStatus] = useReducer(
    sysStatusReducer,
    initialsysStatus
  );
  const [curSpeed, setCurSpeed] = useReducer(speedReducer, speedInitial);
  const [animation, setAnimation] = useReducer(
    animationStatusReducer,
    animationStatusInitial
  );

  const [update, setUpdate] = useReducer(updateReducer, updateInitial);
  const [touch, setTouch] = useReducer(touchReducer, touchInitial);
  const [move, setMove] = useReducer(moveReducer, moveInitial);

  const click = () => {
    const wall = Object.keys(position.wall);

    console.log(wall.length);
    // buttonEvent.ClearPath();
  };
  return (
    <div className="App">
      <animationStatusContext.Provider
        value={{ get: animation, set: setAnimation }}
      >
        <updateContext.Provider value={{ get: update, set: setUpdate }}>
          <moveContext.Provider value={{ get: move, set: setMove }}>
            <touchContext.Provider value={{ get: touch, set: setTouch }}>
              <speedContext.Provider
                value={{ get: curSpeed, set: setCurSpeed }}
              >
                <sysStatusContext.Provider
                  value={{ get: curSysStatus, set: setCurSysStatus }}
                >
                  <algorithmContext.Provider
                    value={{ get: curAlgorithm, set: setCurAlgorithm }}
                  >
                    <Header />
                    <Table />
                    <Footer />
                  </algorithmContext.Provider>
                </sysStatusContext.Provider>
              </speedContext.Provider>
            </touchContext.Provider>
          </moveContext.Provider>
        </updateContext.Provider>
      </animationStatusContext.Provider>
    </div>
  );
}

export default App;
