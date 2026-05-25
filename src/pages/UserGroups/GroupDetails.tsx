import React from 'react';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';

/** Match `GroupMembersSection` card height on group detail page. */
const GROUP_DETAIL_CARD_HEIGHT_PX = 420;

const DetailRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
	<div className='py-2 border-bottom flex-shrink-0'>
		<div
			className='text-muted small text-uppercase fw-semibold'
			style={{ fontSize: '0.8rem', letterSpacing: '0.02em' }}>
			{label}
		</div>
		<div className='fs-6 fw-semibold mt-1 text-truncate'>
			{value != null && value !== '' ? value : '—'}
		</div>
	</div>
);

const formatSchedules = (group: any) => {
	const list = group?.schedules;
	if (!Array.isArray(list) || !list.length) return '';
	return list
		.map((s: any) => (typeof s === 'object' ? s?.name : null))
		.filter(Boolean)
		.join(', ');
};

const GroupDetails = ({ group }: { group: any | null }) => {
	if (!group) return null;

	const parentName =
		group?.parent_group_details?.name ||
		group?.parent_group_data?.name ||
		group?.parent_group_name ||
		(typeof group?.parent_group === 'object' ? group.parent_group?.name : null);

	const leadOne =
		group?.lead_one_details?.preferred_name ||
		group?.lead_one_details?.name ||
		group?.lead_one_name ||
		(typeof group?.lead_one === 'object'
			? `${group.lead_one?.first_name || ''} ${group.lead_one?.last_name || ''}`.trim() ||
				group.lead_one?.email
			: null);

	const leadTwo =
		group?.lead_two_details?.preferred_name ||
		group?.lead_two_details?.name ||
		group?.lead_two_name ||
		(typeof group?.lead_two === 'object'
			? `${group.lead_two?.first_name || ''} ${group.lead_two?.last_name || ''}`.trim() ||
				group.lead_two?.email
			: null);

	const siteName =
		group?.site_details?.name ||
		group?.site_name ||
		(typeof group?.site === 'object' ? group.site?.name : null);

	return (
		<Card
			className='w-100 h-100 d-flex flex-column overflow-hidden'
			style={{
				height: GROUP_DETAIL_CARD_HEIGHT_PX,
				maxHeight: GROUP_DETAIL_CARD_HEIGHT_PX,
			}}>
			<CardHeader className='flex-shrink-0'>
				<CardLabel icon='Info' iconColor='warning'>
					<CardTitle tag='div' className='h5 text-warning'>
						{group?.name || 'Group'}
					</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody className='flex-grow-1 pt-0 overflow-hidden d-flex flex-column'>
				<div className='d-flex flex-column justify-content-between flex-grow-1 h-100'>
					<DetailRow label='Type' value={group?.type} />
					<DetailRow label='Parent group' value={parentName} />
					<DetailRow label='1st incharge' value={leadOne} />
					<DetailRow label='2nd incharge' value={leadTwo} />
					<DetailRow label='Site' value={siteName} />
					<DetailRow label='Schedules' value={formatSchedules(group)} />
				</div>
			</CardBody>
		</Card>
	);
};

export default GroupDetails;
