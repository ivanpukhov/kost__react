import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../AuthContext';
import EstablishmentList from './EstablishmentList';
import EstablishmentDetails from './EstablishmentDetails';
import {Link} from "react-router-dom";

const Main = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        fetchAllCategoriesAndTheirEstablishments();
    }, []);

    const fetchAllCategoriesAndTheirEstablishments = async () => {
        try {
            const categoriesResponse = await axios.get('https://rev.greenman.kz/api/categories/');
            const categories = categoriesResponse.data;

            const promises = categories.map(category =>
                axios.get(`https://rev.greenman.kz/api/establishments?categoryId=${category.id}&best=4`)
                    .then(response => ({
                        ...category,
                        establishments: response.data
                    }))
            );

            Promise.all(promises).then(results => {
                setCategoryData(results);
            });
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    const handleEstablishmentClick = (establishment) => {
        setSelectedEstablishment(establishment);
        setIsOpen(true);
    };

    return (
        <div>
            {categoryData.map(category => (
                <>
                    <main key={category.id} className="main">
                        <EstablishmentList
                            title={`Лучшие ${category.name}` || 'Заведения'}
                            establishments={category.establishments}
                            onEstablishmentClick={handleEstablishmentClick}
                        />


                        {selectedEstablishment && (
                            <EstablishmentDetails
                                key={`${category.id}-${selectedEstablishment.id}`}
                                selectedEstablishment={selectedEstablishment}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                isAuthenticated={isAuthenticated}
                                fetchEstablishments={() => fetchAllCategoriesAndTheirEstablishments()}
                            />
                        )}

                    </main>
                    <Link className='main__link' to={`/category/${category.id}`}>Все {category.name}</Link>

                </>
            ))}
        </div>
    );
};

export default Main;
