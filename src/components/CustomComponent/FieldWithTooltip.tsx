import React from 'react'
import { Tooltip } from '@mui/material'

const FieldWithTooltip = ({title,field_value}) => {
  return (
    <Tooltip title={title} placement="bottom" arrow>
        <span>{field_value}</span>
    </Tooltip>
  )
}

export default FieldWithTooltip
