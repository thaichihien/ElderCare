import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimeRangePicker = (props) => {
    // const minDate = new Date('August 16, 2023 07:30');
    // const maxDate1 = new Date('August 21, 2023 14:00');

    const guardianSchedules = props.schedules;

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [countError, setCountError] = useState(0);

    // const handleSelectStartTime = (date) => {
    //     props.onSelectStartTime(date);
    // };

    // const handleSelectEndTime = (date) => {
    //     props.onSelectEndTime(date);
    // };

    const handleSelectScheduleID = (scheduleID) => {
        props.onSelectSchedule(scheduleID);
    };

    const [eligibleRange, setEligibleRange] = useState({});

    const handleStartDateChange = (date) => {
        const isValidateStartDate = guardianSchedules.find(
            (range) =>
                date.getTime() <= new Date(range.endTime).getTime() &&
                date.getTime() >= new Date(range.startTime).getTime(),
        );

        if (isValidateStartDate) {
            setCountError(0);
            setStartDate(date);
            setEligibleRange(isValidateStartDate);
            console.log('Count error1', countError);
        } else {
            setCountError(countError);
            setStartDate(date);
            toast.error('Invalid Start Date', {
                position: 'top-center',
                autoClose: 1000,
            });
            console.log('Count error2', countError);
        }
    };

    const handleEndDateChange = (date) => {
        const isValidateEndDate =
            startDate.getTime() <= date.getTime() &&
            date.getTime() <= new Date(eligibleRange.endTime).getTime();

        if (isValidateEndDate) {
            setEndDate(date);
            handleSelectScheduleID(eligibleRange._id);
        } else {
            setEndDate(date);
            toast.error('Invalid End Date', {
                position: 'top-center',
                autoClose: 1000,
            });
        }
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy HH:mm"
            />
            <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy HH:mm"
            />
            <ToastContainer />
        </div>
    );
};

export default TimeRangePicker;
