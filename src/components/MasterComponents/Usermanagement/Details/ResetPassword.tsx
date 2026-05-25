import React from 'react'
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../bootstrap/Modal'

const ResetPassword = ({setIsOpen,isOpen}:any) => {
  return (
   <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' >
        <ModalHeader className='p-4' setIsOpen={setIsOpen}>
            <ModalTitle id='resetmodal'>
                <></>
            </ModalTitle>
        </ModalHeader>
            <ModalBody className='px-5 pb-2 d-flex flex-column gap-1 '>
            <></>
            </ModalBody>
        <ModalFooter className='px-4 pb-4'>
            <></>
        </ModalFooter>
   </Modal>
  )
}

export default ResetPassword
