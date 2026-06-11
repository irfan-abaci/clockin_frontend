import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Tooltip } from '@mui/material';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import ListGroup, { ListGroupItem } from '../../../components/bootstrap/ListGroup';
import Icon from '../../../components/icon/Icon';
import { authAxios } from '../../../axiosInstance';
import useToasterNotification from '../../../hooks/useToasterNotification';
import { buttonColor } from '../../../helpers/constants';
import type { TIcons } from '../../../type/icons-type';
import {
	leaveRequestDocumentLabel,
	normalizeLeaveDocuments,
	userDocumentDeleteUrl,
	type LeaveRequestDocument,
} from './leaveRequestDocuments';

export type LeaveRequestViewDocumentsContext = {
	leaveRequestId?: number | string;
	employeeName?: string;
	leaveTypeName?: string;
	documents?: unknown;
};

const getFileExtension = (fileName: string): string => {
	const base = fileName.split('?')[0];
	const dot = base.lastIndexOf('.');
	return dot >= 0 ? base.slice(dot + 1).toLowerCase() : '';
};

const getFileIcon = (fileName: string): TIcons => {
	const ext = getFileExtension(fileName);
	if (['pdf'].includes(ext)) return 'PictureAsPdf';
	if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'Image';
	if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'Description';
	if (['xls', 'xlsx', 'csv'].includes(ext)) return 'InsertDriveFile';
	return 'InsertDriveFile';
};

type LeaveRequestViewDocumentsModalProps = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	context: LeaveRequestViewDocumentsContext | null;
	onDocumentsChanged?: () => void;
};

const LeaveRequestViewDocumentsModal = ({
	isOpen,
	setIsOpen,
	context,
	onDocumentsChanged,
}: LeaveRequestViewDocumentsModalProps) => {
	const [documents, setDocuments] = useState<LeaveRequestDocument[]>([]);
	const [deletingId, setDeletingId] = useState<string | number | null>(null);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();

	const subtitle = [context?.employeeName, context?.leaveTypeName].filter(Boolean).join(' · ');

	useEffect(() => {
		if (isOpen) {
			setDocuments(normalizeLeaveDocuments(context?.documents));
		}
	}, [isOpen, context?.documents]);

	const openDocument = (doc: LeaveRequestDocument) => {
		if (!doc.file) return;
		window.open(doc.file, '_blank', 'noopener,noreferrer');
	};

	const handleDelete = (doc: LeaveRequestDocument) => {
		if (doc.id == null) {
			showErrorNotification('Cannot delete this document');
			return;
		}

		const fileName = leaveRequestDocumentLabel(doc);
		Swal.fire({
			title: 'Delete document?',
			text: `Remove "${fileName}"? This cannot be undone.`,
			icon: 'warning',
			showCancelButton: true,
			iconColor: buttonColor[0],
			confirmButtonColor: buttonColor[0],
			cancelButtonColor: buttonColor[1],
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (!result.isConfirmed) return;

			setDeletingId(doc.id!);
			authAxios
				.delete(userDocumentDeleteUrl(doc.id!))
				.then(() => {
					showSuccessNotification('Document deleted');
					setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
					onDocumentsChanged?.();
				})
				.catch(showErrorNotification)
				.finally(() => setDeletingId(null));
		});
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' isCentered isScrollable>
			<ModalHeader className='p-4 align-items-start' setIsOpen={setIsOpen}>
				<div className='d-flex flex-column w-100'>
					<ModalTitle id='leave-request-view-documents' className='mb-0'>
						Leave documents
					</ModalTitle>
					{subtitle ? <div className='text-muted small fw-normal mt-1'>{subtitle}</div> : null}
				</div>
			</ModalHeader>
			<ModalBody className='px-4 pb-2'>
				{documents.length === 0 ? (
					<p className='text-muted mb-0 text-center py-4'>No documents uploaded for this request.</p>
				) : (
					<ListGroup isFlush>
						{documents.map((doc, index) => {
							const label = leaveRequestDocumentLabel(doc);
							const fileIcon = getFileIcon(label);
							const isDeleting = deletingId === doc.id;
							return (
								<ListGroupItem key={doc.id ?? `doc-${index}`} className='px-0 border-0'>
									<div className='d-flex align-items-center gap-3 py-2'>
										<div
											className='d-flex align-items-center justify-content-center rounded bg-light flex-shrink-0'
											style={{ width: 44, height: 44 }}>
											<Icon icon={fileIcon} size='2x' />
										</div>
										<div className='flex-grow-1 min-w-0'>
											<div className='fw-semibold text-truncate' title={label}>
												{label}
											</div>
										</div>
										<div className='d-flex flex-shrink-0 gap-1'>
											{doc.file ? (
												<Tooltip arrow title='Open document' placement='top'>
													<span className='d-inline-flex'>
														<Button
															type='button'
															color='success'
															isLight
															size='sm'
															icon='Visibility'
															isDisable={isDeleting}
															onClick={() => openDocument(doc)}
														/>
													</span>
												</Tooltip>
											) : null}
											{doc.id != null ? (
												<Tooltip arrow title='Delete document' placement='top'>
													<span className='d-inline-flex'>
														<Button
															type='button'
															color='danger'
															isLight
															size='sm'
															icon='Delete'
															isDisable={isDeleting}
															onClick={() => handleDelete(doc)}
														/>
													</span>
												</Tooltip>
											) : null}
										</div>
									</div>
								</ListGroupItem>
							);
						})}
					</ListGroup>
				)}
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='dark' isLight type='button' onClick={() => setIsOpen(false)}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
};

LeaveRequestViewDocumentsModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	context: PropTypes.object,
	onDocumentsChanged: PropTypes.func,
};

LeaveRequestViewDocumentsModal.defaultProps = {
	context: null,
	onDocumentsChanged: undefined,
};

export default LeaveRequestViewDocumentsModal;
