import classNames from "classnames/bind";
import styles from "./HeaderDashboard.module.scss"

import logo from "src/assets/images/logo_dashboard.png"

const cx = classNames.bind(styles);

function HeaderDashboard() {
    return ( 
        <div className={cx('header')}>
            <img src={logo}/>
        </div>
     );
}

export default HeaderDashboard;