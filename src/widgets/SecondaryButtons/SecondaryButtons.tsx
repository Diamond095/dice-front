import './SecondaryButtons.scss'
import { Sheet, SheetRef } from 'react-modal-sheet';
import React, { useState, useRef } from "react";
import translate from '../../../i18n.js';
import pvpIcon from '../../app/assets/pvp-icon.png'
import botIcon from '../../app/assets/bot-icon.png'
const SecondaryButtons: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<SheetRef>();
    return (
        <div className='secondary-buttons'>
            <a href="https://swap.coffee/dex?ft=TON&st=M5" rel="noreferrer" target="_blank" style={{ textDecoration: 'none', color: 'white' }}>
                <div className='button'>
                    <div>
                        <div style={{ fontSize: '20px' }}>
                            {translate.t('buy')}
                        </div>
                        <div>
                            M5
                        </div>
                    </div>
                </div>
            </a>
            <div className='button info' onClick={() => setOpen(true)} >
                {translate.t('info')}
            </div>
            <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
                        <Sheet.Scroller>
                            <div className="rules-text">
                                <div style={{ fontWeight: 600, marginBottom: '2vw', fontSize: '18px' }}>
                                    {translate.t('rules')}
                                </div>
                                <div style={{ marginBottom: '2vw' }}>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, margin: '0.5rem' }}>{translate.t('pvpTitle')} <img style={{ width: "6vw", marginLeft: '1.5vw' }} src={pvpIcon}></img></div>
                                <div style={{ marginBottom: '2vw', fontSize: '14px', marginLeft: '10px' }}>
                                    <div> <span style={{ fontWeight: "600" }}>{translate.t('gameplay')}</span>{translate.t('pvpInfo')}</div>
                                    <div style={{ marginTop: '2vw' }}><span style={{ fontWeight: "600" }}>{translate.t('payoutWins')}</span>{translate.t('payoutWinsInfoPvp')}</div>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, margin: '0.5rem' }}>{translate.t('gameWithBot')} <img style={{ width: "4.5vw", marginLeft: '1.5vw' }} src={botIcon}></img></div>
                                <div style={{ marginBottom: '2vw', fontSize: '14px', marginLeft: '10px' }}>
                                    <div><span style={{ fontWeight: "600" }}>{translate.t('gameplay')}</span> {translate.t('gameWithBotInfo')}</div>
                                    <div style={{ marginTop: '2vw' }}><span style={{ fontWeight: "600" }}>{translate.t('payoutWins')}</span>{translate.t('payoutWinsInfoBot')}</div>
                                </div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '16px', fontWeight: 600, margin: '0.5rem' }}>{translate.t('launchGame')}</div>
                                </div>
                            
                                <div style={{ fontSize: '14px', marginLeft: '10px' }}>
                                    <div style={{ marginBottom: '1vw' }}>{translate.t('infoLaunchGame')}</div>
                                    <div style={{ marginLeft: '5px' }}>
                                        <div>{translate.t('launchGame1')}</div>
                                        <div>{translate.t('launchGame2')}</div>
                                        <div>{translate.t('launchGame3')}</div>
                                    </div>
                                    <div style={{ marginTop: '1vw' }} >{translate.t('launchGameEnd')}</div>
                                </div>
                                <div
                                    style={{
                                        marginTop: '1vw',
                                        marginBottom: '1vw',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        margin: '0.5rem'
                                    }}
                                >
                                    {translate.t('withdrawWins')}
                                </div>
                                <div style={{ fontSize: '14px', marginLeft: '10px' }}>
                                    <div style={{ marginBottom: '1vw' }}>{translate.t('withdrawWinsInfo')}</div>
                                    <div style={{ marginLeft: '5px' }}>
                                        <div>{translate.t('withdraw1')}</div>
                                        <div>{translate.t('withdraw2')}</div>
                                        <div>{translate.t('withdraw3')}</div>
                                    </div>
                                    <div style={{ marginTop: '1vw' }} >{translate.t('withdrawEnd')}</div>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, margin: '0.5rem' }}>{translate.t('bonus')}</div>
                                <div style={{ fontSize: '14px', marginLeft:'10px' }}>
                                    {translate.t('bonusInfo')}
                                </div>
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    )
}

export default SecondaryButtons