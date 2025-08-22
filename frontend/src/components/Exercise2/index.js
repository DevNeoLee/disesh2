import { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";

import styles from './practice.module.css';
import BreadcrumbExample from '../Breadcrumbs';
import Bar from '../ProgressBar';
import { Decision, Result } from '../DecisionResult';
import { Chat } from '../Chat';

const Exercise2 = () => {
    const now=80;
    // const [course, setCourse] = useState([<Decision />, <Result />])
    const [game, setGame] = useState(false);
    const [isChat, setIsChat] = useState(true);

    const [chatData, setChatData] = useState({ 1: [], 2: [], 3: [], 4: [] })
    const [round, setRound] = useState(1);

    const navigate = useNavigate();

    const handleChange = () => {

    }

    const handleNextCourse = (e) => {
        e.preventDefault();
        console.log('next')
        if (isChat) {
            setIsChat(false)
        }

        if (!game && isChat) {
            setIsChat(false)
            setGame(prev => !prev)
        }

        if (game && !isChat) {
            setGame(prev => !prev)
        }

        if (!game && !isChat) {
            setIsChat(true)
            setRound(prev => prev + 1)
        }

        if (!game && !isChat && round == 10) {
            navigate("/stopped");
        }
    }

    const handlePreviousCourse = (e) => {
        e.preventDefault();
        if (game && round != 1) {
            setRound(prev => prev - 1)
        }
        if (round != 1) {
            setGame(prev => !prev)
        }
        if (round == 1 && !game) {
            setGame(prev => !prev)
        }
    }


    const alphabetize = (round) => {
        const alphabetObject = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I", 10: "J"}
        return alphabetObject[round]
    }   

    return (
        <>
            <div className={styles.container}>
                     {/* <div className={styles.breadcrumbContainer}><BreadcrumbExample /></div> */}
      {/* <div className={styles.breadcrumbContainer}><Bar now={now}/></div> */}
      <div className={styles.breadcrumbContainer}><Bar now={now}/></div>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <div><h1>Round {alphabetize(round)}</h1><p>Decision</p></div><span>Exercise 2</span>
                    </div>
                    <div style={{ display: isChat ? "block" : "none"  }}>
                        <Chat chatData={chatData} setChatData={setChatData} round={round}/>
                    </div>
                    <div style={{ display: !isChat && game ? "block" : "none"  }}><Decision /></div>
                    <div style={{ display: !isChat && !game ? "block" : "none" }}><Result /></div>
                    <div className={styles.temporaryButtons}>
                        <div className={styles.temporayButtonsContent}>
                            <button className={styles.outterButton} style={{ visibility: "hidden"}}>
                                Go Back               
                            </button>
                            <button className={styles.outterButton} onClick={handleNextCourse}>
                                Next Course               
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomMessageBox}>
                    <div className={styles.sectionLeft}>
                        <p>Your role: <span>Farmer</span></p>
                    </div>
                    <div className={styles.sectionMiddle}>
                        <p className={styles.timer}>
                            Time remaining <span>60</span> seconds
                        </p>
                    </div>
                    <div className={styles.sectionRight}>
                        <p>Your total earnings until now: <span>6 tokens($0.3)</span></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Exercise2;