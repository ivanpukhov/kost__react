import React, {useState} from 'react';
import Sheet from 'react-modal-sheet';
import Rating from 'react-rating-stars-component';
import axios from 'axios';

const EstablishmentDetails = ({selectedEstablishment, isOpen, onClose, fetchEstablishments}) => {
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEstablishment || !reviewRating || !reviewComment) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        try {
            await axios.post(`https://rev.greenman.kz/api/establishments/${selectedEstablishment.id}/reviews`, {
                rating: reviewRating, comment: reviewComment, userId: localStorage.userId,
            });
            alert('Отзыв успешно добавлен.');
            setReviewRating('');
            setReviewComment('');
            fetchEstablishments();
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении отзыва:', error);
            alert('Ошибка при добавлении отзыва.');
        }
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

    return (<Sheet isOpen={isOpen} onClose={onClose}>
        <Sheet.Container>
            <Sheet.Header/>
            <Sheet.Content>
                <div className="product__info">
                    <h2>{selectedEstablishment.name}</h2>
                    {selectedEstablishment.photo &&
                        <img src={selectedEstablishment.photo} alt={selectedEstablishment.name}/>}
                    <p><b>Адрес:</b> {selectedEstablishment.address}</p>
                    <p><b>Телефон:</b> {selectedEstablishment.phoneNumber}</p>
                    <p><b>Средний рейтинг:</b> {selectedEstablishment.averageRating || 'Не указан'}</p>
                    <form className="review__add" onSubmit={handleReviewSubmit}>
                        <label>
                            <b>Добавить отзыв</b>
                            <Rating
                                value={reviewRating}
                                onChange={(newValue) => setReviewRating(newValue)}
                                size={24}
                                activeColor="#ffd700"
                                isHalf={true}
                            />
                        </label>
                        <label>
                        <textarea
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            required
                        />
                        </label>
                        <button type="submit">Оставить отзыв</button>
                    </form>

                    {selectedEstablishment.reviews && selectedEstablishment.reviews.map((review) => (<div
                        className="review"
                        key={review.id}
                        style={{
                            boxShadow: `0 0 5px #${getShadowColor(review.rating)}`,
                        }}
                    >
                        <p>Рейтинг: {review.rating}</p>
                        <p>Комментарий: {review.comment}</p>
                        <p>Дата: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>))}
                </div>
            </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop/>
    </Sheet>);
};

export default EstablishmentDetails;

