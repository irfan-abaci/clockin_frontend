import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const EnterOtpComponent = ({ waitingForAxios, otp, setOtp }) => {
	// const [error, setError] = useState(null);
	const inputRefs = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
	];
	const InputsCount = [0, 1, 2, 3, 4, 5];
	const handlePaste = (event) => {
		event.preventDefault();
		const pastedData = event.clipboardData.getData('text/plain').trim();

		// Filter out non-numeric characters from the pasted data
		const numericData = pastedData.replace(/[^\d]/g, '');

		// Process the filtered numeric data
		if (numericData.match(/^\d{1,5}$/)) {
			const newDigits = numericData.padEnd(5, '0').split('').slice(0, 6);
			setOtp(newDigits);

			newDigits.forEach((digit, index) => {
				inputRefs[index].current.value = digit;
			});
		} else {
			const firstFiveDigits = numericData.substring(0, 6);
			setOtp(firstFiveDigits.split(''));

			firstFiveDigits.split('').forEach((digit, index) => {
				inputRefs[index].current.value = digit;
			});
		}
	};

	const handleChange = (index, value) => {
		const newDigits = [...otp];
		newDigits[index] = value;
		setOtp(newDigits);

		if (value.length === 1 && index < 5) {
			inputRefs[index + 1].current.focus();
		} else if (value.length === 0 && index > 0) {
			inputRefs[index - 1].current.focus();
		}
	};

	return (
		<>
			<div className='text-center h3 fw-bold mt-3'>Forgot Password</div>
			<div className='text-center h5 text-muted mb-2 mt-2'>
				Please enter the OTP to continue !
			</div>{' '}
			<div
				id='otp'
				className='d-flex justify-content-between gap-1'
				style={{ marginBottom: '45px', marginTop: '50px', padding: '20px' }}>
				{InputsCount.map((index) => (
					<input
						key={index}
						ref={inputRefs[index]}
						disabled={waitingForAxios}
						type='text'
						className='form-control'
						maxLength={1}
						value={otp[index]}
						onChange={(e) => handleChange(index, e.target.value)}
						onPaste={handlePaste}
						style={{ width: '50px', height: '45px', textAlign: 'center' }}
						//@ts-ignore
						onWheel={(e) => e.target.blur()}
												
						onInput={(e) => {
							//@ts-ignore
							e.target.value = e.target.value.replace(/\D/g, ''); // Allow only digits
							//@ts-ignore
							e.target.value = e.target.value.slice(0, 1); // Restrict to maximum length of 1 digit
						}}
					/>
				))}
			</div>
		</>
	);
};
/* eslint-disable react/forbid-prop-types */
EnterOtpComponent.propTypes = {
	waitingForAxios: PropTypes.bool.isRequired,
	setOtp: PropTypes.func.isRequired,
	otp: PropTypes.array.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default EnterOtpComponent