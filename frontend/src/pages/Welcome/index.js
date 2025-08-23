import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './welcome.module.css';
import HOST from '../../utils/routes.js';
import Bar from '../../components/ProgressBar';
import ReCAPTCHA from "react-google-recaptcha";
import { useAppContext } from '../../AppContext'

import { createSessionDB } from '../../utils/functions';

const Welcome = () => {
    const environment = process.env.NODE_ENV
    const now=3;
    const [disabled, setDisabled] = useState(true);
    const [beginTime, setBeginTime] = useState(null)
    const {   treat, setTreat, setSession, setTimeTracker } = useAppContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate()

    const [proceeding, setProceeding] = useState(false)

  useEffect(() => {
    let beginTime = new Date();
    setBeginTime(beginTime)
    setTimeTracker(prev => ({...prev, welcome: {...prev.welcome, beginTime: beginTime}}))
  }, [setTimeTracker])

    useEffect(() => {
        if (!['const', 'i'].includes(queryParams.get('treat'))) {
          console.log('not found treat.')
          navigate('/notfound')
        } else {
          setTreat(queryParams.get('treat'))
        }
    


    }, [treat])

    const handleChange = () => {
        setDisabled(false);
        // console.log('reCaptcha')

    }

    const updateSessionWelcome = async (time, id) => {
        await axios
        .put(`${HOST}api/session/${id}`, { timeTracker:{ welcome: {beginTime: beginTime, endTime: time}}}, {new: true})
        .then(data => {
            // sessionStorage.setItem('disesSession', JSON.stringify(data.data));
            console.log('updatedSession from Welcome updateSessionWelcome: ', data.data)
            return data.data
        })
        .catch(err => console.log(err))
    }

    const handleProceed = async (treat) => {
        setProceeding(true)
        await createSessionDB(treat)
            .then(async data => {
                console.log('Created Session succesfully in DB: ', data)
                setSession(data);
                await updateSessionWelcome(data.sessionStartTime, data._id)
                setTimeTracker(prev => ({...prev, welcome: {...prev.welcome, endTime: data.sessionStartTime}}))
                setProceeding(false)
                navigate(`/instruction/?treat=${treat}&id=${data?._id}`)
            })
            .catch(error => {
                console.log('error: ', error)
                setProceeding(false)
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbContainer}><Bar now={now}/></div>
            <div className={styles.content}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>Welcome</h1>
                        <div className={styles.logo}><img src='/purdueLogo.png' width="140px" alt="purdue logo"/></div>
                    </div>
                    <ul className={styles.paragraph}>
                        <li>  This human intelligence task (HIT), composed of two decision-making exercises, is designed by researchers at Purdue University. </li>
                        <li>  You will do this HIT in a group together with four other real people who also accepted to do the HIT concurrently.</li>
                        <li>  It is, therefore, very important that you complete this HIT without interruptions. </li>
                        <li>  Including the time for watching/reading these instructions, the HIT will take about 40 minutes to complete. </li>
                        <li>  During the HIT, <span className={styles.bold}>please do not close this window or leave the web pages </span>in any other way.</li>
                        <li>  <span className={styles.bold}>If you close your browser or leave it idle, you will not be able to re enter the HIT, and we will not be able to pay you! </span></li>
                        <li>  During the HIT, you will face a number of decision-making rounds. By making these decisions, you have chance to earn tokens that will be converted into real money at the end of the HIT. </li>
                    </ul>

                    <div className={styles.butttonContainer}>
                        {
                            environment === "development"
                            ?
                            <ReCAPTCHA
                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                onChange={handleChange}
                            />
                            :
                            <ReCAPTCHA      
                                sitekey="6Lcm50QqAAAAAOh0q0yEpdwtB8CQHiGvkCdY1OTZ"
                                onChange={handleChange}
                            />
                        }
                    
                    </div>
                    <div className={styles.butttonContainer}>
                        <button className={styles.button} 
                            disabled={disabled}
                            onClick={() => handleProceed(treat)}
                        >
                            { !proceeding ? "Next" : "Wait..." }
                        </button>
                    </div>
            </div>
            </div>
        </div>
    );
}

export default Welcome;