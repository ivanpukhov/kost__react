import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resto from '../../img/resto.png';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('https://rev.greenman.kz/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Ошибка при получении данных: ", error));
    }, []);

    return (
        <main className="main">
            <div className="main__container">
                <Link to={"/category/"} className="main__block">
                    <div className="main__block-img">
                        <img src={resto} alt="Все категории"/>
                    </div>
                    <div className="main__block-text">Все категории</div>
                </Link>
                {categories.map((category) => (
                    <Link key={category.id} to={`/category/${category.id}`} className="main__block">
                        <div className="main__block-img">
                            <img src={resto} alt={category.name}/>
                        </div>
                        <div className="main__block-text">{category.name}</div>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Categories;
