import { Navbar } from "../../widgets/Navbar";
import './Rate.scss'
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Any } from "@react-spring/three";
import crown from '../../app/assets/crown.png'
import { Sheet, SheetRef } from 'react-modal-sheet';
import { useUserStore } from "../../app/stores/userStore";
import translate from '../../../i18n.js';
import { toZonedTime } from 'date-fns-tz';
import { Img } from 'react-image';
import UserCard from "../../widgets/UserCard/UserCard.js";




export interface User {
    id: number | null;
    name: string;
    totalPoints: number;
}

const Rate: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<SheetRef>();
    const [imageError, setImageError] = useState(false);
    const [users, setUsers] = useState([])
    const [yourStat, setYourStat] = useState<User | null>(null);
    const { id } = useUserStore()
    const [place, setPlace] = useState(null)
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [timerActive, setTimerActive] = useState(true);

    const usersRef = useRef(null);
    const headerRef = useRef(null);
    const handleScroll = () => {
        if (headerRef.current && usersRef.current) {
            headerRef.current.scrollLeft = usersRef.current.scrollLeft;
        }
    };

    useEffect(() => {
        const targetDate = new Date('2024-11-18T21:00:00'); 
        const mskTimezone = 'Europe/Moscow';

        const updateTimeLeft = () => {
            const now = new Date();
            const nowMSK = toZonedTime(now, mskTimezone);
            const diff = targetDate.getTime() - nowMSK.getTime();

            if (diff <= 0) {
                setTimerActive(false);
                return;
            }

            const days = Math.floor(diff / (1000 * 3600 * 24));
            const hours = Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 3600));
            const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));

            setTimeLeft(`${days !== 0 ? (days + ' ' + translate.t('d')) : ''} ${hours !== 0 ? (hours + ' ' + translate.t('h')) : ''} ${minutes !== 0 ? (minutes + ' ' + translate.t('m')) : ''}`);
        };

        const interval = setInterval(updateTimeLeft, 1000);
        updateTimeLeft();
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        axios.get(`/api/rate`).then(res => {
            const sortedUsers = res.data.sort((second: User, first: User) =>
                (first.totalPoints - second.totalPoints)
            );
            setUsers(sortedUsers);
            const userIndex = sortedUsers.findIndex((user: User) => user.id === 4355);
            const yourStats = sortedUsers[userIndex] || null;
            setPlace(userIndex + 1)
            setYourStat(yourStats)
            setYourStat(res.data.find(user => user.id == id))
        })
    }, [])
    return (
        <div>
            <div className="rate-top">
                <div className="info-rate" onClick={() => setOpen(true)}>
                    <div style={{ display: 'flex', marginLeft: '11vw', alignItems: 'center' }}>
                        <div>{translate.t('info')}</div>
                        <div style={{ marginLeft: '1vw', height: '4vw' }}>
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 27 27">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                        </div>
                    </div>
                    <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                        <Sheet.Container>
                            <Sheet.Header />
                            <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
                                <Sheet.Scroller>
                                    <div className="rules-text">
                                        <div style={{ fontWeight: 600, marginBottom: '2vw', fontSize: '18px' }}>
                                            {translate.t('rating')}
                                        </div>
                                        <div style={{ marginBottom: '2vw' }}>
                                        </div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, margin: '0.5rem' }}>{translate.t('metrics')}</div>
                                        <div style={{ marginBottom: '2vw', fontSize: '14px', marginLeft: '8px' }}>
                                            {translate.t('ratingHeader')}
                                            <div style={{ marginLeft: '7px' }}>
                                                <div style={{ marginTop: '10px' }}><span style={{ fontWeight: '700' }}>{translate.t('wins') + ' (' + translate.t('bot') + ')'}</span>{translate.t('ratingWinsWithBot')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '700' }}>{translate.t('loses') + ' (' + translate.t('bot') + ')'}</span>{translate.t('ratingLosesWithBot')}</div>
                                                <div style={{ marginTop: '3px' }}>
                                                    {translate.t('ratingHeaderPvp')}
                                                </div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '700' }}>{translate.t('wins') + ' (' + translate.t('pvp') + ')'}</span>{translate.t('ratingWinsWithOpponent')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '700' }}>{translate.t('loses') + ' (' + translate.t('pvp') + ')'}</span>{translate.t('ratingLosesWithOpponent')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '700' }}>{translate.t('sumOfBets')}</span>{translate.t('ratingVolume')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '600' }}>{translate.t('ratingVolumeTitle1')}</span>{translate.t('ratingVolume1')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '600' }}>{translate.t('ratingVolumeTitle2')}</span>{translate.t('ratingVolume2')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '600' }}>{translate.t('ratingVolumeTitle3')}</span>{translate.t('ratingVolume3')}</div>
                                                <div style={{ marginTop: '3px' }}><span style={{ fontWeight: '600' }}>{translate.t('ratingVolumeTitle4')}</span>{translate.t('ratingVolume4')}</div>
                                                <div style={{ marginTop: '5px', color: '#FF5854' }}>{translate.t('minimumBet')}</div>
                                                <div style={{ marginTop: '5px', color: '#FF5854' }}>{translate.t('entryRewards')}</div>
                                                <div style={{ height: '14vh' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Sheet.Scroller>
                            </Sheet.Content>
                        </Sheet.Container>
                        <Sheet.Backdrop />
                    </Sheet>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', fontSize: '26px' }}>{translate.t('tournament')}</div>
                    <div style={{ fontSize: '14px' }}>
                        <span>{translate.t('ended')}</span>
                    </div>
                </div>
            </div>
            <div className="rate">
                <div className="users" ref={usersRef} onScroll={handleScroll}>
                    {users.map((user, index) => (
                        <UserCard key={index + 1} name={user.name} place={index + 1} totalPoints={user.totalPoints} />
                    ))}
                </div>
                {yourStat && (
                    <div>
                    <UserCard name={yourStat.name} place={place} totalPoints={yourStat.totalPoints}/>
                    </div>
                )}

            </div>
            <Navbar />
        </div>
    )
};

export default Rate;