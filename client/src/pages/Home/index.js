import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '~/components/Header';

import leftImage from 'src/assets/images/home_left_people.png';
import rightImage from 'src/assets/images/home_right_people.png';
import Footer from '~/components/Footer';

const cx = classNames.bind(styles);

function HomePage() {
    return (
        <div>
            <Header />

            {/* Main page */}
            <div className={cx('body')}>
                <div className={cx('welcome-body')}>
                    <img src={leftImage} className={cx('left-image')}></img>
                    <div className={cx('middle')}>
                        <div className={cx('title')}>
                            Eldercare là hệ thống quản lí nhân viên chăm sóc
                            người già tại nhà
                        </div>
                        <button className={cx('btn-start')} onClick={() => {}}>Start</button>
                    </div>
                    <img src={rightImage} className={cx('right-image')}></img>
                </div>
            </div>

            <Footer/>
        </div>
    );
}

export default HomePage;
