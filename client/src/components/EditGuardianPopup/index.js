import classNames from 'classnames/bind';
import styles from './EditGuardianPopup.module.scss';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { parse, format } from 'date-fns';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function EditGuardianPopup(props) {
    const selectedData = props.selectedData;

    const handleSelectedDataChange = props.handleSelectedDataChange;

    const updateData = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${apiUrls.guardian}/${selectedData._id}`,
                selectedData,
            );
            console.log(response.data); // Handle the response from the API
            props.onGuardianUpdated();
            props.setTrigger(false);
        } catch (error) {
            console.error(error); // Handle the error
        }
    };

    const handleChange = (name, value) => {
        if (name === 'dateOfBirth') {
            const parsedDate = new Date(value);
            const formattedDate = `${parsedDate.getDate()}/${
                parsedDate.getMonth() + 1
            }/${parsedDate.getFullYear()}`;
            handleSelectedDataChange((prevData) => ({
                ...prevData,
                [name]: formattedDate,
            }));
        } else {
            handleSelectedDataChange((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    function stringToDate(dateString) {
        return parse(dateString, 'dd/MM/yyyy', new Date());
    }

    const dateOfBirthNew = stringToDate(selectedData.dateOfBirth);

    return props.trigger ? (
        <div className={cx('popup')}>
            <div className={cx('popup-inner')}>
                <button
                    className={cx('btn-close')}
                    onClick={() => props.setTrigger(false)}
                >
                    Close
                </button>

                <form noValidate onSubmit={updateData}>
                    <h3>Edit Guardian Information</h3>

                    {/* First name */}
                    <div>
                        <label htmlFor="firstName">First name</label>
                        <input
                            name="firstName"
                            placeholder="First name"
                            value={selectedData.firstName}
                            onChange={(e) =>
                                handleChange('firstName', e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Last name */}
                    <div>
                        <label htmlFor="lastName">Last name</label>
                        <input
                            name="lastName"
                            placeholder="Last name"
                            value={selectedData.lastName}
                            onChange={(e) =>
                                handleChange('lastName', e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Date of birth */}
                    <div style={{ marginBottom: -10 }}>
                        <label htmlFor="dateOfBirth">Date of birth</label>
                        <br />
                        <DatePicker
                            id="dateOfBirth"
                            selected={dateOfBirthNew}
                            onChange={(date) =>
                                handleChange('dateOfBirth', date)
                            }
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
                            value={selectedData.CCCD}
                            onChange={(e) =>
                                handleChange('CCCD', e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Phone number */}
                    <div>
                        <label htmlFor="phoneNumber">Phone number</label>
                        <input
                            name="phoneNumber"
                            placeholder="Phone number"
                            value={selectedData.phoneNumber}
                            onChange={(e) =>
                                handleChange('phoneNumber', e.target.value)
                            }
                            required
                        />
                    </div>
                    {/* Address */}
                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            name="address"
                            placeholder="Address"
                            value={selectedData.address}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label htmlFor="level">Level</label>
                        <select
                            id="level"
                            value={selectedData.level}
                            onChange={(e) =>
                                handleChange('level', e.target.value)
                            }
                        >
                            <option value="Amateur">Amateur</option>
                            <option value="Professional">Professional</option>
                        </select>
                    </div>

                    <button type="submit" style={{ padding: '4px 10px' }}>
                        Update
                    </button>
                </form>
            </div>
        </div>
    ) : (
        ''
    );
}

export default EditGuardianPopup;
