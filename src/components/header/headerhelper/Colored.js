import { useState, useContext } from 'react';
import { sysStatusContext } from '../../core/index';

const Colored = () => {
  const sysStatus = useContext(sysStatusContext);
  const [isHover, setIsHover] = useState(false);
  const [className, setClassName] = useState('nav-link-default');

  const toggleHandler = () => {
    if (isHover) {
      setClassName('nav-link-default');
      setIsHover(false);
    } else {
      if (sysStatus.get !== 'IDLE' && sysStatus.get !== 'STOP') {
        // SysStatus is running
        setClassName('nav-link-red');
      } else {
        setClassName('nav-link-green');
      }
      setIsHover(true);
    }
  };

  return [className, toggleHandler];
};

export default Colored;
