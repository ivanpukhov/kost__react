import React, {useState} from 'react';
import Sheet from 'react-modal-sheet';
import Rating from 'react-rating-stars-component';
import ReactSelect from 'react-select';
import axios from 'axios';
import Swal from "sweetalert2";

const EstablishmentDetails = ({
                                  selectedEstablishment,
                                  isOpen,
                                  setIsOpen,
                                  isAuthenticated,
                                  fetchEstablishments,
                              }) => {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [filter, setFilter] = useState('newest');
    const userId = localStorage.getItem('userId');
    const [editingReviewId, setEditingReviewId] = useState(null);
    const filterOptions = [
        {value: 'newest', label: 'Сначала новые'},
        {value: 'oldest', label: 'Сначала старые'},
        {value: 'positive', label: 'Положительные'},
        {value: 'negative', label: 'Отрицательные'},
    ];

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {

            await Swal.fire({
                icon: "error",
                title: "Упс..",
                text: "Для добавлени отзыва надо авторизоваться!",
                footer: '<Link to="/auth">Перейти на страницу входа</Link>'
            });
            return;
        }
        try {
            await axios.post(`https://rev.greenman.kz/api/establishments/${selectedEstablishment.id}/reviews`, {
                rating: reviewRating,
                comment: reviewComment,
                userId: userId
            });
            await Swal.fire({
                title: "Спасибо!",
                text: "Отзыв добавлен!",
                icon: "success"
            });
            setReviewRating(0);
            setReviewComment('');
            fetchEstablishments();
            setIsOpen(false);
        } catch (error) {
            console.error('Ошибка при добавлении отзыва:', error);
            Swal.fire({
                icon: "error",
                title: "Упс...",
                text: "Что-то не так! Обновите страницу и попробуйте еще!",
                footer: '<a href="#">Окей?</a>'
            });
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (!isAuthenticated) {
            await Swal.fire({
                icon: "error",
                title: "Упс...",
                text: "Войдите в систему, попробуйте еще!",
            });               return;
        }
        try {
            await axios.delete(`https://rev.greenman.kz/api/reviews/${reviewId}`);
            await Swal.fire({
                title: "Готово!",
                text: "Ваш отзыв был удален!",
                icon: "success"
            });
            fetchEstablishments(); // Обновляем список заведений, чтобы отобразить изменения
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            await Swal.fire({
                icon: "error",
                title: "Упс...",
                text: "Что-то не получилось, попробуйте еще!",
            });
        }
    };


    const handleReviewEdit = (review) => {
        setEditingReviewId(review.id);
        setReviewRating(review.rating);
        setReviewComment(review.comment);
    };

    const handleReviewUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://rev.greenman.kz/api/reviews/${editingReviewId}`, {
                rating: reviewRating,
                comment: reviewComment,
            });
            await Swal.fire({
                title: "Готово!",
                text: "Ваш отзыв был обновлен!",
                icon: "success"
            });
            setReviewRating(0);
            setReviewComment('');
            setEditingReviewId(null);
            fetchEstablishments();
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            await Swal.fire({
                icon: "error",
                title: "Упс...",
                text: "Что-то не получилось, попробуйте еще!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    };


    const userHasReviewed = selectedEstablishment.reviews.some(review => review.UserId && review.UserId.toString() === userId);

    const sortedAndFilteredReviews = selectedEstablishment.reviews.slice().sort((a, b) => {
        switch (filter) {
            case 'positive':
                return b.rating - a.rating;
            case 'negative':
                return a.rating - b.rating;
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return (
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Sheet.Container>
                <Sheet.Header/>
                <Sheet.Content>
                    <div className="product__info establishment-details">
                        <h2>{selectedEstablishment.name}</h2>
                        {selectedEstablishment.photo && (
                            <img src={selectedEstablishment.photo} alt={selectedEstablishment.name}/>
                        )}
                        <p><b>Адрес:</b> {selectedEstablishment.address}</p>
                        <p><b>Телефон:</b> {selectedEstablishment.phoneNumber}</p>
                        <Rating
                            value={Number(selectedEstablishment.averageRating)}
                            size={24}
                            isHalf={true}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        {!userHasReviewed && isAuthenticated && (
                            <form className="review__add" onSubmit={handleReviewSubmit}>
                                <Rating
                                    value={reviewRating}
                                    onChange={newValue => setReviewRating(newValue)}
                                    size={24}
                                    activeColor="#ffd700"
                                    isHalf={true}
                                />
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit">Оставить отзыв</button>
                            </form>
                        )}
                        <ReactSelect
                            defaultValue={filterOptions.find(option => option.value === filter)}
                            options={filterOptions}
                            onChange={selectedOption => setFilter(selectedOption.value)}
                            className="filter-select"
                        />
                        {editingReviewId && (
                            <form className="review__add" onSubmit={handleReviewUpdate}>
                                <Rating
                                    value={reviewRating}
                                    onChange={newValue => setReviewRating(newValue)}
                                    size={24}
                                    activeColor="#ffd700"
                                    isHalf={true}
                                />
                                <textarea
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit">Обновить отзыв</button>
                            </form>
                        )}
                        <div className="reviews">
                            {sortedAndFilteredReviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="review"
                                    style={{
                                        boxShadow: `0 0 5px #${getShadowColor(review.rating)}`,
                                        border: review.UserId && review.UserId.toString() === userId ? '1 px solid #000000' : '',
                                    }}
                                >
                                    <Rating
                                        value={review.rating}
                                        size={24}
                                        isHalf={true}
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                    <p>Комментарий: {review.comment}</p>
                                    <p>Дата: {new Date(review.createdAt).toLocaleDateString()}</p>
                                    {review.UserId && review.UserId.toString() === userId && (
                                        <>
                                            <button className='edit__review'
                                                    onClick={() => handleReviewEdit(review)}>Редактировать
                                            </button>
                                            <button className='delete__review'
                                                    onClick={() => handleReviewDelete(review.id)}>Удалить отзыв
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop/>
        </Sheet>
    );
};

const getShadowColor = (rating) => {
    if (rating >= 4) {
        return '43B97B';
    } else if (rating >= 2.5) {
        return 'b99d43';
    } else {
        return 'b94343';
    }
};

export default EstablishmentDetails;
