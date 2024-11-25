import React, { useEffect, useState } from 'react';
import './Alert.scss';
import translate from '../../../i18n.js';

interface AlertProps {
    children?: React.ReactNode;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ children, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        if (!visible) {
            const timer = setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 1000); // Продолжительность анимации исчезновения
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    const handleHide = () => {
        setVisible(false);
    };

    return (
        <div className={`alert ${visible ? 'fade-in' : 'fade-out'}`} onClick={handleHide} >
            <div>
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        </div>
            <span className="alert__warning">{translate.t('attention')}{children}</span>
        </div>
    );
};

export default Alert;
