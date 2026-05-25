import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from "moment"
import { Col, FormGroup, Label, ButtonGroup } from 'reactstrap';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../bootstrap/Modal';
import Button from '../../bootstrap/Button';
import Spinner from '../../bootstrap/Spinner';
import useToasterNotification from '../../../hooks/useToasterNotification';
import downloadHandler from '../../../helpers/DownloadCsv';


const ExportButton = ({ url, name }) => {
	const { showErrorNotification } = useToasterNotification();
	const [isLoading, setIsloading] = useState(false)
	const [isModalShow, setIsModalShow] = useState(false)
	const [selectedOption, setSelectedOption] = useState("CSV");
	const [date, setDate] = useState(null)
	const [error, setError] = useState(null)

	const handleExport = () => {
		setIsloading(true)
		let exportUrl = `${url.current}&report_type=${selectedOption}`;
		if (date?.start_date && date?.end_date) {
			exportUrl += `&start_date=${date.start_date}&end_date=${date.end_date}`
		}
		downloadHandler(exportUrl, `${name}.csv`, setIsloading)



		// if(hiddenColumnsKey!==''||hiddenColumnsKey!==null){
		// 	exportUrl+=`&excluded_columns=${localStorage.getItem(hiddenColumnsKey)}&start_date=${date.start_date}&end_date=${date.end_date}`
		// }


		// if(hiddenColumnsKey!==''||hiddenColumnsKey!==null){
		// 	exportUrl+=`&excluded_columns=${localStorage.getItem(hiddenColumnsKey)}&start_date=${date.start_date}&end_date=${date.end_date}`
		// }


		// if(selectedOption==='PDF'){
		// 	authAxios
		// 	.get(exportUrl)
		// 	.then((response) => {
		// 		const headRowData = [response?.data?.header]
		// 		const bodyRowData = response?.data?.body
		// 		const doc = pdfGenerator(headRowData, bodyRowData, name)
		// 		doc.save(`${name}.pdf`);
		// 		setIsloading(false)
		// 	})
		// 	.catch((error) => {
		// 		showErrorNotification(error)
		// 		setIsloading(false)
		// 	});
		// }
		// else{
		// 	downloadHandler(exportUrl,`${name}.csv`,setIsloading)
		// }

	};




	const dateChangeHandler = (value, key) => {
		setDate((prev) => {
			const updatedDate = { ...prev, [key]: value };

			// If setting the start date, reset end date
			if (key === "start_date") {
				updatedDate.end_date = ""; // Clear end date when start date changes
			}

			// If both dates are selected, validate range
			if (updatedDate.start_date && updatedDate.end_date) {
				const startDate = moment(updatedDate.start_date, "YYYY-MM-DD");
				const endDate = moment(updatedDate.end_date, "YYYY-MM-DD");
				const diffInDays = endDate.diff(startDate, "days");

				if (selectedOption === "PDF" && diffInDays > 14) {
					// ErrorAlert();
					setError("PDF export allows a maximum date range of 14 days.")
					return prev; // Prevent update
				}

				if (selectedOption === "CSV" && diffInDays > 30) {
					setError("CSV export allows a maximum date range of 30 days.")
					// ErrorAlert();
					return prev; // Prevent update
				}
			}

			setError(null);
			return updatedDate; // Update state
		});
	};

	return (
		<>
			<Button
				icon='Download'
				color='secondary'
				isLight
				isDisable={isLoading}
				onClick={() => setIsModalShow(true)}>
				{isLoading ? <Spinner isSmall color='secondary' /> : 'Export'}
			</Button>

			{isModalShow && (
				<Modal isOpen={isModalShow} setIsOpen={setIsModalShow} >
					<ModalHeader className='p-4' setIsOpen={setIsModalShow}>
						<ModalTitle id='exportmodals'>
							Export report
						</ModalTitle>
					</ModalHeader>
					<ModalBody className='px-5 pb-2 d-flex flex-column gap-1 '>

						<div className="col-12 mb-3">
							<div className="form-group">
								<label htmlFor="action" className="form-label">
									Type *
								</label>
								<div className="d-flex gap-4 align-items-center">
									<div className="d-flex align-items-center gap-2">
										<input
											type="radio"
											id="csv"
											name="action"
											value="CSV"
											checked={selectedOption === "CSV"}
											onChange={() => { setSelectedOption('CSV'); setDate(null); setError(null) }}
											className="form-check-input"
										/>
										<label htmlFor="csv" className="form-check-label" style={{ marginTop: '4px' }}>
											CSV
										</label>
									</div>
									{/* <div className="d-flex align-items-center gap-2">
							<input
							type="radio"
							id="pdf"
							name="action"
							value="PDF"
							checked={selectedOption === "PDF"}
							onChange={() => {setSelectedOption('PDF'); setDate(null); setError(null) }}
							className="form-check-input"
							/>
							<label htmlFor="pdf" className="form-check-label" style={{ marginTop: '4px' }}>
							PDF
							</label>
						</div> */}
								</div>
							</div>
						</div>

						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
						<Label>Quick Selection</Label>
						<ButtonGroup className='d-flex gap-2 mb-2'>
							<Button
								color='secondary'
								isLight
								aria-label='Prev'
								onFocus={(e) => { e.target.style.backgroundColor = '#0D3C76'; e.target.style.color = 'white' }}  // Change color when focused
								onBlur={(e) => { e.target.style.backgroundColor = ''; e.target.style.color = '' }}  // Reset color when focus is lost
								onClick={() => {
									setDate({
										start_date: moment().format("YYYY-MM-DD"),
										end_date: moment().add(1, 'days').format("YYYY-MM-DD")
									});
									setError(null);
								}}>
								Today
							</Button>
							{[
								{ label: "Yesterday", days: 1 },
								{ label: "7 Days", days: 7 },
								{ label: "30 Days", days: 30, disabled: selectedOption === "PDF" },
							].map(({ label, days, disabled }) => (
								<Button
									key={label}
									color='secondary'
									isLight
									//@ts-ignore
									disabled={disabled}
									onFocus={(e) => { e.target.style.backgroundColor = '#0D3C76'; e.target.style.color = 'white' }}  // Change color when focused
									onBlur={(e) => { e.target.style.backgroundColor = ''; e.target.style.color = '' }}  // Reset color when focus is lost
									onClick={() => {
										setDate({
											start_date: moment().subtract(days, "days").format("YYYY-MM-DD"),
											end_date: moment().format("YYYY-MM-DD")
										});
										setError(null);
									}}>
									{label}
								</Button>
							))}
						</ButtonGroup>

						<FormGroup style={{ marginBottom: "5px" }}>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<Label for="Start Date">Start Date *</Label>
							<Col>
								<input
									placeholder="Start Date"
									type="date"
									id='Start Date'
									className="form-control input-style"
									value={date?.start_date || ''}
									max={new Date().toISOString().split("T")[0]}
									onChange={(e) => dateChangeHandler(e.target.value, 'start_date')}
								/>
							</Col>
						</FormGroup>
						<FormGroup style={{ marginBottom: "5px" }}>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<Label for="End Date">End Date *</Label>
							<Col>
								<input
									placeholder="End Date"
									id='End Date'
									type="date"
									value={date?.end_date || ''}
									min={date?.start_date ? new Date(date?.start_date).toISOString().split("T")[0] : ''}
									max={new Date().toISOString().split("T")[0]}

									disabled={!date?.start_date}
									className="form-control input-style mb-3"
									onChange={(e) => dateChangeHandler(e.target.value, 'end_date')}
								/>
							</Col>
							{error && <b className='text-danger' style={{ marginTop: '10px' }}>{error}</b>}
						</FormGroup>

					</ModalBody>
					<ModalFooter className='px-4 pb-4'>
						<Button
							icon='Download'
							style={{ marginRight: '20px', marginTop: '8px' }}
							color='secondary'
							isLight
							isDisable={!date?.start_date && !date?.end_date8 || error !== null}
							onClick={() => {
								setIsModalShow(false)
								handleExport();
							}}>
							Generate
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</>

		// <Dropdown isAlignmentEnd={false} >
		// 	<DropdownToggle>
		// 		<Button icon='Download' color= 'secondary' isLight isDisable={isLoading}>
		// 			{isLoading? <Spinner isSmall color='secondary' />:'Export'}
		// 		</Button>
		// 	</DropdownToggle>
		// 	<DropdownMenu>
		// 		<DropdownItem onClick={() => handleExport('pdf_download')}>
		// 			Export PDF
		// 		</DropdownItem>
		// 		<DropdownItem onClick={() => handleExport('csv_download')}>
		// 			Export CSV
		// 		</DropdownItem>
		// 	</DropdownMenu>
		// </Dropdown>

	);
};
/* eslint-disable react/forbid-prop-types */
ExportButton.propTypes = {
	url: PropTypes.any.isRequired,
	hiddenColumnsKey: PropTypes.any.isRequired,
	name: PropTypes.string.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default ExportButton;
