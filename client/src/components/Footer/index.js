import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

import logo from 'src/assets/images/logo_footer.png'

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const cx = classNames.bind(styles);

function Footer() {
    return <div className={cx('footer')}>
        <div className={cx('logo')}>
            <img src={logo}/>
        </div>
        <div className='social'>
            <ul className={cx('social-contact')}>
                <li className={cx('social-item')}>
                    <a href='#!'>
                    <FaFacebookF className={cx('social-icon')} color='#ccc'/>
                    </a>
                </li>
                <li className={cx('social-item')}>
                    <a href='#!'>
                    <FaInstagram className={cx('social-icon')} color='#ccc'/>
                    </a>
                </li>
                <li className={cx('social-item')}>
                    <a href='#!'>
                    <FaLinkedinIn className={cx('social-icon')} color='#ccc'/>
                    </a>
                </li>
                <li className={cx('social-item')}>
                    <a href='#!'>
                    <FaTwitter className={cx('social-icon')} color='#ccc'/>
                    </a>
                </li>
                <li className={cx('social-item')}>
                    <a href='#!'>
                    <FaYoutube className={cx('social-icon')} color='#ccc'/>
                    </a>
                </li>
            </ul>
        </div>
    </div>;
}

export default Footer;
