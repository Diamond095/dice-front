import React, { useState, useEffect } from 'react';
import translate from '../../../i18n.js';
import redDice from '../../app/assets/red-dice.jpg';
import blueDice from '../../app/assets/blue-dice.jpg';
import purpleDice from '../../app/assets/purple-dice.jpg';
import pinkDice from '../../app/assets/pink-dice.jpg';

interface UserCardProps {
    name: string;
    totalPoints: number;
    place: number;
}

const UserCard: React.FC<UserCardProps> = ({
    name,
    totalPoints,
    place,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkImage = async () => {
            try {
                const response = await fetch(`https://t.me/i/userpic/320/${name}.jpg`, { method: 'HEAD' });
                if (response.ok) {
                    setImgSrc(`https://t.me/i/userpic/320/${name}.jpg`);
                }
            } catch {
                console.error('Image is not available, using fallback.');
            }
        };
    
        checkImage();
    }, [name]);
    const handleImageError = () => {
        setImgSrc(randomDice());
    };
 
    const dices = [
        'https://diceton.xyz/assets/red-dice.jpg',
        'https://diceton.xyz/assets/blue-dice.jpg',
        'https://diceton.xyz/assets/purpule-dice.jpg',
        'https://diceton.xyz/assets/pink-dice.jpg'
    ];


    const randomDice = () => {
        return dices[Math.floor(Math.random() * dices.length)];
    };
    const [imgSrc, setImgSrc] = useState(randomDice());
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget;
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            img.src = randomDice(); 
        }
    };
    const getRewardColor = (place: number, type: 'user' | 'reward') => {
        switch (place) {
            case 1:
                return '#E92E38'; 
            case 2:
                return '#5FAAD5';
            case 3:
                return 'white';   
            default:
                return type === 'reward' ? '#3F5A69' : 'white'; 
        }
    };
    const getReward = (place: number) => {
        switch (place) {
            case 1:
                return 1000;
            case 2:
                return 700;
            case 3:
                return 500;
            default:
                if (place >= 4 && place <= 10) {
                    return 300;
                } else if (place >= 11 && place <= 15) {
                    return 200;
                } else if (place >= 16 && place <= 20) {
                    return 140;
                } else {
                    return 0;
                }
        }
    };

    return (
        <div
            className={`info relative h-18`}
            style={{
                fontWeight: '500',
                padding: '0.7rem 0',
                border: '#243239 solid 1px',
                color: getRewardColor(place, 'user'),
                background: place <= 3 ? '#243A46' : null,
                justifyContent: 'space-between',
            }}
        >
            <div
                className={`relative flex items-center gap-3 ${place <= 3 ? 'border-b dashed #abb5c3 mx-2 py-2' : 'p-2'}`}
                style={{ display: 'flex', gap: '1rem' }}
            >
                <div className="field place">
                    {place}
                </div>
                <div className="photo-frame">
                    <img
                        src={imgSrc}
                        className="photo-user"
                        alt="User photo"
                        style={{
                            display: isLoaded ? 'block' : 'none', 
                            objectFit: 'cover',
                        }}
                    />
                   
                </div>
                <div className="field">
                    <div className="name">@{name}</div>
                    <div style={{ fontSize: '16px', width: '30vw', color: 'rgb(255,255,255,60%)' }}>
                        {translate.t('score') + ' ' + totalPoints.toFixed(2)}
                    </div>
                </div>
            </div>
            <div
                className="field"
                style={{
                    width: '21vw',
                    fontSize: '23px',
                    color: getRewardColor(place, 'reward')
                }}
            >
                {getReward(place)}$
            </div>
        </div>
    );
};

export default UserCard;
