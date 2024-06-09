import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';

import iconHome from '../img/bottom_bar/home.svg';
import iconHomeOp from '../img/bottom_bar/homeOp.svg';
import iconCart from '../img/bottom_bar/Star.svg';
import iconCartOp from '../img/bottom_bar/StarOp.svg';
import iconCatalog from '../img/bottom_bar/catalog.svg';
import iconCatalogOp from '../img/bottom_bar/catalogOp.svg';
import iconProfile from '../img/bottom_bar/profile.svg';
import iconProfileOp from '../img/bottom_bar/profileOp.svg';

const BottomBar = () => {
    const location = useLocation();

    const getIcon = (isActive, icon, iconOp) => {
        return isActive ? icon : iconOp;
    };


    return (<div className="bar">


        <NavLink to="/" className="bar__item">
            {({isActive}) => (<>
                <div className="bar__icon">
                    <img src={getIcon(isActive, iconHome, iconHomeOp)} alt="Главная"/>
                </div>
                <div className={`bar__text ${isActive ? 'bar__text-green' : ''}`}>
                    Главная
                </div>
            </>)}
        </NavLink>

        <NavLink to="/catalog" className="bar__item">
            {({isActive}) => (<>
                <div className="bar__icon">
                    <img src={getIcon(isActive, iconCatalog, iconCatalogOp)} alt="Каталог"/>
                </div>
                <div className={`bar__text ${isActive ? 'bar__text-green' : ''}`}>
                    Каталог
                </div>
            </>)}
        </NavLink>

        <NavLink to="/reviews" className="bar__item">
            {({isActive}) => (<>
                <div className="bar__icon">
                    <img src={getIcon(isActive, iconCart, iconCartOp)} alt="Корзина"/>
                </div>
                <div className={`bar__text ${isActive ? 'bar__text-green' : ''}`}>
                    Отзывы
                </div>
            </>)}
        </NavLink>

        <NavLink to="/profile" className="bar__item">
            {({isActive}) => (<>
                <div className="bar__icon">
                    <img src={getIcon(isActive, iconProfile, iconProfileOp)} alt="Профиль"/>
                </div>
                <div className={`bar__text ${isActive ? 'bar__text-green' : ''}`}>
                    Профиль
                </div>
            </>)}
        </NavLink>
    </div>);
}

export default BottomBar;
