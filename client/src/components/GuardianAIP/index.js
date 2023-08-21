import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import classNames from 'classnames/bind';
import styles from './GuardianAIP.module.scss';
import RemovePopup from '../RemovePopup';
import GuardianAIPPopup from '../GuardianAIPPopup';
import LoadingPopup from '../LoadingPopup';
import EditGuardianAIP from '../EditGuardianAIP';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function GuardianAIP() {
    const [editPopup, seteditPopup] = useState(false);

    const [selectedData, setSelectedData] = useState({});

    const [guardians, setGuardians] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleEditButton = (row) => {
        setSelectedData(row);
    };

    const handleRemoveButton = async (row) => {
        try {
            if (window.confirm('Are you sure you wish to delete this item?')) {
                await axios.put(`${apiUrls.aip}/unassign/${row._id}`);
                fetchData(); // Refresh the table data after successful deletion
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAIPUpdated = () => {
        fetchData();
    };

    const handleSelectedGuardian = (selectedGuardian) => {};

    const column = [
        {
            name: 'AIP',
            selector: (row) => row.firstName + ' ' + row.lastName,
            sortable: true,
        },
        {
            name: 'Guardian',
            selector: (row) => {
                const guardian = guardians.find(
                    (guardian) => guardian._id === row.guardian,
                );
                return guardian
                    ? guardian.firstName + ' ' + guardian.lastName
                    : 'No Guardian';
            },
        },
        {
            name: 'Edit',
            cell: (row) => (
                <button
                    onClick={() => {
                        handleEditButton(row);
                        seteditPopup(true);
                    }}
                    style={{ width: '60px', height: '30px' }}
                >
                    Edit
                </button>
            ),
        },
        {
            name: 'Remove',
            cell: (row) => (
                <button
                    onClick={() => {
                        handleRemoveButton(row);
                    }}
                    style={{ width: '80px', height: '30px' }}
                >
                    Remove
                </button>
            ),
        },
    ];

    const fetchData = async () => {
        setLoading(true); // Show loading popup
        try {
            const response = await axios.get(
                apiUrls.aip,
            );
            setRecords(response.data.filter((aip) => aip.guardian));
            setFilterRecords(response.data.filter((aip) => aip.guardian));

            const responseGuardians = await axios.get(
                apiUrls.guardian,
            );
            setGuardians(responseGuardians.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Hide loading popup regardless of success or failure
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [popupAdd, setpopupAdd] = useState(false);
    // const [removePopup, setremovePopup] = useState(false);

    const handlePopupAdd = () => {
        setpopupAdd(false);
    };

    const [records, setRecords] = useState([]);
    const [filterRecords, setFilterRecords] = useState([]);

    const handleFilter = (event) => {
        const newData = filterRecords.filter((row) =>
            row.firstName
                .toLowerCase()
                .includes(event.target.value.toLowerCase()),
        );
        setRecords(newData);
    };

    return (
        <div className={cx('data-view')}>
            <h2>Phân công Guardian cho AIP</h2>
            <div className={cx('header-data-view')}>
                <div style={{ margin: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{ padding: '4px' }}
                        onChange={handleFilter}
                    />
                </div>
                <button
                    className={cx('btn-add')}
                    onClick={() => setpopupAdd(true)}
                >
                    Assign
                </button>
            </div>
            <DataTable columns={column} data={records} pagination></DataTable>

            {/* Loading Popup */}
            {loading && <LoadingPopup />}

            {/* Remove */}
            <RemovePopup></RemovePopup>

            <EditGuardianAIP
                trigger={editPopup}
                setTrigger={seteditPopup}
                selectedData={selectedData}
                onAIPUpdated={handleAIPUpdated}
                listGuardians={guardians}
                handleSelectedDataChange={handleEditButton}
            ></EditGuardianAIP>

            <GuardianAIPPopup
                trigger={popupAdd}
                setTrigger={handlePopupAdd}
                onAssigned={handleAIPUpdated}
                listGuardians={guardians}
                onGuardianSelected={handleSelectedGuardian}
            ></GuardianAIPPopup>
        </div>
    );
}

export default GuardianAIP;
