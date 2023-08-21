import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import logo from 'src/assets/images/logoElcare.png';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('header')}>
            <img src={logo}></img>
            <ul className={cx('nav')}>
                <li className={cx('nav-item')}>
                    <a href="#!">Feature</a>
                </li>
                <li className={cx('nav-item')}>
                    <a href="#!">Pricing</a>
                </li>
                <li className={cx('nav-item')}>
                    <a href="#!">Resources</a>
                </li>
                <li className={cx('nav-item')}>
                    <a href="#!">About us</a>
                </li>
            </ul>
        </div>
    );
}

export default Header;
