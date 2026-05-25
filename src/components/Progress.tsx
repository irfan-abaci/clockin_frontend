import * as React from 'react';
import {useSelector} from 'react-redux';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LinearProgressWithLabel = (props: LinearProgressProps & { totalCount: number,tempCount : number}) => {

	// const tempTenantCount = useSelector((state:any) => state.TenantSlice.tenantImportSuccessTempStorage.length)

    const {tempCount,totalCount} = props

    const value = (tempCount / totalCount) * 100 || 0
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          Number(value.toFixed(2)),
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export default LinearProgressWithLabel