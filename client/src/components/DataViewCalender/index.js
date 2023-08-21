import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import classNames from 'classnames/bind';
import styles from './DataViewCalender.module.scss';
import LoadingPopup from '../LoadingPopup';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import apiUrls from '~/apiUrls';

import { format } from 'date-fns';

const cx = classNames.bind(styles);

function DataViewCalender() {
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedule] = useState(null);
    const [taks, setTasks] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [aips, setAips] = useState(null);
    const [guardians, setGuardians] = useState(null);

    const column = [
        {
            name: 'Task',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Guardian',
            selector: (row) => {
                if (!dataLoaded) {
                    return 'Loading...';
                }

                const guardianInfo = guardians.find(
                    (guardian) => guardian._id === row.guardian,
                );

                if (guardianInfo) {
                    return guardianInfo.firstName + ' ' + guardianInfo.lastName;
                } else {
                    return 'Not Found';
                }
            },
        },
        {
            name: 'AIP',
            selector: (row) => {
                if (!dataLoaded) {
                    return 'Loading...';
                }

                const aipInfo = aips.find((aip) => aip._id === row.aip);

                if (aipInfo) {
                    return aipInfo.firstName + ' ' + aipInfo.lastName;
                } else {
                    return 'Not Found';
                }
            },
        },
        {
            name: 'Start',
            selector: (row) => {
                if (!dataLoaded) {
                    return 'Loading...';
                }

                const scheduleInfo = schedules.find(
                    (schedule) => schedule._id === row.schedule,
                );

                if (scheduleInfo) {
                    return format(
                        new Date(scheduleInfo.startTime),
                        'MMMM d yyyy HH:mm',
                    );
                } else {
                    return 'Not Found';
                }
            },
        },
        {
            name: 'End',
            selector: (row) => {
                if (!dataLoaded) {
                    return 'Loading...';
                }

                const scheduleInfo = schedules.find(
                    (schedule) => schedule._id === row.schedule,
                );

                if (scheduleInfo) {
                    return format(
                        new Date(scheduleInfo.endTime),
                        'MMMM d yyyy HH:mm',
                    );
                } else {
                    return 'Not Found';
                }
            },
        },
        {
            name: 'Deadline',
            selector: (row) =>
                format(new Date(row.deadline), 'MMMM d yyyy HH:mm'),
        },
        {
            name: 'Status',
            selector: (row) =>
                row.isDone ? (
                    <div>
                        <FaCheckCircle color="green" /> Done
                    </div>
                ) : (
                    <div>
                        <FaTimesCircle color="red" /> Not
                    </div>
                ),
        },
        {
            name: 'Cycle',
            selector: (row) =>
                row.isCycle ? (
                    <div>
                        <FaCheckCircle color="green" /> Yes
                    </div>
                ) : (
                    <div>
                        <FaTimesCircle color="red" /> No
                    </div>
                ),
        },
    ];

    const fetchData = async () => {
        setLoading(true); // Show loading popup
        try {
            const responseSchedule = await axios.get(
                apiUrls.schedule
            );
            setSchedule(responseSchedule.data);;

            const responseTask = await axios.get(
                apiUrls.task,
            );
            setTasks(responseTask.data);
            setRecords(responseTask.data);
            setFilterRecords(responseTask.data);

            const responseAip = await axios.get(
                apiUrls.aip
            );
            setAips(responseAip.data);

            const responseGuardian = await axios.get(
                apiUrls.guardian,
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

    const [records, setRecords] = useState([]);
    const [filterRecords, setFilterRecords] = useState([]);

    const handleFilter = (event) => {
        const newData = filterRecords.filter((row) =>
            row.name.toLowerCase().includes(event.target.value.toLowerCase()),
        );
        setRecords(newData);
    };

    return (
        <div className={cx('data-view')}>
            <h2>Dữ liệu tổng quát công việc</h2>
            <div className={cx('header-data-view')}></div>
            <DataTable columns={column} data={records} pagination></DataTable>
            {loading && <LoadingPopup />}
        </div>
    );
}

export default DataViewCalender;
