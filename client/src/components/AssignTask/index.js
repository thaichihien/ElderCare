import axios from 'axios';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AssignTask.module.scss';
import DataTable from 'react-data-table-component';
import AssignTaskAddPopup from '../AssignTaskAddPopup';
import DetailTask from '../DetailTask';
import LoadingPopup from '../LoadingPopup';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function Assign() {
    const [selectedData, setSelectedData] = useState({});

    const [loading, setLoading] = useState(false);

    const [records, setRecords] = useState([]);

    const handleEditButton = (row) => {
        setSelectedData(row);
    };

    const [aipName, setAipName] = useState('');
    const [guardianName, setGuardianName] = useState('');

    const column = [
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Detail',
            selector: (row) => row.detail,
        },
        {
            name: 'Status',
            selector: (row) => (row.isDone ? 'Done' : 'Not'),
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
                    setGuardianName(
                        guardianInfo.firstName + ' ' + guardianInfo.lastName,
                    );
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
                    setAipName(aipInfo.firstName + ' ' + aipInfo.lastName);
                    return aipInfo.firstName + ' ' + aipInfo.lastName;
                } else {
                    return 'Not Found';
                }
            },
        },
        {
            name: 'Note',
            selector: (row) => row.note,
        },
        {
            name: 'Detail',
            cell: (row) => (
                <button
                    onClick={() => {
                        handleEditButton(row);
                        setpopupDetail(true);
                    }}
                    style={{ width: '80px', height: '30px' }}
                >
                    Detail
                </button>
            ),
        },
    ];

    const [dataLoaded, setDataLoaded] = useState(false);
    const [guardians, setGuardians] = useState([]);
    const [aips, setAip] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const responseTasks = await axios.get(
                apiUrls.task,
            );
            setRecords(responseTasks.data);
            setFilterRecords(responseTasks.data);

            const responseGuardians = await axios.get(
                apiUrls.guardian,
            );
            setGuardians(responseGuardians.data);

            const responseAip = await axios.get(
                apiUrls.aip,
            );
            setAip(responseAip.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setDataLoaded(true); // Set dataLoaded after the state updates
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [filterRecords, setFilterRecords] = useState([]);
    const [searchAttribute, setSearchAttribute] = useState('title');

    const handleFilter = (event) => {
        const newData = filterRecords.filter((row) =>
            row[searchAttribute]
                .toLowerCase()
                .includes(event.target.value.toLowerCase()),
        );
        setRecords(newData);
    };

    const handleAssignTaskAdded = () => {
        fetchData();
    };

    const [popupAdd, setpopupAdd] = useState(false);
    const [popupDetail, setpopupDetail] = useState(false);

    const handlePopupAdd = () => {
        setpopupAdd(false);
    };

    return (
        <div className={cx('data-view')}>
            <h2>Assign Task</h2>
            <div className={cx('header-data-view')}>
                <div style={{ margin: '10px' }}>
                    <input
                        type="text"
                        placeholder={`Search by ${searchAttribute}...`}
                        style={{ padding: '4px' }}
                        onChange={handleFilter}
                    />
                </div>
                <button
                    className={cx('btn-add')}
                    onClick={() => setpopupAdd(true)}
                >
                    Add more task
                </button>
            </div>
            {/* {dataLoaded ? (
                
            ) : (
                <p>Loading data...</p>
            )} */}
            <DataTable columns={column} data={records} pagination />

            {/* Loading Popup */}
            {loading && <LoadingPopup />}
            {/* Add AIP */}
            <AssignTaskAddPopup
                trigger={popupAdd}
                setTrigger={setpopupAdd}
                onAssignTaskAdded={handleAssignTaskAdded}
                onAdd={handlePopupAdd}
                aipData={aips}
                guardianData={guardians}
            ></AssignTaskAddPopup>

            <DetailTask
                trigger={popupDetail}
                setTrigger={setpopupDetail}
                selectedData={selectedData}
                aipName={aipName}
                guardianName={guardianName}
            ></DetailTask>
        </div>
    );
}

export default Assign;
