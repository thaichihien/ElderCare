import classNames from 'classnames/bind';
import styles from './GuardianAIPPopup.module.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function GuardianAIPPopup(props) {
    const [loading, setLoading] = useState(false);

    const [aips, setAips] = useState([]);

    const [selectedAIP, setSelectedAIP] = useState(null);

    const [selectedGuardian, setSelectedGuardian] = useState(null);

    const handleAIPChange = (e) => {
        const selectedAIPName = e.target.value;
        const selectedAIPObject = aips.find(
            (aip) => aip.firstName + ' ' + aip.lastName === selectedAIPName,
        );
        setSelectedAIP(selectedAIPObject);
    };

    const handleGuardianChange = (e) => {
        const selectedGuardianName = e.target.value;
        const selectedGuardianObject = props.listGuardians.find(
            (guardian) =>
                guardian.firstName + ' ' + guardian.lastName ===
                selectedGuardianName,
        );
        setSelectedGuardian(selectedGuardianObject);
        props.onGuardianSelected(selectedGuardianObject);
    };

    const fetchData = async () => {
        setLoading(true); // Show loading popup
        try {
            const response = await axios.get(
                apiUrls.aip,
            );
            setAips(response.data.filter((aip) => !aip.guardian));

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Hide loading popup regardless of success or failure
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [putSuccess, setPutSuccess] = useState(false);
    const [putError, setPutError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedAIP && selectedGuardian) {
                const guardianIdAsString = selectedGuardian ? selectedGuardian._id.toString() : '';
                const requestBody = {
                    guardianId: guardianIdAsString,
                };

                console.log("AIP: ", selectedAIP._id);
                console.log("Guardian: ", selectedGuardian._id);

                const response = await axios.put(
                    `${apiUrls.aip}/assign/${selectedAIP._id}`,
                    requestBody,
                );

                if (response.status === 200) {
                    setPutSuccess(true);
                    console.log('DONE');
                    props.onAssigned();
                    props.setTrigger(false);
                }
            }
        } catch (error) {
            setPutError(error);
            console.log('Error:', error.message);
        }
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

                <h3>Assign Guardian to AIP</h3>
                <form noValidate onSubmit={handleSubmit}>
                    <div className={cx('wrap-form')}>
                        <div className={cx('aip-form')}>
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
                                            value={
                                                aip.firstName +
                                                ' ' +
                                                aip.lastName
                                            }
                                        >
                                            {aip.firstName + ' ' + aip.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p>
                                    Health Status:{' '}
                                    {selectedAIP
                                        ? selectedAIP.healthStatus
                                        : ''}
                                </p>
                            </div>
                        </div>

                        <div className={cx('guardian-form')}>
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
                                {props.listGuardians.map((guardian, index) => (
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
                            <div>
                                <p>
                                    Level:{' '}
                                    {selectedGuardian
                                        ? selectedGuardian.level
                                        : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={cx('btn-submit')}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    ) : (
        ''
    );
}

export default GuardianAIPPopup;
