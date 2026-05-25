import React from 'react'
import { Tooltip } from '@mui/material'
import Icon from '../icon/Icon'

const IconWithTooltip = ({title,icon,iconSize}) => {
  return (
    <Tooltip title={title} placement="top" arrow>
        <Icon icon={icon} size={iconSize}/>
    </Tooltip>
  )
}

export default IconWithTooltip
