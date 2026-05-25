import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../bootstrap/Card';
import Button from '../../bootstrap/Button';

const ScheduleDayDetails = ({ handleComments }) => {
	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='CalendarMonth' iconColor='info'>
					<CardTitle tag='div' className='h5'>
						Dummy Day Details
					</CardTitle>
				</CardLabel>
				<CardActions>
					<div className='d-flex gap-2'>
						<Button color='dark' isLight onClick={() => handleComments?.()}>
							Comments
						</Button>
						<Button color='info' isOutline>
							Save
						</Button>
					</div>
				</CardActions>
			</CardHeader>
			<CardBody>
				<div className='row g-3'>
					<div className='col-12 col-md-6'>
						<label className='form-label'>Default Status</label>
						<input className='form-control' value='Working' readOnly />
					</div>
					<div className='col-12 col-md-6'>
						<label className='form-label'>Special Status</label>
						<input className='form-control' value='Default' readOnly />
					</div>
					<div className='col-12'>
						<label className='form-label'>Description</label>
						<textarea className='form-control' rows={4} value='Dummy schedule note' readOnly />
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

ScheduleDayDetails.propTypes = {
	handleComments: PropTypes.func,
};

ScheduleDayDetails.defaultProps = {
	handleComments: () => {},
};

export default ScheduleDayDetails;
