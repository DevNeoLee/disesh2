import { useState, useEffect, createContext } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

import styles from './game.module.css';
import HOST from '../../utils/routes';
import SocketSingleton from '../../utils/socket';
import axios from 'axios';
import ParticipantsReady from '../../components/Game/ParticipantsReady';
import RoleSelection from '../../components/Game/RoleSelection';
import Round from '../../components/Game/Round';
import WaitingRoom from '../../components/WaitingRoom';
import { useAppContext } from '../../AppContext'; 
import SecondInstructionStage from '../../components/SecondInstructionStage';

import { createSessionDB } from '../../utils/functions';


export const GameContext = createContext()

const Game = () => {
    const { treat, session, setSession, setTreat,  mTurkcode, setMTurkcode} = useAppContext();
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate()

    const sessionDataStorage = sessionStorage.getItem('disesSession');

    const updateSessionToMongoDB = async (dataParams) => {
        const dataUpdate = async () => { 
          await axios
          .put(`${HOST}api/session/${session?._id}`, { ...dataParams, timeLastUpdated: new Date()}, {new: true})
          .then(data => {
            console.log('data: ', data.data)
            sessionStorage.setItem('disesSession', JSON.stringify(data.data));
            return data.data
          })
          .catch(err => console.log(err))
        }
        await dataUpdate();
      }

    //   useEffect(() => {
    //     console.log('session: useEffect: ', session)
    //   }, [session])

    // useEffect (() => {
    //     const sessionFind = async () => {
    //         if (!sessionDataStorage) {
    //             const sessionCreated = await createSessionDB(queryParams.get('treat') || treat);
    //             console.log('session: ', sessionCreated)
    //             setSession(sessionCreated)
    //         } else {
    //             const sessionData = JSON.parse(sessionDataStorage);
    //             console.log('sessionData: from Game sessionStorage: ', sessionData)
    //             setSession(sessionData)
    //         }
    //     }
    //     sessionFind();
    // }, [])

 

    useEffect(() => {
        if (!['const', 'i'].includes(queryParams.get('treat'))) {
          console.log('not found treat.')
          navigate('/notfound')
        } else {
          setTreat(queryParams.get('treat'))
        }
    
        if (treat) {
            setGameState(prev =>
                ({
                    ...prev, treat
                })
            )
            connectToSocket()
        } 
    
      }, [treat])


    const PLAYERSLIST = [{name: "Farmer1", label: "Farmer 1"}, {name: "Farmer2", label: "Farmer 2"}, {name: "Farmer3", label: "Farmer 3"}, {name: "Farmer4", label: "Farmer 4"}, {name: "Farmer5", label: "Farmer5"}]
    // const [sessionDataStorage, setSessionDataStorage] = useState(JSON.parse(sessionStorage.getItem('disesSession')))
    const [socket, setSocket] = useState(null);
    const [gameStart, setGameStart] = useState(false);
    const [clientCount, setClientCount] = useState(0);
    const [roundTimer, setRoundTimer] = useState(60)
    const [participantsReady, setParticipantsReady] = useState(false)
    const [participantsReady2, setParticipantsReady2] = useState(false)
    const [role, setRole] = useState('');
    const [socket_id, setSocket_id] = useState('');
    const [roleReady, setRoleReady] = useState(true)

    const [roundEnd, setRoundEnd] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)

    const [showFinalResultTable, setShowFinalResultTable] = useState(false)

    const [gameState, setGameState] = useState({
        roomName: "",
        state: 'waiting',
        inGame: false,
        gameDropped: false,
        participants: [],
        roundTimer: null,
        roundDuration: 60,
        roundIndex: 0, 
        surfaceWaters: [4, 3, 3, 3, 3, 3, 3, 3, 3, 0],
        currentRound: "",
        previousWater: 60,
        currentWater: 60,
        totalRounds: 22, 
        isDepletedFirstPart: false,
        isDepletedSecondPart: false,
        treat,
        
        now: 10,
    })
    const [choice, setChoice] = useState('')

    const [currentRound, setCurrentRound] = useState("")

    const [currentWater, setCurrentWater] = useState(gameState.currentWater)

    const [choiceList, setChoiceList] = useState([
        {results: [], role: "Farmer1", socket_id: ""},
        {results: [], role: "Farmer2", socket_id: ""},
        {results: [], role: "Farmer3", socket_id: ""},
        {results: [], role: "Farmer4", socket_id: ""},
        {results: [], role: "Farmer5", socket_id: ""},
    ])
    
    const [totalGroupWater, setTotalGroupWater] = useState(0)

    const [isSecondInstructionStage, setIsSecondInstructionState] = useState(false);

    const [completedUser2, setCompletedUsers2] = useState(0);
    const [waitingRoomTime, setWaitingRoomTime] = useState(0);
    const [waitingRoom2Time, setWaitingRoom2Time] = useState(180);
    const [resultDuration, setResultDuration] = useState(20)
    const [count, setCount ] = useState(0);

    const [showPracticeEndNotification, setShowPracticeEndNotification] = useState(false)
    const [practiceEndDuration, setPracticeEndDuration] = useState(0)
    const [gameStopDuration, setGameStopDuration] = useState(40)

    const [finalScores, setFinalScores] = useState([]);

    const [showGameStop, setShowGameStop] = useState(false);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!gameStart) {
            console.log('-------------- waiting room ----------------')
        } else {
            console.log('-------------- game start ----------------')
        }
    }, [gameStart])

    useEffect(() => {
        // console.log('clientCount: ', clientCount)
    }, [clientCount])

    useEffect(() => {
        setCurrentWater(gameState.currentWater)
    }, [gameState])

    useEffect(() => {
        // console.log('gameState: ', gameState)
    }, [gameState])

    useEffect(() => {
        if (socket_id, mTurkcode, session?._id, role) {
            updateSessionWithSocketInfo(socket_id, mTurkcode, role)
        }
    }, [socket_id, mTurkcode, session?._id, role])

    function getMTurkcode(socketid) {
        const today = new Date();
    
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');
        
        // console.log(`MturkID: ${year}${month}${day}_${socketid}_b`)
        return `${year}${month}${day}_${socketid}_b`;
    }

    const updateSessionWithSocketInfo = async ( socket_id, mTurkcode, role) => {
        // console.log('session update 합니다, 소켓, 엠터크 정보' )
        // await updateSessionToMongoDB({ socket_id: socket_id, mTurkNumber: mTurkcode, gameStarted: true, role: role})
    }

    const connectToSocket = () => {
        const socket = new SocketSingleton().getInstance();
        setSocket(socket);
        if (!treat ) {
            navigate('/notfound')
        } else {
            socket?.emit("createOrJoinRoom", {treat})/////////////////////// start a begin event
        }

        socket.on('joinedRoom', ({roomId, roomName, size}) => {
            // console.log('joined room id, name: ', roomId, roomName, size)
            setClientCount(size)
            setGameState(prev => ({...prev, roomName: roomName}))
            // if (!location?.search.includes('g=')) {
            //     navigate(`${location.pathname}${location.search}&g=${roomName}`);
            // }
        })

        socket.on('participantsReady', () => {
            setParticipantsReady(true)
        })

        socket.on('updateParticipants', (participants) => {
            // console.log(' updateParticipants, participants received: ', participants)
            setGameState(prev => ({...prev, participants: participants}))
            // console.log('participants.length: ', participants.length)
            setClientCount(participants.length)
        })

        socket.on('participantsReady2', () => {
            // console.log('participantsReady2! ')
            setParticipantsReady2(true)
        })

        socket.on('startGame', (room) => {
            setGameState(room)
            setGameStart(true)
        })

        socket.on('roleReady', (room) => {
            setRoleReady(false)
        })

        socket.on('roundTimer', (roundDuration) => {
            setRoundTimer(roundDuration)
        })

        socket.on('roundEnded', (room) => {
            setRoundEnd(true)
            // console.log('roundEnded, room: ', room)
        })

        socket.on('roundUpdate', (room) => {
            // console.log('roundUpdate received, roundIndex: ', room.roundIndex)
            setCurrentRound(room.currentRound)
            setGameState(room)
            setRoundEnd(false)
            setResultDuration(20)
            setCount(0)
        })

        socket.on('secondInstructionStage', (room) => {
            setIsSecondInstructionState(true)
            setGameState(room)

        })

        socket.on('startSurvey', () => {
            navigate('/survey')
        })

        socket.on('secondInstructionStageEnd', (room) => {
            setCurrentRound(room.currentRound)

            setGameState(room)
            setCompletedUsers2(room.secondInstructionCompletedUsers)
            // console.log('room: update, secondInstructionStageEnd ', room)

            setParticipantsReady2(true)
        })

        socket.on('secondWaitingRoomJoins', (users) => {
            // console.log('SecondWaitingRoomJoins: users.length ', users.users.length)
            setCompletedUsers2(users.users.length)
        })

        socket.on('secondSetStart', (room) => {
            setIsSecondInstructionState(false)
        })

        socket.on("roleSelected", (roleSelected, socketid, mTurkcodeGenerated) => {
            // console.log('roleSelected: ', mTurkcodeGenerated)
            if (socketid === socket.id) {
                setRole((roleSelected))
                setMTurkcode(mTurkcodeGenerated)
                setSocket_id(socketid)
                setSession(prev => ({...prev, mTurkcode: mTurkcodeGenerated, socket_id: socketid}))
            }
        })

        socket.on('resultArrived', ({participants, roundIndex}) => {

            let choices = PLAYERSLIST.map(ele => ({...participants.find(participant => participant.role === ele.name)?.results[roundIndex], role: ele.name}))
            // console.log('choices resultArrived: ')
            setChoiceList(choices)
            setCount(prev => prev + 1)
        })

        socket.on('totalGroupResultArrived', ({totalGroupWater, result}) => {
            console.log('totalGroupWater: result: ', totalGroupWater, result )

            setTotalGroupWater(totalGroupWater)

            const finalScores = result?.map(ele => ele.results[ele.results.length - 1].totalScore);


            setFinalScores(finalScores)         
        }) 

        socket.on('gameEnded', (room) => {
            // console.log('gameEnded: ', room )
            setGameEnded(true)
        }) 

        socket.on('finalResultTable', (room) => {
            // console.log('finalResultTable!!!!!!!!!!!!!!!: ')
            setShowFinalResultTable(true)
        }) 

        socket.on('finalResultTableEnd', (room) => {
            // console.log('finalResultTable END!!: ')
            setShowFinalResultTable(false)
        }) 

        socket.on("waitingRoomTime", (waitingRoomTime) => {
           setWaitingRoomTime(waitingRoomTime)
        })

        socket.on("waitingRoom2Time", (waitingRoom2Time) => {
            setWaitingRoom2Time(waitingRoom2Time)
         })

        socket.on("resultDuration", (resultDuration) => {          
            setResultDuration(resultDuration)
         })

        socket.on("practiceEndDuration", (resultDuration) => {

            if (resultDuration == 9) {
            setShowPracticeEndNotification(true)
        } else if (resultDuration == 0) {
            setShowPracticeEndNotification(false)
        }
        setPracticeEndDuration(resultDuration)
        })

        socket.on("gameStopDuration", (gameStopDuration) => {
            setGameStopDuration(gameStopDuration)
        })

        socket.on("depletion", (part, roundIndex) => {    
            // console.log('depletion: ', part, roundIndex)

            if (part === 'first') {
                setGameState(
                    {
                        ...gameState, isDepletedFirstPart: true, roundIndex: roundIndex
                    }
                )
            } else if (part === 'second') {
                setGameState(
                    {
                        ...gameState, isDepletedSecondPart: true, roundIndex: roundIndex
                    }
                )
            }
        })

         socket.on("showGameStop", (roomIndex) => {  
            // console.log('showGameStop, roomIndex: Game ', roomIndex)      
          

            // if (roomIndex < 12) {
            //     setGameState(
            //         {
            //             ...gameState, now: 56
            //         }
            //     )
            // } else if (roomIndex >= 12 && roomIndex < 22) {
            //     setGameState(
            //         {
            //             ...gameState, now: 98
            //         }
            //     )
            // }

            setShowGameStop(true)
         })

         socket.on("waitingRoomAgain", async (room) => { 
            // console.log('waitingRoomAgain 시그널이 왔네요: ', room)
            // console.log('session RoomAgain: ', session)
            //세션들에 방에서 쫓겨난 정보를 적고 데이터 베이스 세이브
            // 자기 세션에 쫓겨난 방 정보 적기
            // 유아이 정리
            // setSession(prev => ({...prev, gameAttemps: [...prev?.gameAttemps, room]}))

            // if (session) {
                // await updateSessionToMongoDB({...session, gameDropped: true, gameAttemps: [...session?.gameAttemps, room]})
            // }
            // setGameStart(false)
            // setClientCount(0);
            // setRoundTimer(60)
            // setParticipantsReady(false)
            // setParticipantsReady2(false)
            // setRole('');
            // setRoleReady(true)
                
            // window.location.reload();
            // setRoundEnd(false)
            // setGameEnded(false)
            navigate('/dropout?type=424')
         })

         socket.on("gamePrematureOver", async (room) => { 
            // console.log('gamePrematureOver 시그널이 왔네요: ', room)
            // console.log('session PrematureOver: ', session)
            //세션들에 방에서 쫓겨난 정보를 적고 데이터 베이스 세이브
            // 자기 세션에 쫓겨난 방 정보 적기
            // 유아이 정리
            // if (session) {
            //     await updateSessionToMongoDB({...session, gameDropped: true, gameCompleted: false })
            // }
            // setSession(prev => ({...prev, gameDropped: true, gameCompleted: false}))
            // 
            // setSession(prev => ({...prev, gameAttemps: [...prev?.gameAttemps, room]}))
            // await updateSessionToMongoDB({...session, gameAttemps: [...session?.gameAttemps, room]})
            navigate('/dropout?type=424')
         })

         socket.on("gameNotRespondedOver", async (roleDropped) => { 
            // console.log('gameNotRespondedOver 시그널이 왔네요: 나간신분 role: ', roleDropped)
            //세션들에 방에서 쫓겨난 정보를 적고 데이터 베이스 세이브
            // 자기 세션에 쫓겨난 방 정보 적기
            // 유아이 정리
            setSession(prev => ({...prev, gameDropped: true, gameCompleted: false}))
            // await updateSessionToMongoDB({...session, gameDropped: true, gameCompleted: false})
            navigate('/dropout?type=424')
         })

         socket.on("youNotResponded", async (roleDropped) => { 
            // console.log('youNotResponded 시그널이 왔네요: 나간신분 role: ', roleDropped)
            //세션들에 방에서 쫓겨난 정보를 적고 데이터 베이스 세이브
            // 자기 세션에 쫓겨난 방 정보 적기
            // 유아이 정리
            setSession(prev => ({...prev, gameDropped: true, gameCompleted: false}))
            // await updateSessionToMongoDB({...session, gameDropped: true, gameCompleted: false})
            navigate('/dropout?type=400')
         })

         socket.on("endGameStop", () => { 
            setShowGameStop(false)
         })
    }

    const disconnectFromSocket = () => {
        // socket.emit("leaveRoom", sessionDataStorage?._id)
        // socket.off('client_count')
        // socket.off('leaving')
        // socket.off('left')
        // socket.off('hello_world')
        // socket.off('join')
        setSocket(null)
    }

    const notifyParticipantLeft = () => {
        // console.log('participantLeft: ', gameState.roomName)
        socket?.emit('participantLeft', gameState.roomName);
    };

    const notifyParticipantNotResponded = ({room_name, player_id}) => {
        // console.log('notifyParticipantNotResponded, room: ', room_name, player_id)

        socket?.emit("participantNotResponded", ({room_name: room_name, player_id: player_id}))
        navigate('/dropout?type=400')
    };

    useEffect(() => {
        window.addEventListener('beforeunload', notifyParticipantLeft);
    
        return (
            () => {
                console.log('hello beforeunload')
                window.removeEventListener('beforeunload', notifyParticipantLeft);  
            }
        )
      }, [gameState])

    // useEffect(() => {
        // Notify the server when the player is leaving the game
   

        // Detect when the user closes the tab or window
        // window.addEventListener('beforeunload', () => {
        //     notifyParticipantLeft(gameState.roomName, role.socketid); 
        // });

        // Optionally: detect if the user navigates away from the tab
        // document.addEventListener('visibilitychange', () => {
        //     if (document.visibilityState === 'hidden') {
        //         notifyParticipantLeft(gameState.roomName, role.socketid); // User moved away from the tab
        //     }
        // });

        // Clean up when the component is unmounted
        // return () => {
            // notifyParticipantLeft(gameState.roomName, role.socketid); 
            // window.removeEventListener('beforeunload', notifyParticipantLeft);
            // document.removeEventListener('visibilitychange', notifyParticipantLeft);
    //     };
    // }, [socket, gameState, role])

    return (
        <GameContext.Provider value={{ role, gameState, setGameState, choice, setChoice, socket, currentRound, choiceList, setChoiceList, totalGroupWater, setTotalGroupWater, showFinalResultTable, setShowFinalResultTable, finalScores, showGameStop, setShowGameStop, gameStopDuration, waitingRoom2Time, notifyParticipantNotResponded, notifyParticipantLeft}}>
            {/* <Round roundTimer={roundTimer} roundEnd={roundEnd} currentRound={currentRound} currentWater={currentWater} count={count} resultDuration={resultDuration} /> */}
            {/* <SecondInstructionStage roundTimer={roundTimer} participantsReady2={participantsReady2} completedUser2={completedUser2} treat={gameState.treat} />  */}
        
            {
                gameStart && !participantsReady && !isSecondInstructionStage ? 
                <ParticipantsReady />
                :   
                participantsReady && roleReady && !isSecondInstructionStage ?
                <div className={styles.container}>
                <RoleSelection role={role} />
                </div>
                :
                !roleReady && !isSecondInstructionStage ?
                <Round roundTimer={roundTimer} roundEnd={roundEnd} currentRound={currentRound} currentWater={currentWater} count={count} resultDuration={resultDuration} showPracticeEndNotification={showPracticeEndNotification} practiceEndDuration={practiceEndDuration} finalScores={finalScores}/>
                :
                !isSecondInstructionStage ?
                <WaitingRoom notifyParticipantLeft={notifyParticipantLeft} gameState={gameState} clientCount={clientCount} setClientCount={setClientCount} waitingRoomTime={waitingRoomTime} session={session} setSession={setSession}/>
                :
                <SecondInstructionStage roundTimer={roundTimer} participantsReady2={participantsReady2} completedUser2={completedUser2} /> 
            }
        </GameContext.Provider>
    );
}

export default Game;