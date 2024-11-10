import React, { useState, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { sysStatusContext } from '../../../core';
import Colored from '../Colored';

function NavLink(props) {
  const sysStatus = useContext(sysStatusContext);
  const [className, toggleHandler] = Colored();

  const onClick = () => {
    if (sysStatus.get !== 'IDLE' && sysStatus.get !== 'STOP') {
      return;
    }
    props.handlers();
  };

  return (
    <Nav.Item>
      <Nav.Link onClick={onClick} className={className} onMouseEnter={toggleHandler} onMouseLeave={toggleHandler}>
        {props.names}
      </Nav.Link>
    </Nav.Item>
  );
}

export default NavLink;
