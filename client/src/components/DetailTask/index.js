import classNames from 'classnames/bind';
import styles from './DetailTask.module.scss';
import { format } from 'date-fns';
import moment from 'moment';

const cx = classNames.bind(styles);

function DetailTask(props) {
    moment.locale('en');

    const selectedData = props.selectedData;
    const aipName = props.aipName;
    const guardianName = props.guardianName;

    return props.trigger ? (
        <div className={cx('popup')}>
            <div className={cx('popup-inner')}>
                <button
                    className={cx('btn-close')}
                    onClick={() => props.setTrigger(false)}
                >
                    Close
                </button>

                <h3>Detail</h3>

                <div className={cx('wrap-detail')}>
                    <div className={cx('detail-title')}>
                        <ul className={cx('ul-1')}>
                            <li>Title:</li>
                            <li>Detail:</li>
                            <li>Status:</li>
                            <li>Guardian:</li>
                            <li>AIP: </li>
                            <li>Cycle: </li>
                            <li>Note: </li>
                        </ul>
                        <ul className={cx('ul-2')}>
                            <li>{selectedData.title}</li>
                            <li>{selectedData.detail}</li>
                            <li>{selectedData.isDone ? 'Done' : 'Not'}</li>
                            <li>{guardianName}</li>
                            <li>{aipName}</li>
                            <li>{selectedData.isCycle ? 'Yes' : 'No'}</li>
                            <li>{selectedData.note}</li>
                        </ul>
                    </div>
                    <img
                        className={cx('image')}
                        src={selectedData.image.link}
                        alt="Images"
                    ></img>
                    <div className={cx('address')}>
                        Address: {selectedData.image.address}
                    </div>
                    <div className={cx('address')}>
                        Time:{' '}
                        {format(
                            new Date(selectedData.image.time),
                            'MMMM d yyyy HH:mm',
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        ''
    );
}

export default DetailTask;
