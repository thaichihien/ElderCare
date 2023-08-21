import classNames from 'classnames/bind';

import styles from './Login.module.scss';

import logo from 'src/assets/images/logoElcare.png';
import leftImage from 'src/assets/images/leftImageLogin.png';
import rightImage from 'src/assets/images/rightImageLogin.png';
import Form from '~/components/Form';

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('app-login')}>
            <div className={cx('logo')}>
                <img src={logo}></img>
            </div>
            {/* Form */}
            <div className={cx('main-form')}>
                <div className={cx('logo-left')}>
                    <img src={leftImage}></img>
                </div>
                <Form />
                <div className={cx('logo-right')}>
                    <img src={rightImage}></img>
                </div>
            </div>
        </div>
    );
}

export default Login;
