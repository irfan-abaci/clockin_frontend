import React, { useState } from 'react';
import classNames from 'classnames';
import Button from '../../bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

interface CustomIconButtonProps {
  onClick: () => void;
  icon: string;
  hoverIcon: string;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({ onClick, icon, hoverIcon }) => {
  const { darkModeStatus } = useDarkMode();
  const [currentIcon, setCurrentIcon] = useState('CustomRouteDark');

  return (
    <Button
      isOutline={false}
      color={darkModeStatus ? 'light' : 'dark'}
      isLight
      size="sm"
      className={classNames('text-nowrap', {
        'border-light': false,
      })}
      icon={currentIcon}
      onClick={onClick}
      onMouseEnter={() => setCurrentIcon("CustomRoute")}
      onMouseLeave={() => setCurrentIcon("CustomRouteDark")}
    />
  );
};

export default CustomIconButton;
