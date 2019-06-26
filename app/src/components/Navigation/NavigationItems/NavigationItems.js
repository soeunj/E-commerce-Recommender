import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" active>Home</NavigationItem>
        <NavigationItem link="/">My Analysis</NavigationItem>
        <NavigationItem link="/">Recommendation</NavigationItem>
        <NavigationItem link="/">Login</NavigationItem>
    </ul>
);

export default navigationItems;