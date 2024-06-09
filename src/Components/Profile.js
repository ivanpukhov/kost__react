import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import resto from '../img/resto.png';

const Profile = () => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth'); // Измените на актуальный путь к вашей странице аутентификации
        }

        fetch('https://rev.greenman.kz/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Ошибка при получении данных: ", error));
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div>

            <main className="main profile">

                <div className="main__container">
                    <h2>Профиль пользователя</h2>

                    <Link to={"/reviews/"} className="main__block">
                        <div className="main__block-img">
                            <img src={resto} alt="Все категории"/>
                        </div>
                        <div className="main__block-text">Все <br/> отзывы</div>
                    </Link>
                    {categories.map((category) => (
                        <Link key={category.id} to={`/review/category/${category.id}`} className="main__block">
                            <div className="main__block-img">
                                <img src={resto} alt={category.name}/>
                            </div>
                            <div className="main__block-text">Отзывы категория <br/>{category.name}</div>
                        </Link>
                    ))}
                </div>
            </main>
            <button className="logout" onClick={handleLogout}>Выйти</button>

        </div>
    );
};

export default Profile;
