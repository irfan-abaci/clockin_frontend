/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { Col, Container, Row, Spinner } from 'reactstrap';
import classNames from 'classnames';
import { useFormik } from 'formik';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import AuthContext from '../../contexts/authContext';
import { publicAxios, updateToken } from '../../axiosInstance';
import LogoForLogin from '../../assets/LogoForLogin.png';
import loginBackground from '../../assets/Home.jpg';
import { setLogOut } from '../../store/auth';
import validateEmail from '../../helpers/emailValidator';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import { getHomePathForUserType } from '../../helpers/roleToggleUtils';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { setUser, setUserData,  } = useContext(AuthContext);
	const { darkModeStatus } = useDarkMode();
	const [signInPassword] = useState(false);
	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { userData } = useContext(AuthContext);

	useEffect(() => {
		if (userData !== null) {
			if (Object.keys(userData).length === 0) {
				setTimeout(() => setIsLoading(false), 2000);
			} else {
				navigate(getHomePathForUserType(userData?.user_type));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginUsername: '',
			loginPassword: '',
		},
		validate: (values) => {
			const errors = {};
			const emailError = validateEmail(values.loginUsername);
			// console.log('emailError', emailError);
			if (!values.loginUsername) {
				errors.loginUsername = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}
			if (emailError) {
				errors.loginUsername = emailError;
			}
			return errors;
		},
		// validateOnChange: false,
		onSubmit: (values) => {
			handleSignin(values);
		},
	});

	const handleSignin = (values) => {
		setWaitingForAxios(true);

		const url = 'api/users/login/';
		const dataToBeSend = {
			password: values.loginPassword,
			email: values.loginUsername,
		};
		publicAxios
			.post(url, dataToBeSend)
			.then((response) => {
				const responseData = response?.data || {};
				const tenant = responseData?.tenant ?? responseData?.tenants?.[0];
				const tenantName =
					(typeof tenant === 'object' && (tenant?.schema_name || tenant?.tenant_name || tenant?.domain)) ||
					tenant;
				if (tenantName !== undefined && tenantName !== null) {
					Cookies.set('tenant', String(tenantName));
				}

				const token = responseData?.access ?? responseData?.token ?? Cookies.get('token');
				if (token) {
					Cookies.set('token', token);
					updateToken(token, tenantName);
				}

				const userPayload = responseData?.user ?? responseData;
				setUser(userPayload?.email ?? values.loginUsername);
				setUserData({ ...userPayload });
				setWaitingForAxios(false);
				navigate(getHomePathForUserType(userPayload?.user_type));

				// setIsLoading(false);
				// updateToken(response.data?.tenants[0]);
			})
			.catch((error) => {
				setWaitingForAxios(false);
				dispatch(setLogOut());
				let errorMessage = null;
				if (error.response?.status === 403) {
					errorMessage = error?.response?.data?.detail;
				} else {
					errorMessage = 'Error occured, please check your connection and try again!';
				}
				formik.setFieldError('loginPassword', errorMessage);
				formik.setFieldError('loginUsername', ' ');
			});
	};

	if (isLoading) {
		return <AbaciLoader />;
	}
	return (
		<PageWrapper
			isProtected={false}
			title='Login'
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
												{/* <Link
											to='/'
											className={classNames(
												'text-decoration-none  fw-bold display-2',
												{
													'text-dark': !darkModeStatus,
													'text-light': darkModeStatus,
												},
											)}
											aria-label='Facit'>
											
											<img src={LogoForLogin} alt='' height='70' />
										</Link> */}
												<img src={LogoForLogin} alt='' height='70' />
											</div>
											<div
												className={classNames('rounded-3', {
													'bg-l10-dark': !darkModeStatus,
													'bg-dark': darkModeStatus,
												})}
											/>
											<div className='text-center h2  mt-4 mb-5'>USER LOGIN</div>
											<form
												className='row g-4'
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault();
														formik.handleSubmit();
													}
												}}>
												<div className='col-12'>
													<FormGroup
														id='loginUsername'
														isFloating
														label='Username'
														className={classNames({
															'd-none': signInPassword,
														})}>
														<Input
															autoComplete='username'
															value={formik.values.loginUsername}
															isTouched={formik.touched.loginUsername}
															invalidFeedback={formik.errors.loginUsername}
															isValid={formik.isValid}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															onFocus={() => {
																formik.setErrors({});
															}}
														/>
													</FormGroup>
													<br />
													<FormGroup
														id='loginPassword'
														isFloating
														label='Password'>
														<Input
															type='password'
															autoComplete='current-password'
															value={formik.values.loginPassword}
															isTouched={formik.touched.loginPassword}
															invalidFeedback={formik.errors.loginPassword}
															// validFeedback="Looks good!"
															isValid={formik.isValid}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
														/>
													</FormGroup>
												</div>
												{/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
												<div className='d-flex justify-content-end'>
													{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
													<p
														className='cursor-pointer user-select-none'
														onClick={() => navigate('/forgotpassword')}>
														Forgot password ?
													</p>
												</div>
												{/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}

												<div className='col-12 mt-3 text-center'>
													<Button
														color='warning'
														icon='Login'
														className=' py-2'
														style={{ width: '150px' }}
														isDisable={waitingForAxios}
														onClick={formik.handleSubmit}>
														{waitingForAxios ? <Spinner size='sm' /> : 'Login'}
													</Button>
												</div>
											</form>

											{/* <div className='text-center'>
											<a
												href='/'
												className={classNames('text-decoration-none me-3', {
													'link-light': singUpStatus,
													'link-dark': !singUpStatus,
												})}>
												Privacy policy
											</a>
											<a
												href='/'
												className={classNames(
													'link-light text-decoration-none',
													{
														'link-light': singUpStatus,
														'link-dark': !singUpStatus,
													},
												)}>
												Terms of use
											</a>
										</div> */}
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
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
/* eslint-enable @typescript-eslint/no-use-before-define */
