import React from 'react';
import Rating from "react-rating-stars-component";

const EstablishmentList = ({establishments, title, onEstablishmentClick}) => {
    console.log(`title ${title}`)
    return (
        <div className="main__container">
            <h1 className="category__name">{title}</h1>
            {establishments.map((establishment) => (
                <div
                    className="main__block"
                    key={establishment.id}
                    onClick={() => onEstablishmentClick(establishment)}
                >
                    <div className="main__block-img">
                        {establishment.photo && <img src={establishment.photo} alt={establishment.name}/>}
                    </div>
                    <div className="main__block-text">{establishment.name}</div>

                    <div className="main__block-text">
                        <Rating
                            value={establishment.averageRating || 0}
                            size={24}
                            isHalf={true}
                            edit={false} // Сделать рейтинг только для чтения
                            activeColor="#ffd700"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EstablishmentList;
