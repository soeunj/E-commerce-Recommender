import React from 'react';

import marketLogo from '../../assets/images/logo.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={marketLogo} alt="MyLogo" />
    </div>
);

export default logo;