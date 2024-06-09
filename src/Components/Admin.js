import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Select, List } from 'antd';
import Sheet from 'react-modal-sheet';
import Swal from 'sweetalert2';

const { Option } = Select;

const CategoriesAndEstablishments = () => {
    const [categories, setCategories] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newEstablishment, setNewEstablishment] = useState({ name: '', address: '', phoneNumber: '', photo: '', CategoryId: '' });
    const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
    const [isEstablishmentSheetOpen, setIsEstablishmentSheetOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingEstablishment, setEditingEstablishment] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchEstablishments();
    }, []);

    const fetchCategories = async () => {
        const response = await axios.get('https://rev.greenman.kz/api/categories');
        setCategories(response.data);
    };

    const fetchEstablishments = async () => {
        const response = await axios.get('https://rev.greenman.kz/api/establishments');
        const establishmentsWithCategory = await Promise.all(response.data.map(async (establishment) => {
            const category = categories.find(c => c.id === establishment.CategoryId);
            return { ...establishment, categoryName: category ? category.name : 'Нет категории' };
        }));
        setEstablishments(establishmentsWithCategory);
    };

    const handleCreateCategory = async () => {
        await axios.post('https://rev.greenman.kz/api/categories', { name: newCategoryName });
        setNewCategoryName('');
        fetchCategories();
        Swal.fire('Готово!', 'Категория создана.', 'success');
    };

    const handleDeleteCategory = async (categoryId) => {
        await axios.delete(`https://rev.greenman.kz/api/categories/${categoryId}`);
        fetchCategories();
        Swal.fire('Удалено!', 'Категория удалена.', 'info');
    };

    const handleCreateEstablishment = async () => {
        await axios.post('https://rev.greenman.kz/api/establishments', newEstablishment);
        setNewEstablishment({ name: '', address: '', phoneNumber: '', photo: '', CategoryId: '' });
        fetchEstablishments();
        Swal.fire('Готово!', 'Заведение создано.', 'success');
    };

    const handleDeleteEstablishment = async (establishmentId) => {
        await axios.delete(`https://rev.greenman.kz/api/establishments/${establishmentId}`);
        fetchEstablishments();
        Swal.fire('Удалено!', 'Заведение удалено.', 'info');
    };

    const openEditCategoryModal = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
        setIsCategorySheetOpen(true);
    };

    const openEditEstablishmentModal = (establishment) => {
        setEditingEstablishment(establishment);
        setNewEstablishment({ ...establishment, CategoryId: establishment.CategoryId.toString() });
        setIsEstablishmentSheetOpen(true);
    };

    const handleEditCategory = async () => {
        await axios.put(`https://rev.greenman.kz/api/categories/${editingCategory.id}`, { name: newCategoryName });
        setIsCategorySheetOpen(false);
        setNewCategoryName('');
        fetchCategories();
        Swal.fire('Обновлено!', 'Категория обновлена.', 'success');
    };

    const handleEditEstablishment = async () => {
        await axios.put(`https://rev.greenman.kz/api/establishments/${editingEstablishment.id}`, newEstablishment);
        setIsEstablishmentSheetOpen(false);
        setNewEstablishment({ name: '', address: '', phoneNumber: '', photo: '', CategoryId: '' });
        fetchEstablishments();
        Swal.fire('Обновлено!', 'Заведение обновлено.', 'success');
    };

    const handleSelectChange = (value) => {
        setNewEstablishment({ ...newEstablishment, CategoryId: value });
    };

    return (
        <div  style={{ padding: '50px 20px' }}>
            <h2 style={{ textAlign: 'left' }}>Категории</h2>
            <label>Добавить категорию</label>
            <Input placeholder="Введите название категории" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={{ margin: '10px 0' }} />
            <Button onClick={handleCreateCategory} type="primary" block>Создать категорию</Button>

            <List
                dataSource={categories}
                renderItem={category => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => openEditCategoryModal(category)}>Изменить</Button>,
                            <Button type="link" onClick={() => handleDeleteCategory(category.id)}>Удалить</Button>
                        ]}
                    >
                        {category.name}
                    </List.Item>
                )}
            />

            <h2 style={{ textAlign: 'left', marginTop: '20px' }}>Заведения</h2>

            <label>Добавить заведение</label>
            <Input placeholder="Введите название заведения" value={newEstablishment.name} onChange={(e) => setNewEstablishment({ ...newEstablishment, name: e.target.value })} style={{ margin: '10px 0' }} />
            <label>Адрес</label>
            <Input placeholder="Введите адрес" value={newEstablishment.address} onChange={(e) => setNewEstablishment({ ...newEstablishment, address: e.target.value })} style={{ margin: '10px 0' }} />
            <label>Телефон</label>
            <Input placeholder="Введите телефон" value={newEstablishment.phoneNumber} onChange={(e) => setNewEstablishment({ ...newEstablishment, phoneNumber: e.target.value })} style={{ margin: '10px 0' }} />
            <label>Фото (URL)</label>
            <Input placeholder="Введите URL фотографии" value={newEstablishment.photo} onChange={(e) => setNewEstablishment({ ...newEstablishment, photo: e.target.value })} style={{ margin: '10px 0' }} />
            <label>Категория</label>
            <Select placeholder="Выберите категорию" value={newEstablishment.CategoryId} onChange={handleSelectChange} style={{ width: '100%', marginBottom: '10px' }}>
                {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
            </Select>
            <Button onClick={handleCreateEstablishment} type="primary" block>Создать заведение</Button>

            <List
                dataSource={establishments}
                renderItem={establishment => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => openEditEstablishmentModal(establishment)}>Изменить</Button>,
                            <Button type="link" onClick={() => handleDeleteEstablishment(establishment.id)}>Удалить</Button>
                        ]}
                    >
                        {`${establishment.name} - ${establishment.categoryName}`}
                    </List.Item>
                )}
            />


            <Sheet isOpen={isCategorySheetOpen} onClose={() => setIsCategorySheetOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <label>Название категории</label>
                        <Input placeholder="Введите название категории" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                        <Button onClick={handleEditCategory} type="primary" block style={{ marginTop: '10px' }}>Обновить категорию</Button>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>

            <Sheet isOpen={isEstablishmentSheetOpen} onClose={() => setIsEstablishmentSheetOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <label>Название заведения</label>
                        <Input placeholder="Введите название заведения" value={newEstablishment.name} onChange={(e) => setNewEstablishment({ ...newEstablishment, name: e.target.value })} />
                        <label>Адрес</label>
                        <Input placeholder="Введите адрес" value={newEstablishment.address} onChange={(e) => setNewEstablishment({ ...newEstablishment, address: e.target.value })} />
                        <label>Телефон</label>
                        <Input placeholder="Введите телефон" value={newEstablishment.phoneNumber} onChange={(e) => setNewEstablishment({ ...newEstablishment, phoneNumber: e.target.value })} />
                        <label>Фото (URL)</label>
                        <Input placeholder="Введите URL фотографии" value={newEstablishment.photo} onChange={(e) => setNewEstablishment({ ...newEstablishment, photo: e.target.value })} />
                        <label>Категория</label>
                        <Select placeholder="Выберите категорию" value={newEstablishment.CategoryId} onChange={handleSelectChange} style={{ width: '100%', marginTop: '10px' }}>
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>{category.name}</Option>
                            ))}
                        </Select>
                        <Button onClick={handleEditEstablishment} type="primary" block style={{ marginTop: '10px' }}>Обновить заведение</Button>
                    </Sheet.Content>
                </Sheet.Container>
            </Sheet>
        </div>
    );
};

export default CategoriesAndEstablishments;
