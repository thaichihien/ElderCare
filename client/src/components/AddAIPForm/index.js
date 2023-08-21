import classNames from 'classnames/bind';
import styles from './AddAIPForm.module.scss';
import axios from 'axios';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function AddAIPForm(props) {
    const [aipData, setAipData] = useState({
        firstName: '',
        lastName: '',
        CCCD: '',
        phoneNumber: '',
        dateOfBirth: null,
        address: '',
        healthStatus: '',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(apiUrls.aip, aipData)
            .then((res) => {
                // Call the callback function to trigger table update in DataViewAIP
                props.onAIPAdded();
                props.onAdd();
                // Reset the form fields
                setAipData({
                    firstName: '',
                    lastName: '',
                    CCCD: '',
                    phoneNumber: '',
                    dateOfBirth: null,
                    address: '',
                    healthStatus: '',
                    note: ''
                });
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (name, value) => {
        if (name === 'dateOfBirth') {
            const parsedDate = new Date(value);
            const formattedDate = `${parsedDate.getDate()}/${
                parsedDate.getMonth() + 1
            }/${parsedDate.getFullYear()}`;
            setAipData((prevData) => ({
                ...prevData,
                [name]: formattedDate,
            }));
        } else {
            setAipData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    function stringToDate(dateString) {
        return parse(dateString, 'dd/MM/yyyy', new Date());
    }

    return props.trigger ? (
        <div className={cx('popup')}>
            <div className={cx('popup-inner')}>
                <button
                    className={cx('btn-close')}
                    onClick={() => props.setTrigger(false)}
                >
                    Close
                </button>

                <h3>ADD AIP</h3>
                <form noValidate onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">First name</label>
                        <input
                            name="firstName"
                            placeholder="First name"
                            value={aipData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            required
                        />
                    </div>
                    {/* Last name */}
                    <div>
                        <label htmlFor="lastName">Last name</label>
                        <input
                            name="lastName"
                            placeholder="Last name"
                            value={aipData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            required
                        />
                    </div>
                    {/* Date of birth */}
                    <div style={{ marginBottom: -10 }}>
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <DatePicker
                            id="dateOfBirth"
                            selected={aipData.dateOfBirth ? stringToDate(aipData.dateOfBirth) : null}
                            onChange={(date) => handleChange('dateOfBirth', date)}
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            placeholderText="Select Date of Birth"
                            className={cx('custom-datepicker')}
                        />
                    </div>
                    {/* CCCD */}
                    <div>
                        <label htmlFor="CCCD">CCCD</label>
                        <input
                            name="CCCD"
                            placeholder="CCCD"
                            value={aipData.CCCD}
                            onChange={(e) => handleChange('CCCD', e.target.value)}
                            required
                        />
                    </div>
                    {/* Phone number */}
                    <div>
                        <label htmlFor="phone">Phone number</label>
                        <input
                            name="phoneNumber"
                            placeholder="Phone number"
                            value={aipData.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            required
                        />
                    </div>
                    {/* Address */}
                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            name="address"
                            placeholder="Address"
                            value={aipData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            required
                        />
                    </div>

                    {/* Health Status */}
                    <div>
                        <label htmlFor="healthStatus">Health status</label>
                        <input
                            name="healthStatus"
                            placeholder="Health status"
                            value={aipData.healthStatus}
                            onChange={(e) =>
                                handleChange('healthStatus', e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label htmlFor="note">Note</label>
                        <input
                            name="note"
                            placeholder="Note"
                            value={aipData.note}
                            onChange={(e) =>
                                handleChange('note', e.target.value)
                            }
                            required
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    ) : (
        ''
    );
}

export default AddAIPForm;
