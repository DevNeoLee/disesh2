import { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";

import styles from './practice.module.css';
import BreadcrumbExample from '../Breadcrumbs';
import Bar from '../ProgressBar';
import { DecisionUser, DecisionProvider, Result } from '../DecisionResult';
import SocketSingleton from '../../utils/socket';

const Exercise = () => {
    const now=25;
    const [round, setRound] = useState(1)
    const [game, setGame] = useState(true);
    const [socket, setSocket] = useState(null);
    const [sessionDataStorage, setSessionDataStorage] = useState(JSON.parse(sessionStorage.getItem('disesSession')))
    const navigate = useNavigate();

    useEffect(() => {
        
        console.log("sessionDataStorage: ", sessionDataStorage);
        connectToSocket()

        return () => {
            disconnectFromSocket()
        }
    }, [])

    const connectToSocket = () => {
        //////Socket///////////////////
        const socket = new SocketSingleton().getInstance();
        setSocket(socket);
        socket?.emit("joinRoom")///////////////////////
        console.log('socket: ', socket)

        socket.on("hello_world", arg => {
            console.log("hello sokcet: ", arg)
        })

        socket.onAny((event, ...args) => {
            console.log('socket event: ', event, args)
        })

    }

    const disconnectFromSocket = () => {
        setSocket(null)
    }

    const handleNextCourse = (e) => {
        e.preventDefault();
        setGame(prev => !prev)
        if (!game) {
            setRound(prev => prev + 1)
        }

        if (!game && round == 2) {
            navigate("/exercise");
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

    const handleTemporarySignal = () => {

    }

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbContainer}><Bar now={now}/></div>
            <div className={styles.topInfo}>
                <div>
                    <p>Your role: <span></span></p>
                </div>    
                <div>
                    <p>Your cumulative earnings: <span>6 tokens($0.3)</span></p>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><h1>Practice Round {round}</h1><p>{game ? "Decision" : "Result"}</p></div>
                </div>
                <div style={{ display: game ? "block" : "none"  }}><DecisionProvider /></div>
                <div style={{ display: !game ? "block" : "none" }}><Result /></div>
            </div>
     
            <div className={styles.bottomMessageBox}>
            <div className={styles.temporaryButtons}>
                    <div className={styles.temporayButtonsContent}>
                        <button className={styles.outterButton} onClick={handlePreviousCourse}>
                            HELP ?               
                        </button>
                        <div className={styles.sectionMiddle}>
                    <p className={styles.timer}>
                        Time remaining <span>60</span> seconds
                    </p>
                </div>
                        <button className={styles.outterButton} onClick={handleTemporarySignal}>
                            MAKE DECISION
               
                        </button>
                    </div>
                </div>                              ``````````
            </div>
        </div>
    );
}

export default Exercise;