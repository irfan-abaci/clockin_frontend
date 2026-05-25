import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import OffCanvasComponent from '../../components/OffCanvasComponent';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import SaveButton from '../../components/CustomComponent/Buttons/SaveButton';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';

const parseEditable = (value: unknown) =>
	value === true || value === 'true' || value === 1 || value === '1';

const RoleForm = ({ isOpen, setIsOpen, tableRef, title, id }: any) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ defaultValues: { role_name: '', is_editable: true } });

	const [saving, setSaving] = useState(false);
	const { showErrorNotification } = useToasterNotification();
	const isEdit = Boolean(id);
	const loadKeyRef = useRef<string | null>(null);

	useEffect(() => {
		if (!isOpen) {
			loadKeyRef.current = null;
			return;
		}

		const loadKey = isEdit ? `edit-${id}` : 'add';
		if (loadKeyRef.current === loadKey) return;
		loadKeyRef.current = loadKey;

		if (!isEdit) {
			reset({ role_name: '', is_editable: true });
			return;
		}

		authAxios
			.get(`/api/hr/roles/${id}/`)
			.then((res) => {
				const role = res?.data;
				reset({
					role_name: role?.role_name || '',
					is_editable: parseEditable(role?.is_editable),
				});
			})
			.catch((err) => showErrorNotification(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, id, isEdit, reset]);

	const onSubmit = (data: any) => {
		setSaving(true);
		const payload = {
			role_name: data?.role_name?.trim() || '',
			is_editable: Boolean(data?.is_editable),
		};

		const req = isEdit
			? authAxios.patch(`/api/hr/roles/${id}/`, payload)
			: authAxios.post('/api/hr/roles/', payload);

		req
			.then(() => {
				setSaving(false);
				tableRef?.current?.onQueryChange?.();
				setIsOpen(false);
			})
			.catch((err) => {
				setSaving(false);
				showErrorNotification(err);
			});
	};

	return (
		<OffCanvasComponent isOpen={isOpen} placement='end' title={title} setOpen={setIsOpen}>
			<Form onSubmit={handleSubmit(onSubmit)} className='p-3'>
				<FormGroup label='Role Name *'>
					<input
						type='text'
						className='form-control'
						{...register('role_name', { required: 'This field is required' })}
					/>
					{errors?.role_name && (
						<span style={{ color: 'red' }}>{String(errors.role_name.message)}</span>
					)}
				</FormGroup>
				<div className='mb-3 d-flex align-items-center mt-3'>
					<input
						type='checkbox'
						className='form-check-input me-2'
						id='role_is_editable'
						{...register('is_editable')}
					/>
					<label className='form-check-label mb-0' htmlFor='role_is_editable'>
						Editable
					</label>
				</div>
				<SaveButton state={saving} />
			</Form>
		</OffCanvasComponent>
	);
};

/* eslint-disable react/forbid-prop-types */
RoleForm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.any,
};
/* eslint-enable react/forbid-prop-types */

RoleForm.defaultProps = {
	id: null,
};

export default RoleForm;
