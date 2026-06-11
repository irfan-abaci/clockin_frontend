import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import SaveButton from '../../../components/CustomComponent/Buttons/SaveButton';
import { authAxiosFileUpload } from '../../../axiosInstance';
import useToasterNotification from '../../../hooks/useToasterNotification';

type UploadDocumentForm = {
	name: string;
	file: FileList;
};

export type LeaveRequestUploadContext = {
	id: number | string;
	employeeName?: string;
	leaveTypeName?: string;
};

type LeaveRequestUploadDocumentModalProps = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	context: LeaveRequestUploadContext | null;
	onUploaded?: () => void;
};

const LeaveRequestUploadDocumentModal = ({
	isOpen,
	setIsOpen,
	context,
	onUploaded,
}: LeaveRequestUploadDocumentModalProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UploadDocumentForm>();
	const [saving, setSaving] = useState(false);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();

	const subtitle = [context?.employeeName, context?.leaveTypeName].filter(Boolean).join(' · ');

	useEffect(() => {
		if (isOpen) reset({ name: '', file: undefined as unknown as FileList });
	}, [isOpen, reset]);

	const onSubmit = (data: UploadDocumentForm) => {
		const file = data.file?.[0];
		if (!file || context?.id == null) {
			showErrorNotification('Please select a file');
			return;
		}
		const formData = new FormData();
		formData.append('documents', file);
		if (data.name?.trim()) formData.append('name', data.name.trim());

		setSaving(true);
		authAxiosFileUpload
			.patch(`/api/hr/leave-requests/${context.id}/`, formData)
			.then(() => {
				showSuccessNotification('Document uploaded');
				setIsOpen(false);
				onUploaded?.();
			})
			.catch(showErrorNotification)
			.finally(() => setSaving(false));
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' isCentered>
			<ModalHeader className='p-4 align-items-start' setIsOpen={setIsOpen}>
				<div className='d-flex flex-column w-100'>
					<ModalTitle id='leave-request-upload-document' className='mb-0'>
						Upload document
					</ModalTitle>
					{subtitle ? <div className='text-muted small fw-normal mt-1'>{subtitle}</div> : null}
				</div>
			</ModalHeader>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody className='px-4 pb-2'>
					<FormGroup label='Document name '>
						<input type='text' className='form-control' {...register('name')} />
					</FormGroup>
					<FormGroup label='File *'>
						<input
							type='file'
							className='form-control'
							accept='.pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx'
							{...register('file', { required: true })}
						/>
						{errors.file?.type === 'required' && (
							<span className='text-danger small'>*This field is required</span>
						)}
					</FormGroup>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='dark' isLight type='button' onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<div className='flex-grow-1' style={{ maxWidth: '12rem' }}>
						<SaveButton state={saving} />
					</div>
				</ModalFooter>
			</Form>
		</Modal>
	);
};

LeaveRequestUploadDocumentModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	context: PropTypes.object,
	onUploaded: PropTypes.func,
};

LeaveRequestUploadDocumentModal.defaultProps = {
	context: null,
	onUploaded: undefined,
};

export default LeaveRequestUploadDocumentModal;
