import React, { useEffect, useMemo, useState } from 'react';
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
	documents?: unknown;
};

const normalizeDocuments = (raw: unknown): { id?: number | string; name?: string; file?: string }[] => {
	if (Array.isArray(raw)) return raw as { id?: number | string; name?: string; file?: string }[];
	if (raw && typeof raw === 'object') return [raw as { id?: number | string; name?: string; file?: string }];
	return [];
};

const documentLabel = (doc: { name?: string; file?: string; id?: number | string }) => {
	if (doc.name?.trim()) return doc.name.trim();
	if (typeof doc.file === 'string' && doc.file) {
		try {
			return decodeURIComponent(new URL(doc.file).pathname.split('/').pop() || '') || `Document ${doc.id}`;
		} catch {
			return doc.file.split('/').pop() || `Document ${doc.id}`;
		}
	}
	return `Document ${doc.id ?? ''}`.trim();
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

	const existingDocs = useMemo(
		() => normalizeDocuments(context?.documents),
		[context?.documents],
	);

	const subtitle = useMemo(() => {
		const parts = [context?.employeeName, context?.leaveTypeName].filter(Boolean);
		return parts.length ? parts.join(' · ') : '';
	}, [context?.employeeName, context?.leaveTypeName]);

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
			<ModalHeader className='p-4' setIsOpen={setIsOpen}>
				<ModalTitle id='leave-request-upload-document'>Upload document</ModalTitle>
				{subtitle ? <div className='text-muted small fw-normal mt-1'>{subtitle}</div> : null}
			</ModalHeader>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody className='px-4 pb-2'>
					{existingDocs.length > 0 && (
						<div className='mb-3'>
							<div className='small text-muted text-uppercase fw-semibold mb-2'>
								Existing documents
							</div>
							<ul className='list-unstyled mb-0 small'>
								{existingDocs.map((doc, i) => (
									<li key={doc.id ?? `doc-${i}`} className='mb-1'>
										{doc.file ? (
											<a href={doc.file} target='_blank' rel='noopener noreferrer'>
												{documentLabel(doc)}
											</a>
										) : (
											documentLabel(doc)
										)}
									</li>
								))}
							</ul>
						</div>
					)}
					<FormGroup label='Document name (optional)'>
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
