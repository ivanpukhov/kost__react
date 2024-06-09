import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../AuthContext';
import EstablishmentList from './EstablishmentList';
import EstablishmentDetails from './EstablishmentDetails';
const AllCategories = () => {
    const [establishments, setEstablishments] = useState([]);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const {isAuthenticated} = useAuth();


    useEffect(() => {
        fetchEstablishments();
    }, []);

    const fetchEstablishments = async () => {
        try {
            const response = await axios.get('https://rev.greenman.kz/api/establishments');
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
                    title={'Все заведения'}
                    establishments={establishments}
                    onEstablishmentClick={handleEstablishmentClick}
                />

                {selectedEstablishment && (
                    <EstablishmentDetails
                        selectedEstablishment={selectedEstablishment}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        isAuthenticated={isAuthenticated}
                        fetchEstablishments={fetchEstablishments}
                    />
                )}
        </main>

    );
};

export default AllCategories;
