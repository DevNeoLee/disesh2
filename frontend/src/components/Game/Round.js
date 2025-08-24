import { useState, useEffect, useContext } from 'react';

import styles from './practice.module.css';
import Bar from '../ProgressBar';
import { FarmersDecision, Result, FinalResult } from '../DecisionResult';
import SocketSingleton from '../../utils/socket';
import { GameContext } from '../../pages/Game'
import { useAppContext } from '../../AppContext';
import { set } from 'mongoose';
import GameStop from './GameStop';

const Round = ({ roundTimer, roundEnd, currentRound, currentWater, resultDuration, count, showPracticeEndNotification, practiceEndDuration}) => {

    const [round, setRound] = useState(1)
    const [game, setGame] = useState(true);
    const [error, setError] = useState(false);
    const [myScore, setMyScore] = useState(0);

    const {setTotalTokens} = useAppContext();
    const { notifyParticipantNotResponded, role, gameState, session, setGameState, choice, setChoice, socket, setTotalGroupWater, scores, setChoiceList, choiceList, showFinalResultTable, finalScores, showGameStop} = useContext(GameContext);

    useEffect(() => {
        if (choice) {
            setError(false)
            // console.log('choice changed: ', choice)
        };
    }, [choice])

    useEffect(() => {
        const myChoice = choiceList.find(choice => choice.role == role);
        // console.log('choiceList: ', choiceList, session)
        // console.log('myChoice: ', myChoice)
        setMyScore(myChoice?.totalScore)
    }, [choiceList])
    

    useEffect(() => {
        if (roundEnd) {
            setGame(false);
            setChoice('')
        } else {
            setChoiceList([[], [], [], [], []])
            // console.log('gameState when 준비할때, ', gameState)
            setGame(true);
        }
    }, [roundEnd])

    useEffect(() => {
        const myChoice = choiceList.find(choice => choice.role == role)
        if (roundTimer == 0 && !myChoice?.choice) {
            // console.log('roundTimer is up! : ', roundTimer)
            // 시간이 다 했을경우 게임이 끝납니다.
            notifyParticipantNotResponded({room_name: gameState?.roomName, player_id: socket.id})
            setGame(false)
        }
    }, [roundTimer])

    const handleDecision = () => {
        if (choice) {
            // 선택을 서버로 보낸다.
            socket?.emit("decisionNotice", {room_name: gameState?.roomName, player_id: socket.id, choice})
            setGame(false)
            setChoice('')
        } else {
            setError(true)
        }
    }


        const getMyFinalTokens = (finalScores) => {
            console.log('finalScores: ', finalScores)
            const myFinalScore = finalScores[Number(role.slice(6,7)) - 1];
            return myFinalScore;
        }

        useEffect(() => {

            const myTokensQuantity = getMyFinalTokens(finalScores)
            setTotalTokens(myTokensQuantity)
        }, [finalScores])

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbContainer}><Bar now={gameState?.now}/></div>
            <div className={styles.topInfo}>
                <div>
                    <p>You are <span style={{ fontSize: "21px"}}>{role.replace(/.{6}/g, "$&" + " ")}</span></p>
                </div>    
                <div style={{ marginRight: "1rem"}}>
                    {game || showGameStop || showFinalResultTable ? "" 
                    : 
                    <div style={{ display: "flex", fontSize: "1.3rem"}}>
                       <div style={{ fontSize: "1.3rem"}}>Your cumulative earnings: </div>
                       <div style={{ fontSize: "1.3rem", padding: "0 0 0 0.5rem", color: "#0065ff"}}> {myScore} {myScore > 1 ? "tokens" : "token"}</div>
                   </div>
                    }
                </div>
            </div>
            {/* <Result currentRound={currentRound} currentWater={currentWater} resultDuration={resultDuration}/> */}
            {
                showGameStop ?
                <GameStop/>
                :
                showFinalResultTable ?
                <div className={styles.content}>
                    <div className={styles.title}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><h1>Summary </h1></div>
                    </div>
                    <FinalResult currentRound={currentRound} currentWater={currentWater} resultDuration={resultDuration} showPracticeEndNotification={showPracticeEndNotification} practiceEndDuration={practiceEndDuration} finalScores={finalScores}/>
                </div>
                :
                <div className={styles.content}>
                    <div className={styles.title}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000"}}><h1>Round {currentRound} - {game ? "Decision" : "Result"}</h1></div>
                    </div>
                    <div style={{ display: game && role?.includes("Farmer") ? "block" : "none"  }}><FarmersDecision currentRound={currentRound} /></div>
                    <div style={{ display: !game ? "block" : "none" }}><Result currentRound={currentRound} currentWater={currentWater} resultDuration={resultDuration} showPracticeEndNotification={showPracticeEndNotification} practiceEndDuration={practiceEndDuration}/></div>
                </div>
            }
            <div className={styles.bottomMessageBox } style={{ position: "relative"}}>
                {
                !showGameStop        
                ?
                <div className={styles.temporaryButtons}>
                    <div className={styles.temporayButtonsContent} >
                        {
                        game ?
                        <div style={{width: "200px"}} >
        
                        </div>
                        :
                        null
                        }
                        <div className={styles.sectionMiddle}>
                        {
                        showFinalResultTable ?
                        <div style={{ width: "100%", position: "absolute", left: "0"}}><div style={{ fontSize: "1.4rem", margin: "0 auto", position: "relative", textAlign: "center"}}>You will be redirected  <span style={{color: "red", fontSize: "1.6rem"}}>{resultDuration}</span> {(resultDuration == 0 || resultDuration == 1) ? "second" : "seconds"}</div></div>
                        :
                        (game && count != 5 && !showGameStop) ? 
                        <p className={styles.timer}>
                            Time remaining <span>{roundTimer}</span> seconds
                        </p>
                        :
                        (count != 5 && !showGameStop) ? 
                        null
                        :
                        !showGameStop ?
                        <div style={{ width: "100%", position: "absolute", left: "0"}}><div style={{ fontSize: "1.4rem", margin: "0 auto", position: "relative", textAlign: "center"}}>Next round will begin in <span style={{color: "#0065ff", fontSize: "1.6rem"}}>{resultDuration}</span> {(resultDuration == 0 || resultDuration == 1) ? "second" : "seconds"}</div></div>
                        :
                        <div style={{ width: "100%", position: "absolute", left: "0"}}><div style={{ color: "red", fontSize: "1.4rem", margin: "0 auto", position: "relative", textAlign: "center"}}>You will be redirected  <span style={{color: "red", fontSize: "1.6rem"}}>{resultDuration}</span> {(resultDuration == 0 || resultDuration == 1) ? "second" : "seconds"}</div></div>

                        }
                        </div>

                    {error ? <h1 style={{ position: "absolute", right: "10px", bottom: "60px", color: "#a6182d"}}>*Please select your choice.</h1>: null}
                    {
                        game && !showFinalResultTable && !showGameStop
                        ?
                        <button className={`${styles.outterButton} ${choice ? styles.blinker : ''}`} onClick={handleDecision} style={{ color: error ? "#a6182d" : null, border: error ? "1px solid #a6182d": null}}>
                            MAKE DECISION
                        </button>
                        :
                        <div style={{ width: "230px"}}></div>
                }
                    </div>
                </div>
                :
                <div></div>
                }
            </div>
        </div>
    );
}

export default Round;