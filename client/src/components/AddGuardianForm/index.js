import classNames from 'classnames/bind';
import styles from './AddGuardian.module.scss';
import axios from 'axios';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import apiUrls from '~/apiUrls';


const cx = classNames.bind(styles);

function AddGuardianForm(props) {
    const [guardianData, setGuardianData] = useState({
        firstName: '',
        lastName: '',
        CCCD: '',
        phoneNumber: '',
        dateOfBirth: null,
        address: '',
        level: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(apiUrls.guardian, guardianData)
            .then((res) => {
                // Call the callback function to trigger table update in DataViewAIP
                props.onGuardianAdded();
                props.onAdd();
                // Reset the form fields
                setGuardianData({
                    firstName: '',
                    lastName: '',
                    CCCD: '',
                    phoneNumber: '',
                    dateOfBirth: null,
                    address: '',
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
            setGuardianData((prevData) => ({
                ...prevData,
                [name]: formattedDate,
            }));
        } else {
            setGuardianData((prevData) => ({
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
                    style={{ padding: '4px', width: '80px' }}
                >
                    Close
                </button>

                <h3>ADD Guardian</h3>
                <form noValidate onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">First name</label>
                        <input
                            name="firstName"
                            placeholder="First name"
                            value={guardianData.firstName}
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
                            value={guardianData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            required
                        />
                    </div>
                    {/* Date of birth */}
                    <div style={{ marginBottom: -10 }}>
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <DatePicker
                            id="dateOfBirth"
                            selected={guardianData.dateOfBirth ? stringToDate(guardianData.dateOfBirth) : null}
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
                            value={guardianData.CCCD}
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
                            value={guardianData.phoneNumber}
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
                            value={guardianData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label htmlFor="level">Level</label>
                        <select
                            id="level"
                            value={guardianData.level}
                            onChange={(e) => handleChange('level', e.target.value)}
                        >
                            <option value="Amateur">Amateur</option>
                            <option value="Professional">Professional</option>
                        </select>
                    </div>

                    <button type="submit" style={{ padding: '4px 20px' }}>
                        ADD
                    </button>
                </form>
            </div>
        </div>
    ) : (
        ''
    );
}

export default AddGuardianForm;
