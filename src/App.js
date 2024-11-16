import { useReducer } from "react";

import Header from "./components/header/Header";
import Table from "./components/table/Table";
import Footer from "./components/footer/Footer";

import { algorithmReducer, initialAlgorithm, algorithmContext } from "./components/core";
import { sysStatusReducer, initialsysStatus, sysStatusContext } from "./components/core";
import { speedContext, speedInitial, speedReducer } from "./components/core";
import { animationStatusContext, animationStatusInitial, animationStatusReducer } from "./components/core";
import { updateReducer, updateInitial, updateContext } from "./components/table/contexts/TableContext";
import { moveReducer, moveInitial, moveContext } from "./components/table/contexts/TableContext";
import { touchReducer, touchInitial, touchContext } from "./components/table/contexts/TableContext";

function App() {
  const [curAlgorithm, setCurAlgorithm] = useReducer(algorithmReducer, initialAlgorithm);
  const [curSysStatus, setCurSysStatus] = useReducer(sysStatusReducer, initialsysStatus);
  const [curSpeed, setCurSpeed] = useReducer(speedReducer, speedInitial);
  const [animation, setAnimation] = useReducer(animationStatusReducer, animationStatusInitial);

  const [update, setUpdate] = useReducer(updateReducer, updateInitial);
  const [touch, setTouch] = useReducer(touchReducer, touchInitial);
  const [move, setMove] = useReducer(moveReducer, moveInitial);

  return (
    <div className="App">
      <animationStatusContext.Provider value={{ get: animation, set: setAnimation }}>
        <updateContext.Provider value={{ get: update, set: setUpdate }}>
          <moveContext.Provider value={{ get: move, set: setMove }}>
            <touchContext.Provider value={{ get: touch, set: setTouch }}>
              <speedContext.Provider value={{ get: curSpeed, set: setCurSpeed }}>
                <sysStatusContext.Provider value={{ get: curSysStatus, set: setCurSysStatus }}>
                  <algorithmContext.Provider value={{ get: curAlgorithm, set: setCurAlgorithm }}>
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
