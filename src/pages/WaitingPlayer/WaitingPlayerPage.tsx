import './WaitingPlayerPage.scss'
import diceDarkBlue from '../../app/assets/DiceDarkBlue.png'
import diceRed from '../../app/assets/DiceDarkRed.png'
import dicePurple from '../../app/assets/DicePurple.png'
import dicePink from '../../app/assets/DicePink.png'
import diceBlue from '../../app/assets/DiceBlue.png'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import BackButton from '../../shared/ui/BackButton/BackButton'
import useGameStore from '../../app/stores/gameStore'
import translate from '../../../i18n.js';
import { useUserStore } from '../../app/stores/userStore.js'


const WaitingPlayer: React.FC = () => {
    const navigate = useNavigate()
    let { number } = useParams()
    const { setBet } = useGameStore()
    const { incrementBalance } = useUserStore()
    useEffect(() => {
        window.Echo.channel(`entercertaingame${number}`).listen('.entercertaingame', () => {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
            navigate(`/waitingconfirm/${number}/create`);
        });
    }, []);

    const handleCancel = async () => {
        setBet(0)
        await axios.get(`/api/bet/${number}`).then(
            res => {
                incrementBalance(res.data.token, res.data.bet)
            }
        )
        axios.delete(`/api/game/${number}`)
            .then(() => {
                navigate('/')
            })
    }
    return (
        <div className='waiting'>
            <div className='headers'>
                <div className='main-header'>
                    {translate.t('gameCreated')}
                </div>
                <div className='common-header'>
                    {translate.t('waitForPlayer')}
                </div>
            </div>
            <img className='dice-dark-blue' src={diceDarkBlue}></img>
            <img className='dice-purple' src={dicePurple}></img>
            <img className='dice-red' src={diceRed}></img>
            <img className='dice-blue' src={diceBlue}></img>
            <img className='dice-pink' src={dicePink}></img>
            <div className='messange'>
                {translate.t('waitingPlayerMessange')}
            </div>
            <div onClick={handleCancel}>
                <button className='back'>
                    {translate.t('back')}
                </button>
            </div>
        </div>
    )
}
export default WaitingPlayer