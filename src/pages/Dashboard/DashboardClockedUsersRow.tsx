import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classNames from 'classnames';
import ImageCell from '../../components/CustomComponent/Imagecell';
import Popovers from '../../components/bootstrap/Popovers';

export type ClockedUser = {
	id: number;
	first_name?: string;
	last_name?: string;
	avatar?: string | null;
};

export type ClockCountsWithUsers = {
	clocked_in?: number;
	clocked_out?: number;
	clocked_users?: ClockedUser[];
};

export const clockedUsersFromCounts = (clock?: ClockCountsWithUsers | null): ClockedUser[] => {
	const users = clock?.clocked_users;
	return Array.isArray(users) ? users.filter((u) => u != null) : [];
};

export const clockedUserDisplayName = (user: ClockedUser) => {
	const first = String(user.first_name || '').trim();
	const last = String(user.last_name || '').trim();
	const full = [first, last].filter(Boolean).join(' ').trim();
	return full || `User ${user.id}`;
};

type Props = {
	users?: ClockedUser[];
	avatarSize?: number;
};

const DashboardClockedUsersRow = ({ users, avatarSize = 34 }: Props) => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [scrollState, setScrollState] = useState({ left: false, right: false });
	const list = Array.isArray(users) ? users : [];

	const updateScrollState = useCallback(() => {
		const el = trackRef.current;
		if (!el) return;
		setScrollState({
			left: el.scrollLeft > 4,
			right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
		});
	}, []);

	useEffect(() => {
		updateScrollState();
		const el = trackRef.current;
		if (!el) return undefined;
		el.addEventListener('scroll', updateScrollState, { passive: true });
		const observer = new ResizeObserver(updateScrollState);
		observer.observe(el);
		return () => {
			el.removeEventListener('scroll', updateScrollState);
			observer.disconnect();
		};
	}, [updateScrollState, list.length]);

	const scrollBy = (direction: -1 | 1) => {
		const el = trackRef.current;
		if (!el) return;
		el.scrollBy({ left: direction * (avatarSize + 20), behavior: 'smooth' });
	};

	if (list.length === 0) return null;

	return (
		<div
			className={classNames('hr-dashboard__clocked-users', {
				'hr-dashboard__clocked-users--scroll-left': scrollState.left,
				'hr-dashboard__clocked-users--scroll-right': scrollState.right,
			})}>
			{scrollState.left ? (
				<button
					type='button'
					className='hr-dashboard__clocked-users-nav hr-dashboard__clocked-users-nav--prev'
					aria-label='Scroll clocked-in users left'
					onClick={() => scrollBy(-1)}>
					<ChevronLeftIcon fontSize='small' />
				</button>
			) : null}
			<div ref={trackRef} className='hr-dashboard__clocked-users-track'>
				{list.map((user) => (
					<div key={user.id} className='hr-dashboard__clocked-user'>
						<Popovers desc={clockedUserDisplayName(user)} trigger='hover'>
							<span className='hr-dashboard__clocked-user-trigger'>
								<ImageCell fullImage={user.avatar} size={avatarSize} />
							</span>
						</Popovers>
					</div>
				))}
			</div>
			{scrollState.right ? (
				<button
					type='button'
					className='hr-dashboard__clocked-users-nav hr-dashboard__clocked-users-nav--next'
					aria-label='Scroll clocked-in users right'
					onClick={() => scrollBy(1)}>
					<ChevronRightIcon fontSize='small' />
				</button>
			) : null}
		</div>
	);
};

export default DashboardClockedUsersRow;
