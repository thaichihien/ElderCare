import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import classNames from 'classnames/bind';
import styles from './DataViewGuardian.module.scss';
import AddGuardianForm from '../AddGuardianForm';
import EditGuardianPopup from '../EditGuardianPopup';
import RemovePopup from '../RemovePopup';
import LoadingPopup from '../LoadingPopup';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function DataViewGuardian() {
    const [popupAdd, setpopupAdd] = useState(false);

    const [editPopup, seteditPopup] = useState(false);

    const [selectedData, setSelectedData] = useState({});

    const [loading, setLoading] = useState(false);

    const handleEditButton = (row) => {
        setSelectedData(row);
    };

    const handleRemoveButton = async (row) => {
        try {
            if (window.confirm('Are you sure you wish to delete this item?')) {
                await axios.delete(
                    apiUrls.guardian + row.id,
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
        },
        {
            name: 'CCCD',
            selector: (row) => row.CCCD,
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
            name: 'Level',
            selector: (row) => row.level,
            sortable: true
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                apiUrls.guardian,
            );
            setRecords(response.data);
            setFilterRecords(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePopupAdd = () => {
        setpopupAdd(false);
    };

    const handleGuardianAdded = () => {
        fetchData();
    };

    const handleGuardianUpdated = () => {
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

    const [searchAttribute, setSearchAttribute] = useState('firstName');

    const handleSearchAttributeChange = (event) => {
        setSearchAttribute(event.target.value);
    };

    const columnsWithCertificate = [
        ...column,
        {
            name: 'Certificate',
            cell: (row) => (
                <div>
                    {row.certificates && row.certificates.length > 0 ? (
                        <ul>
                            {row.certificates.map((certificate) => (
                                <li key={certificate._id}>
                                    {certificate.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No certificates</p>
                    )}
                </div>
            ),
        },
        {
            name: 'Content of Certificate',
            cell: (row) => (
                <div>
                    {row.certificates && row.certificates.length > 0 ? (
                        <ul>
                            {row.certificates.map((certificate) => (
                                <li key={certificate._id}>
                                    {certificate.description}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No certificates</p>
                    )}
                </div>
            ),
        },
        {
            name: 'Edit',
            cell: (row) => (
                <div>
                    <button
                        onClick={() => {
                            handleEditButton(row);
                            seteditPopup(true);
                        }}
                        style={{ width: '60px', height: '30px' }}
                    >
                        Edit
                    </button>
                </div>
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

    return (
        <div className={cx('data-view')}>
            <h2>Dữ liệu tổng quát Guardian</h2>
            <div className={cx('header-data-view')}>
                <div style={{ margin: '10px' }}>
                    <input
                        type="text"
                        placeholder={`Search by ${searchAttribute}...`}
                        style={{ padding: '4px', width: '250px' }}
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
                    Add Guardian
                </button>
            </div>
            <DataTable
                columns={columnsWithCertificate}
                data={records}
                pagination
            ></DataTable>

            {/* Loading Popup */}
            {loading && <LoadingPopup />}

            {/* Remove */}
            <RemovePopup></RemovePopup>

            {/* Edit */}
            <EditGuardianPopup
                trigger={editPopup}
                setTrigger={seteditPopup}
                selectedData={selectedData}
                onGuardianUpdated={handleGuardianUpdated}
                handleSelectedDataChange={handleEditButton}
            ></EditGuardianPopup>

            {/* Add AIP */}
            <AddGuardianForm
                trigger={popupAdd}
                setTrigger={setpopupAdd}
                onGuardianAdded={handleGuardianAdded}
                onAdd={handlePopupAdd}
            ></AddGuardianForm>
        </div>
    );
}

export default DataViewGuardian;
