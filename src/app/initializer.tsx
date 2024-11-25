import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../app/stores/userStore';
import translate from '../../i18n.js';
import qs from 'qs';

declare global {
    interface Window {
        Telegram: any;
    }
}

const Initializer: React.FC = () => {
    const { first_name, last_name, username, id, language, setLanguage } = useUserStore();

    const [authError, setAuthError] = useState(false); 

    useEffect(() => {
        const telegram = window.Telegram.WebApp;
        const initData = telegram.initData;

        if (!initData || !telegram.initDataUnsafe || !telegram.initDataUnsafe.user) {
            console.error('Пользователь не пришел через Telegram WebApp');
        } else {
            console.log('initData получены от Telegram:', initData);
            axios.interceptors.request.use(
                (config) => {
                    config.params = config.params || {};
                    config.params.initData = initData;
                    return config;
                },
                (error) => Promise.reject(error)
            );
            axios.interceptors.response.use(
                (response) => response,
                (error) => {
                    if (error.response && error.response.status === 401) {
                        console.error('Ошибка авторизации. Статус 401.');
                        setAuthError(true)
                    }
                    return Promise.reject(error);
                }
            );

            // Отправляем запрос на авторизацию
            const data = qs.stringify({
                initData: telegram.initData,
            });

            axios.post('/telegram-auth', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((response) => {
                console.log('Пользователь успешно авторизован через Telegram:', response.data);
            })
            .catch((error) => {
                console.error('Ошибка авторизации через Telegram:', error.response ? error.response.data : error.message);
            });

            // Устанавливаем язык
            axios.post('/api/language', { id: id })
            .then((res) => {
                console.log('Язык успешно установлен:', res.data);
                translate.changeLanguage(res.data);
                setLanguage(res.data)
            })
            .catch((error) => {
                console.error('Ошибка при установке языка:', error);
            });

            // Проверка авторизации
            axios.get('/api/authcheck', { withCredentials: true })
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
            const initializeUser = async () => {
                let name = username || (first_name ? `${first_name} ${last_name || ''}` : null);
                const userObject = { name, id };
                try {
                    const response = await axios.get(`/api/user/${name}/${id}`);
                    userObject.id = response.data.user.id;
                    console.log('Данные пользователя успешно получены:', response.data);
                } catch (error) {
                    console.error('Ошибка получения данных пользователя:', error);
                }
            };

            initializeUser();
        }
    }, [first_name, last_name, username, id]);

    return (
        <>
            {authError && (
                <div style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>
                    401 Unauthorized
                </div>
            )}
        </>
    );
};

export default Initializer;
