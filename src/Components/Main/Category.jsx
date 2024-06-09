import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import EstablishmentList from './EstablishmentList';
import EstablishmentDetails from './EstablishmentDetails';

const Category = () => {
    const [establishments, setEstablishments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [currentCategory, setCurrentCategory] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { categoryId } = useParams(); // Получаем ID категории из URL

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if(categories.length > 0) {
            const category = categories.find(c => c.id.toString() === categoryId);
            if(category) {
                setCurrentCategory(category.name);
                fetchEstablishments(categoryId);
            }
        }
    }, [categoryId, categories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://rev.greenman.kz/api/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка категорий:', error);
        }
    };

    const fetchEstablishments = async (categoryId) => {
        try {
            const response = await axios.get(`https://rev.greenman.kz/api/establishments?categoryId=${categoryId}`);
            setEstablishments(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка заведений:', error);
        }
    };

    const handleEstablishmentClick = (establishment) => {
        setSelectedEstablishment(establishment);
        setIsOpen(true);
    };

    return (
        <main className="main">
            <EstablishmentList
                title={currentCategory || 'Заведения'} // Используем название категории или запасной вариант
                establishments={establishments}
                onEstablishmentClick={handleEstablishmentClick}
            />

            {selectedEstablishment && (
                <EstablishmentDetails
                    selectedEstablishment={selectedEstablishment}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isAuthenticated={isAuthenticated}
                    fetchEstablishments={() => fetchEstablishments(categoryId)} // Обновленный fetchEstablishments
                />
            )}
        </main>

    );
};

export default Category;
