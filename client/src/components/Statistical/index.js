import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Statistical.module.scss';
import {
    BarChart,
    Bar,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import axios from 'axios';
import { useEffect } from 'react';

import { DatePicker } from 'antd';
import moment from 'moment';
import LoadingPopup from '../LoadingPopup';

const { RangePicker } = DatePicker;

const cx = classNames.bind(styles);

function Statistical() {
    const [data, setData] = useState([
        { name: 'Task Done', value: 0 },
        { name: 'Task Not Done', value: 0 },
    ]);

    const [defaultRange, setDefaultRange] = useState([]);

    const [selectedDataType, setSelectedDataType] = useState('Finished');
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedule] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [aips, setAips] = useState([]);
    const [guardians, setGuardians] = useState([]);

    const [countTaskDone, setCountTaskDone] = useState(0);
    const [countTaskNotDone, setCountTaskNotDone] = useState(0);
    const [countAipAssigned, setCountAipAssigned] = useState(0);

    const [selectedGuardian, setSelectedGuardian] = useState(null);

    const [selectedRange, setSelectedRange] = useState([]);
    const [tasksInSelectedRange, setTasksInSelectedRange] = useState([]);

    const findScheduleById = (scheduleId) => {
        if (selectedGuardian && selectedGuardian._id) {
            return schedules.find(
                (schedule) =>
                    schedule._id === scheduleId &&
                    schedule.guardian === selectedGuardian._id,
            );
        }
    };

    const updateTasksInSelectedRange = (guardian) => {
        if (selectedRange.length === 0) {
            // // Nếu selectedRange là null, không cần cập nhật tasksInSelectedRange
            // console.log('selectedGuardian 65', guardian);
            // console.log('Range', selectedRange);
            // console.log('Filter', tasks);
            setTasksInSelectedRange(
                tasks.filter((task) => task.guardian === guardian._id),
            );
            return;
        }

        console.log('Range != 0', selectedRange);

        const tasksInRange = tasks.filter((task) => {
            const taskScheduleId = task.schedule;
            const schedule = findScheduleById(taskScheduleId);

            if (schedule) {
                const startTime = new Date(schedule.startTime);
                const endTime = new Date(schedule.endTime);

                const rangeStart = selectedRange[0].toDate();
                const rangeEnd = selectedRange[1].toDate();

                return (
                    startTime.getTime() >= rangeStart.getTime() &&
                    endTime.getTime() <= rangeEnd.getTime()
                );
            }

            return false;
        });

        setTasksInSelectedRange(tasksInRange);
    };

    useEffect(() => {
        if (tasks) {
            updateTasksInSelectedRange(selectedGuardian);
        }
    }, [selectedRange, selectedGuardian]);

    const handleRangeChange = (values) => {
        setSelectedRange(values);
    };

    const fetchData = async () => {
        setLoading(true); // Show loading popup
        try {
            const responseSchedule = await axios.get(
                'https://eldercare.cyclic.cloud/schedule',
            );
            setSchedule(responseSchedule.data);

            const responseTask = await axios.get(
                'https://eldercare.cyclic.cloud/task',
            );

            setTasks(responseTask.data);
            setCountTaskDone(0);

            setCountTaskNotDone(0);
            setCountAipAssigned(0);
            const responseAip = await axios.get(
                'https://eldercare.cyclic.cloud/aip',
            );
            setAips(responseAip.data);

            const responseGuardian = await axios.get(
                'https://eldercare.cyclic.cloud/guardian',
            );
            setGuardians(responseGuardian.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setDataLoaded(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setData([
            { name: 'Task Done', value: countTaskDone },
            { name: 'Task Not Done', value: countTaskNotDone },
        ]);
    }, [countTaskDone, countTaskNotDone, countAipAssigned]);

    const handleGuardianChange = (e) => {
        const selectedGuardianName = e.target.value;
        const selectedGuardianObject = guardians.find(
            (guardian) =>
                guardian.firstName + ' ' + guardian.lastName ===
                selectedGuardianName,
        );

        setSelectedGuardian(selectedGuardianObject);

        setCountTaskDone(
            tasks.filter(
                (task) =>
                    task.guardian === selectedGuardianObject._id &&
                    task.isDone === true,
            ).length,
        );

        setCountTaskNotDone(
            tasks.filter(
                (task) =>
                    task.guardian === selectedGuardianObject._id &&
                    task.isDone === false,
            ).length,
        );

        const uniqueAips = [
            ...new Set(
                tasks
                    .filter(
                        (task) =>
                            task.guardian === selectedGuardianObject._id &&
                            task.aip,
                    )
                    .map((task) => task.aip),
            ),
        ];

        setCountAipAssigned(uniqueAips.length);

        updateTasksInSelectedRange(selectedGuardianObject);
    };

    const [resetRange, setResetRange] = useState(false);

    const handleResetRange = () => {
        setDefaultRange([moment(), moment()]);
        setResetRange(true); // Đặt trạng thái reset
        setSelectedRange([]); // Đặt lại khoảng thời gian đã chọn
        setTasksInSelectedRange([]);
    };

    useEffect(() => {
        if (resetRange) {
            // Sau khoảng thời gian ngắn, đặt lại trạng thái của nút reset
            const timeout = setTimeout(() => {
                setResetRange(false);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [resetRange]);

    return (
        <div className={cx('data-view')}>
            <h2>Thống kê Guardian</h2>
            <div style={{ margin: '10px' }} className={cx('header-wrap')}>
                <RangePicker
                    value={resetRange ? defaultRange : selectedRange}
                    onChange={handleRangeChange}
                />

                <button onClick={handleResetRange} style={{padding:'0px 10px'}}>Reset Range</button>
                <div>
                    <div>
                        Total tasks in selected range:{' '}
                        {tasksInSelectedRange.length}
                    </div>
                    <div>
                        Total tasks <span style={{color:'green'}}>DONE</span> in selected range:{' '}
                        {
                            tasksInSelectedRange.filter(
                                (task) => task.isDone === true,
                            ).length
                        }
                    </div>
                    <div>
                        Total tasks <span style={{color:'red'}}>NOT DONE</span> in selected range:{' '}
                        {
                            tasksInSelectedRange.filter(
                                (task) => task.isDone === false,
                            ).length
                        }
                    </div>
                </div>

                {/* Guardian */}
                <div>
                    <label htmlFor="guardian" style={{ marginRight: '10px' }}>
                        Guardian:
                    </label>
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
                        style={{ padding: '5px' }}
                    >
                        {guardians.map((guardian, index) => (
                            <option
                                key={index}
                                value={
                                    guardian.firstName + ' ' + guardian.lastName
                                }
                            >
                                {guardian.firstName + ' ' + guardian.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={cx('wrap')}>
                <div className={cx('item-group')}>
                    <div>Công việc đã hoàn thành</div>
                    <p className={cx('item-count')}>{countTaskDone}</p>
                </div>
                <div className={cx('item-group')}>
                    <div>Công việc chưa hoàn thành</div>
                    <p className={cx('item-count')}>{countTaskNotDone}</p>
                </div>
                <div className={cx('item-group')}>
                    <div>Số lượng AIP quản lý</div>
                    <p className={cx('item-count')}>{countAipAssigned}</p>
                </div>
            </div>
            <div className={cx('wrap-chart')}>
                <ResponsiveContainer width="90%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {loading && <LoadingPopup />}
        </div>
    );
}

export default Statistical;
