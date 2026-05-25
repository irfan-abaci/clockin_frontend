import React from 'react'
import { Spinner } from 'reactstrap'
import Button from '../../bootstrap/Button'

const SaveButton = ({state}:any) => {
  return (
    <Button
        className='w-100'
        type='submit'
        isDisable={state}
        color='warning'  
       
    >
    {state ? <Spinner size='sm' /> : 'Save'}
</Button>
  )
}

export default SaveButton
