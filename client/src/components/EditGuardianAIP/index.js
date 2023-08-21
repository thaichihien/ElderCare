import classNames from 'classnames/bind';
import styles from './EditGuardianAIP.module.scss';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { set } from 'date-fns';
import apiUrls from '~/apiUrls';

const cx = classNames.bind(styles);

function EditGuardianAIP(props) {
    const selectedData = props.selectedData;

    const [selectedGuardian, setSelectedGuardian] = useState(null);

    useEffect(() => {
        const guardianObject = props.listGuardians.find(
            (guardian) => selectedData.guardian === guardian._id
        );
        setSelectedGuardian(guardianObject);
    }, [selectedData.guardian, props.listGuardians]);

    const handleGuardianChange = (e) => {
        const selectedGuardianName = e.target.value;
        const selectedGuardianObject = props.listGuardians.find(
            (guardian) =>
                guardian.firstName + ' ' + guardian.lastName ===
                selectedGuardianName,
        );
        setSelectedGuardian(selectedGuardianObject);
        selectedData.guardian = selectedGuardian._id;
    };

    const updateData = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                guardianId: selectedGuardian._id,
            };

            const response = await axios.put(
                `${apiUrls.aip}/assign/${selectedData._id}`,
                requestBody,
            );
            props.onAIPUpdated();
            props.setTrigger(false);
        } catch (error) {
            console.error(error);
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

                <h3>Re-Assign</h3>

                <form noValidate onSubmit={updateData}>
                    <div className={cx('aip-form')}>
                        <div>
                            <label htmlFor="aip">AIP</label>
                            <div>
                                {selectedData.firstName +
                                    ' ' +
                                    selectedData.lastName}
                            </div>
                        </div>
                        <div>
                            <p>Health Status: {selectedData.healthStatus}</p>
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
                                {selectedGuardian ? selectedGuardian.level : ''}
                            </p>
                        </div>
                    </div>

                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    ) : (
        ''
    );
}

export default EditGuardianAIP;
