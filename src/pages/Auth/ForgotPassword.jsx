import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { useSearchParam } from 'react-use';
// import Cookies from 'js-cookie';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import LogoForLogin from '../../assets/LogoForLogin.png';
import loginBackground from '../../assets/Home.jpg';
// import FormGroup from '../../components/bootstrap/forms/FormGroup';
// import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import useDarkMode from '../../hooks/useDarkMode';
import AuthContext from '../../contexts/authContext';
import { publicAxios } from '../../axiosInstance';
// import { setLogOut } from '../../store/auth';
import validateEmail from '../../helpers/emailValidator';
import showNotification from '../../components/extras/showNotification';
import Error from '../../helpers/Error';
import EnterEmailComponent from '../../components/ForgotPassword/EnterEmailComponent';
import EnterOtpComponent from '../../components/ForgotPassword/EnterOtpComponent';
import ConfirmPassword from '../../components/ForgotPassword/ConfirmPassword';

const ForgotPassword = () => {
	const { setLogOut } = useContext(AuthContext);
	const { darkModeStatus } = useDarkMode();
	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('Enter email');
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const isOtpValid = otp.every((value) => value !== '');

	const handleFormSubmit = (formData, api) => {
		setWaitingForAxios(true);
		publicAxios
			.post(api, formData)
			.then((res) => {
				setWaitingForAxios(false);
				showNotification('Success', res.data.message, 'success');
				setActiveTab((state) => {
					if (state === 'Enter email') {
						return 'Enter Otp';
					}
					if (state === 'Enter Otp') {
						return 'Confirm Password';
					}
					return state;
				});

				if (activeTab === 'Confirm Password') {
					navigate('/login');
				}
			})
			.catch((error) => {
				setWaitingForAxios(false);
				const errorMsg = Error(error, setLogOut);
				showNotification('Error', errorMsg, 'danger');
			});
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: '',
			newPassword: '',
			confirmPassword: '',
			otp: '',
		},
		validate: (values) => {
			const errors = {};
			const emailError = validateEmail(values.email);

			if (!values.email && activeTab === 'Enter email') {
				errors.email = 'Email is required';
			}

			if (!isOtpValid && activeTab === 'Enter Otp') {
				errors.otp = 'OTP is required';
			}

			if (!values.newPassword && activeTab === 'Confirm Password') {
				errors.newPassword = 'Password is required';
			} else if (activeTab === 'Confirm Password') {
				const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
				const isOk = re.test(values.newPassword);
				if (!isOk) {
					errors.newPassword =
						'The password should contain minimum 8 and maximum 15 characters with a mix of alphanumeric, at least 1 uppercase letter, and special characters.';
				}
			}

			if (!values.confirmPassword && activeTab === 'Confirm Password') {
				errors.confirmPassword = 'Confirm password is required';
			} else if (
				values.confirmPassword !== values.newPassword &&
				activeTab === 'Confirm Password'
			) {
				errors.confirmPassword = 'Passwords do not match';
			}

			if (emailError && activeTab === 'Enter email') {
				errors.email = emailError;
			}

			return errors;
		},
		onSubmit: (values) => {
			switch (activeTab) {
				case 'Enter email':
					return handleFormSubmit(
						{ email: values.email },
						'/users_api/send_forgot_password_otp',
					);
				case 'Enter Otp':
					return handleFormSubmit(
						{ otp: Number(otp.join('')), email: values.email },
						'/users_api/validate_forgot_password_otp',
					);
				case 'Confirm Password':
					return handleFormSubmit(
						{ email: values.email, password: values.confirmPassword },
						'/users_api/update_new_password',
					);
				default:
					return null;
			}
		},
	});

	const Components = {
		'Enter email': <EnterEmailComponent formik={formik} />,
		'Enter Otp': (
			<EnterOtpComponent waitingForAxios={waitingForAxios} otp={otp} setOtp={setOtp} />
		),
		'Confirm Password': <ConfirmPassword formik={formik} />,
	};

	useEffect(() => {
		return () => {
			setLogOut();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<PageWrapper
			isProtected={false}
			title='Forgot Password'
			className='p-0 bg-white'>
			<Page className='p-0' container={false}>
				<div style={{ width: '100%', height: '100vh' }}>
					<Container fluid className='p-0'>
						<Row className='g-0'>
							<Col lg={8}>
								<div
									className='authentication-bg'
									style={{ backgroundImage: `url(${loginBackground})` }}>
									<div className='bg-overlay' />
								</div>
							</Col>
							<Col lg={4}>
								<div className='authentication-page-content p-4 d-flex  justify-content-center align-items-center min-vh-100'>
									<div className='' style={{ width: '80%' }}>
										<div className='p-5'>
											<div className='text-center'>
												<img src={LogoForLogin} alt='' height='70' />
											</div>
											<div
												className={classNames('rounded-3', {
													'bg-l10-dark': !darkModeStatus,
													'bg-dark': darkModeStatus,
												})}
											/>
											<div className='text-center h2 mt-4 mb-5'>FORGOT PASSWORD</div>
											<form className='row g-4' onSubmit={formik.handleSubmit}>
												{Components[activeTab]}

												<div className='col-12'>
													<Button
														color='warning'
														className='w-100 py-3'
														type='submit'>
														{waitingForAxios ? <Spinner size='sm' /> : 'Continue'}
													</Button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default ForgotPassword;
