import classNames from 'classnames/bind';
import styles from './AssignTaskAddPopup.module.scss';

import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingPopup from '../LoadingPopup';
import TimeRangePicker from '../TimeRangePicker';

import { format } from 'date-fns';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function AssignTaskAddPopup(props) {
    const [taskData, setTaskData] = useState({
        title: '',
        detail: '',
        isDone: false,
        isCycle: false,
        guardian: '',
        aip: '',
        schedule: '',
        note: '',
    });

    const aips = props.aipData;
    const guardians = props.guardianData;

    const [loading, setLoading] = useState(false);

    const [selectedAIP, setSelectedAIP] = useState(null);

    const [selectedGuardian, setSelectedGuardian] = useState(null);

    const [schedules, setSchedule] = useState(null);

    const fetchData = async () => {
        setLoading(true); // Show loading popup
        try {
            const response = await axios.get(
                apiUrls.schedule,
            );
            setSchedule(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getGuardianSchedules = () => {
        if (selectedGuardian) {
            return schedules.filter(
                (schedule) => schedule.guardian === selectedGuardian._id,
            );
        }
        return [];
    };

    const guardianSchedules = getGuardianSchedules();

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(taskData);

        axios
            .post(apiUrls.task, taskData)
            .then((res) => {
                // Call the callback function to trigger table update in DataViewAIP
                props.onAssignTaskAdded();
                props.onAdd();
                // Reset the form fields
                setTaskData({
                    title: '',
                    detail: '',
                    isDone: false,
                    isCycle: false,
                    guardian: '',
                    aip: '',
                    schedule: '',
                    note: '',
                });
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleGuardianChange = (e) => {
        const selectedGuardianName = e.target.value;
        const selectedGuardianObject = guardians.find(
            (guardian) =>
                guardian.firstName + ' ' + guardian.lastName ===
                selectedGuardianName,
        );
        setSelectedGuardian(selectedGuardianObject);
        setTaskData((prevData) => ({
            ...prevData,
            guardian: selectedGuardianObject._id,
        }));
    };

    const handleAIPChange = (e) => {
        const selectedAIPName = e.target.value;
        const selectedAIPObject = aips.find(
            (aip) => aip.firstName + ' ' + aip.lastName === selectedAIPName,
        );
        setSelectedAIP(selectedAIPObject);
        setTaskData((prevData) => ({
            ...prevData,
            'aip': selectedAIPObject._id,
        }));
    };

    const handleChangeChecked = (event) => {
        const { name, value, type, checked } = event.target;

        console.log('CHECK', checked, value);

        setTaskData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const [selectedScheduleID, setSelectedScheduleID] = useState('');

    const handleSelectScheduleID = (scheduleID) => {
        setSelectedScheduleID(scheduleID);
        setTaskData((prevData) => ({
            ...prevData,
            schedule: scheduleID,
        }));
    };

    return props.trigger ? (
        <div className={cx('popup')}>
            <div className={cx('popup-inner')}>
                <button
                    className={cx('btn-close')}
                    onClick={() => props.setTrigger(false)}
                >
                    Close
                </button>

                <h3>ADD Task for Guardian</h3>
                <form noValidate onSubmit={handleSubmit}>
                    {/* Title */}
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            name="title"
                            placeholder="Title"
                            value={taskData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Detail */}
                    <div>
                        <label htmlFor="detail">Detail</label>
                        <input
                            name="detail"
                            placeholder="Detail"
                            value={taskData.detail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Guardian */}
                    <div>
                        <label htmlFor="guardian">Guardian</label>
                        <select
                            id="guardian"
                            value={
                                selectedGuardian
                                    ? selectedGuardian.firstName +
                                      ' ' +
                                      selectedGuardian.lastName
                                    : ''
                            }
                            onChange={handleGuardianChange}
                        >
                            {guardians.map((guardian, index) => (
                                <option
                                    key={index}
                                    value={
                                        guardian.firstName +
                                        ' ' +
                                        guardian.lastName
                                    }
                                >
                                    {guardian.firstName +
                                        ' ' +
                                        guardian.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {guardianSchedules.map((schedule) => (
                        <div key={schedule._id}>
                            Schedule
                            <p className={cx('show-time')}>
                                StartTime:{' '}
                                {format(
                                    new Date(schedule.startTime),
                                    'MMMM d yyyy HH:mm',
                                )}
                            </p>
                            <p className={cx('show-time')}>
                                EndTime:{' '}
                                {format(
                                    new Date(schedule.endTime),
                                    'MMMM d yyyy HH:mm',
                                )}
                            </p>
                        </div>
                    ))}

                    {/* AIP */}
                    <div>
                        <label htmlFor="aip">AIP</label>
                        <select
                            id="aip"
                            value={
                                selectedAIP
                                    ? selectedAIP.firstName +
                                      ' ' +
                                      selectedAIP.lastName
                                    : ''
                            }
                            onChange={handleAIPChange}
                        >
                            {aips.map((aip, index) => (
                                <option
                                    key={index}
                                    value={aip.firstName + ' ' + aip.lastName}
                                >
                                    {aip.firstName + ' ' + aip.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cycle */}
                    <div>
                        <label htmlFor="isCycle">Cycle</label>
                        <input
                            type="checkbox"
                            name="isCycle"
                            placeholder="Status"
                            value={taskData.isCycle}
                            onChange={handleChangeChecked}
                            required
                        />
                    </div>

                    <TimeRangePicker
                        schedules={guardianSchedules}
                        onSelectSchedule={handleSelectScheduleID}
                    />

                    {/* Note */}
                    <div>
                        <label htmlFor="note">Note</label>
                        <input
                            name="note"
                            placeholder="Note"
                            value={taskData.note}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
                {loading && <LoadingPopup />}
            </div>
        </div>
    ) : (
        ''
    );
}

export default AssignTaskAddPopup;
