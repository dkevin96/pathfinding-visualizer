import { useContext, useEffect } from 'react';
import { sysStatusContext, algorithmContext, speedContext, animationStatusContext } from '../../core/index';

import { tableVar, touchContext, moveContext, updateContext, componentKind, keyboardSupport, synchronize } from './TableIndex';
import { setTable } from './SetTable';
import { UpdateTable } from './UpdateTable';
import { WhichComponent } from './WhichComp';
import ButtonEvent from './ButtonEvent';

function MouseEvent() {
  const [touch, move, update, animation] = [
    useContext(touchContext),
    useContext(moveContext),
    useContext(updateContext),
    useContext(animationStatusContext),
  ];
  const [algorithm, speed, sysStatus] = [useContext(algorithmContext), useContext(speedContext), useContext(sysStatusContext)];

  const buttonEvent = ButtonEvent();

  useEffect(() => {
    // Because the first time addEventListener algorithm.get sysStatus.get will be blank
    synchronize.algorithm = algorithm;
    synchronize.sysStatus = sysStatus;
  }, [algorithm.get, sysStatus.get]);

  const CheckStopStatus = () => {
    if (sysStatus.get === 'STOP') {
      buttonEvent.ClearPath();
    }
    sysStatus.set('IDLE');
  };

  const MouseDownHandler = e => {
    console.log('MouseDownHandler ' + e.target.id);
    if ((sysStatus.get !== 'IDLE' && sysStatus.get !== 'STOP') || componentKind.add === false) {
      // sysStatus = "IDLE" & "STOP" lock Mouse
      return;
    }

    e.preventDefault();

    tableVar.id = parseInt(e.target.id);
    const whichComponent = WhichComponent(tableVar.id, touch);

    if (whichComponent.type) {
      // If the wall and weight is added, it must be added immediately and reset the current path
      CheckStopStatus();
      setTable(tableVar.id, whichComponent.rKind, true);
      move.set(componentKind.add);
    } else {
      // Move start and end node
      move.set(whichComponent.kind);
    }
  };

  const MouseUpHandler = e => {
    // console.log("MouseUpHandler " + e.target.id)

    if ((sysStatus.get !== 'IDLE' && sysStatus.get !== 'STOP') || componentKind.add === false) {
      // sysStatus = "IDLE" & "STOP" lock Mouse
      return;
    }

    move.set('');

    if (update.get && move.get !== '') {
      UpdateTable(buttonEvent.Start, buttonEvent.ClearPath, algorithm, speed);
    }
  };

  const OnMouseEnterHanlder = e => {
    console.log('OnMouseEnterHanlder ' + e.target.id);

    if ((sysStatus.get !== 'IDLE' && sysStatus.get !== 'STOP') || componentKind.add === false) {
      // sysStatus = "IDLE" & "STOP" lock Mouse
      return;
    }

    tableVar.newId = parseInt(e.target.id);
    const whichOldComponent = WhichComponent(tableVar.id, touch);
    const whichNewComponent = WhichComponent(tableVar.newId, touch);

    // console.log(whichOldComponent)
    // console.log(whichNewComponent)
    if (move.get === componentKind.add && whichNewComponent.type) {
      console.log('wall', whichNewComponent);
      // If you add a wall , you don’t need to clear the object with the old id
      setTable(tableVar.newId, whichNewComponent.rKind, true);
      tableVar.id = parseInt(tableVar.newId);
      CheckStopStatus();
    } else if (
      // Move start and end node
      move.get !== componentKind.add &&
      move.get !== '' &&
      whichNewComponent.type
    ) {
      // Delete old start/end position (set id to background)
      // touch at first will be touchinital, start, end is componenkind.background
      // If it overlaps wall then touch will be set to wall
      // after it exit wall, whicholdcomponent.touch will be wall in this case
      setTable(tableVar.id, whichOldComponent.touch, true);
      touch.set({
        // in touch reducer, action.componentkind will take start, end as input
        componentKind: whichOldComponent.kind,
        under: whichNewComponent.kind,
      });
      // add start/end to new position
      setTable(tableVar.newId, whichOldComponent.kind, true);
      tableVar.id = parseInt(tableVar.newId);
      CheckStopStatus();

      if (update.get && move.get !== '') {
        //  UpdateTable
        UpdateTable(buttonEvent.Start, buttonEvent.ClearPath, algorithm, speed);
      }
    }
  };

  return { MouseDownHandler, MouseUpHandler, OnMouseEnterHanlder };
}

export default MouseEvent;
