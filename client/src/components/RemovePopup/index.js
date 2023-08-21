import classNames from 'classnames/bind';
import styles from './RemovePopup.module.scss';


const cx = classNames.bind(styles);

function RemovePopup(props) {

    return props.trigger ? (
        <div className={cx('popup')}>
            <div className={cx('popup-inner')}>
                <button
                    className={cx('btn-close')}
                    onClick={() => props.setTrigger(false)}
                >
                Close
                </button>

                {props.children}
            </div>
        </div>
    ) : (
        ''
    );
}

export default RemovePopup;
