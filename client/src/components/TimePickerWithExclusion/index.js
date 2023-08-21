import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function generateExcludedTimes(startTime, endTime) {
    const excludedTimes = [];
    const interval = 60 * 1000; // 1 phút

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
        excludedTimes.push(currentTime);
        currentTime = new Date(currentTime.getTime() + interval);
    }

    return excludedTimes;
}

function TimePickerWithExclusion({ selectedTime, onChange, startTime, endTime }) {
    return (
      <DatePicker
        selected={selectedTime}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        excludeTimes={generateExcludedTimes(startTime, endTime)}
      />
    );
  }

export default TimePickerWithExclusion;
