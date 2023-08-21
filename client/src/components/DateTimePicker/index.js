import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({ selectedDate, onChange }) => {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={onChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
        />
    );
};

export default DateTimePicker;
