import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import classNames from 'classnames/bind';
import styles from './DataViewAIP.module.scss';
import AddAIPForm from '../AddAIPForm';
import RemovePopup from '../RemovePopup';
import EditPopup from '../EditAIPPopup';
import LoadingPopup from '../LoadingPopup';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function DataViewAIP() {
    const [selectedData, setSelectedData] = useState({});

    const [loading, setLoading] = useState(false);

    const handleEditButton = (row) => {
        setSelectedData(row);
    };

    const handleRemoveButton = async (row) => {
        try {
            if (window.confirm('Are you sure you wish to delete this item?')) {
                await axios.delete(
                    `${apiUrls.aip}/${row._id}`,
                );
                fetchData(); // Refresh the table data after successful deletion
            }
        } catch (error) {
            console.log(error);
        }
    };

    const column = [
        {
            name: 'First Name',
            selector: (row) => row.firstName,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.lastName,
            // sorttable: true
        },
        {
            name: 'CCCD',
            selector: (row) => row.CCCD,
            // sorttable: true
        },
        {
            name: 'Date of birth',
            selector: (row) => row.dateOfBirth,
        },
        {
            name: 'Phone number',
            selector: (row) => row.phoneNumber,
        },
        {
            name: 'Address',
            selector: (row) => row.address,
        },
        {
            name: 'Health Status',
            selector: (row) => row.healthStatus,
        },
        {
            name: 'Note',
            selector: (row) => row.note,
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
            const response = await axios.get(apiUrls.aip);
            setRecords(response.data);
            setFilterRecords(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Hide loading popup regardless of success or failure
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAIPAdded = () => {
        fetchData();
    };

    const handleAIPUpdated = () => {
        fetchData();
    };

    const [records, setRecords] = useState([]);
    const [filterRecords, setFilterRecords] = useState([]);

    const handleFilter = (event) => {
        const newData = filterRecords.filter((row) =>
            row[searchAttribute]
                .toLowerCase()
                .includes(event.target.value.toLowerCase()),
        );
        setRecords(newData);
    };

    const [popupAdd, setpopupAdd] = useState(false);
    // const [removePopup, setremovePopup] = useState(false);
    const [editPopup, seteditPopup] = useState(false);

    const handlePopupAdd = () => {
        setpopupAdd(false);
    };

    const [searchAttribute, setSearchAttribute] = useState('firstName');

    const handleSearchAttributeChange = (event) => {
        setSearchAttribute(event.target.value);
    };

    return (
        <div className={cx('data-view')}>
            <h2>Dữ liệu tổng quát AIP</h2>
            <div className={cx('header-data-view')}>
                <div style={{ margin: '10px' }}>
                    <input
                        type="text"
                        placeholder={`Search by ${searchAttribute}...`}
                        style={{ padding: '4px', width:'250px' }}
                        onChange={handleFilter}
                    />

                    <select
                        value={searchAttribute}
                        onChange={handleSearchAttributeChange}
                        className={cx('select-item')}
                    >
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="CCCD">CCCD</option>
                        <option value="dateOfBirth">Date of Birth</option>
                        <option value="phoneNumber">Phone number</option>
                        <option value="address">Address</option>
                        {/* Add more options for other attributes */}
                    </select>
                </div>
                <button
                    className={cx('btn-add')}
                    onClick={() => setpopupAdd(true)}
                >
                    ADD AIP
                </button>
            </div>
            <DataTable columns={column} data={records} pagination></DataTable>

            {/* Loading Popup */}
            {loading && <LoadingPopup/>}

            {/* Remove */}
            <RemovePopup></RemovePopup>

            {/* Edit */}
            <EditPopup
                trigger={editPopup}
                setTrigger={seteditPopup}
                selectedData={selectedData}
                onAIPUpdated={handleAIPUpdated}
                handleSelectedDataChange={handleEditButton}
            ></EditPopup>

            {/* Add AIP */}
            <AddAIPForm
                trigger={popupAdd}
                setTrigger={setpopupAdd}
                onAIPAdded={handleAIPAdded}
                onAdd={handlePopupAdd}
            ></AddAIPForm>
        </div>
    );
}

export default DataViewAIP;
