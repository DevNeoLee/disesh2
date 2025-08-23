const path = require('path');
const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);

const cors = require('cors');

// const helmet = require('helmet');

const url = require('url');



// app.use(helmet())
app.use(cors());
app.use(express.json());

const mongoDB = require('./utils/dbConnect')
const log = require('./utils/logger');

const Game = require('./model/game');
const Session = require('./model/session')

const io = require('socket.io')(server,
    { serveClient: false }
)

app.use(function(req, res, next) {
	req.io = io;

	next();
});


// Session.find({}).then((data) => {
//     console.log('allSessions data: ', data)
// });

mongoDB();

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const sessionRouter = require('./router/sessionRouter');
const gameRouter = require('./router/gameRouter')

//데이터베이스콜은 api를 통해서 
app.use('/api/session', sessionRouter);
app.use('/api/game', gameRouter);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
} else {
    app.get('/', (req, res) => { 
        console.log('------------******* hello from backend', req.ip)
        return res.send("hello world from express")
    })
}


let rooms = [];
const roles = ['Farmer1', 'Farmer2', 'Farmer3', 'Farmer4', 'Farmer5'];
const MAX_PARTICIPANTS_PER_ROOM = 5;

const rounds = ['Practice A', 'Practice B', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']

function getAvailableRoomIndex(treat) {
    return rooms.findIndex((room) => room.participants?.length < MAX_PARTICIPANTS_PER_ROOM && !room.inGame && (room.treat === treat));
}
  
async function createNewRoom(treat) {
    const newRoom = {
        roomName: "",
        state: 'waiting',
        inGame: false,
        gameDropped: false,
        gameCreatedTime: null,
        gameStartTime: null,
        gameEndTime: null,
        gameStarted: false,
        gameCompleted: false,
        participants: [],
        gameResults: [],
        roundTimer: null,
        waitingRoomTimer: null,
        waitingRoom2Timer: null,
        resultTimer: null,
        gameStopTimer: null,
        roundDuration: 60,
        resultDuration: 20,
        gameStopDuration: 40,
        secondInstructionCompletedUsers: [],
        roundIndex: 0, // 0 - 21
        rounds: [...rounds],
        currentRound: rounds[0], //  name of round
        totalRounds: 22, 
        roles: ['Farmer1', 'Farmer2', 'Farmer3', 'Farmer4', 'Farmer5'],
        currentWater: 60,
        waitingRoomTime: 300,
        waitingRoom2Time: 300,
        previousWater: 60,
        rechargeWater: 5,
        isSecondInstructionStage: false,
        isDepletedFirstPart: false,
        isDepletedSecondPart: false,
        treat,
        
        now: 10,
    };

    const createdRoom = await createGameToDB(newRoom);

    rooms.push(createdRoom);

    return createdRoom;
}

function findRoomByParticipantId(participantId) {
    return rooms.find((room) => room.participants?.some((participant) => participant.id === participantId));
}

function getRole(room) {
    const role = room.roles[Math.floor(Math.random() * room.roles.length)]
    let index =room.roles.indexOf(role)
    room?.roles?.splice(index, 1)
    return role;
}

async function startGame (room) {
    //roles 다시 원상 복귀, 다음 게임 롤 설정을 위하여
    room.roles = ['Farmer1', 'Farmer2', 'Farmer3', 'Farmer4', 'Farmer5'];
    room.state = 'roundInProgress';
    room.inGame = true;
    room.gameStartTime = new Date();
    room.gameStarted = true;
    // show particpants ready 
    io.in(room.roomName).emit('startGame', room);
    await updateGameToDB(room)

    room.waitingTimeout = setTimeout(() => {
        io.in(room.roomName).emit('participantsReady');
        // show randomly selected role ready 
        room.roleTimeout = setTimeout(() => {
            io.in(room.roomName).emit('roleReady', room);
            startRound(room)
        }, 3000); 
    }, 3000); 
}

async function startRound(room) {
    console.log('inside startRound function: ')
    if (room.resultTimer) {
        console.log('cleared resultTimer in startRound')
        clearInterval(room.resultTimer);
        room.resultTimer = null;
    }

    if (room.roundTimer) {
        console.log('이게 아직도 있나요....cleared roundTimer in startToCountResultForAll')

        clearInterval(room.roundTimer)
        room.roundTimer = null;
    }

    if (room.waitingTimeout) {
        console.log('cleared waitingTimeout in startRound')

        clearTimeout(room.waitingTimeout);
        room.waitingTimeout = null;
    }

    if (room.waitingRoom2Timer) {
        console.log('cleared waitingRoom2Timer in startRound')

        clearTimeout(room.waitingRoom2Timer);
        room.waitingRoom2Timer = null;
    }

    if (room.roleTimeout) {
        console.log('cleared roleTimeout in startRound')

        clearTimeout(room.roleTimeout);
        room.roleTimeout = null;
    }

    if (room.resultTransitonTimeout) {
        console.log('cleared resultTransitonTimeout in startRound')

        clearTimeout(room.resultTransitonTimeout);
        room.resultTransitonTimeout = null;
    }

    // if (room.gameStopTimer) {
    //     clearInterval(room.gameStopTimer)
    //     room.gameStopTimer = null;
    // }

    if (room.roundTimer) {
        console.log('cleared roundTimer in startRound')

        clearInterval(room.roundTimer)
        room.roundTimer = null;
    }
        console.log("아직 인게임 startRound: ", room?.roomName)
        room.state = 'roundInProgress';

        if (room.roundIndex == 12) {
            room.now = 62;
            room.currentWater = 60;
            room.previousWater = 60;
        }

        if (room.roundIndex == 2) {
            room.currentWater = 60;
            room.previousWater = 60;
            room.now = 22;
        }

        if (room.roundIndex == 0) {
            room.now = 14;
        }

        // update new round infos
        io.in(room.roomName).emit('roundUpdate', room);

        if (room.inGame) {

            // Start the round timer
            room.roundTimer = setInterval(() => {
                room.roundDuration -= 1;
                const everyArrived = room.participants?.every((ele) => ele.results[room.roundIndex]?.choice)
                
                io.in(room.roomName).emit('roundTimer', room.roundDuration);
            
                if ((everyArrived )) {
                    clearInterval(room.roundTimer)
                    room.roundTimer = null;
    
                    startToCountResultForAll(room)
                } else if (room.roundDuration == 0 ) {

                }
            }, 1000);
        } 
}

function startToCountResultForAll(room) {
    if (room.roundTimer) {
        clearInterval(room.roundTimer)
        room.roundTimer = null;
    }

    if (room.roundTimer) {
        clearInterval(room.roundTimer)
        room.roundTimer = null;
    }

    //최종 결산(Summary)를 보여주는 라운드의 resultDuration에 따른 화면 변화 웹소켓 emit들, finalResultTable, finalResultTableEnd
    if (room.roundIndex == 21 ) {
        console.log('==== 최종결산 startToCountResultForAll 콜 ==== ')
        room.resultDuration = 20;
        let finalResultTable = false;

        room.resultTimer = setInterval(() => {
            room.resultDuration -= 1;
            io.in(room.roomName).emit('resultDuration', room.resultDuration);
        
            // 총 10라운드 최종 결산을 보여주는 표 디스플레이
            if (room.resultDuration == 2 && !finalResultTable) {
                io.in(room.roomName).emit('finalResultTable', room);
                room.resultDuration = 20;
                finalResultTable = true;
            }

            if (room.resultDuration == 1) {
                endRound(room);
            }
            
            if (room.resultDuration == 0) {
                io.in(room.roomName).emit('finalResultTableEnd', room);
            }
        }, 1000);
    } else {
        room.resultTimer = setInterval(() => {
            room.resultDuration -= 1;
            io.in(room.roomName).emit('resultDuration', room.resultDuration);
        
            if (room.resultDuration == 0) {
                endRound(room);
            }
        }, 1000);
    }
}

function endWaitingRoom2Time(room) {
    if (room.waitingRoom2Timer) {
        clearTimeout(room.waitingRoom2Timer);
        room.waitingRoom2Timer = null;
    }
}

function startSecondInstruction(room) {

    if (room.gameStopTimer) {
        clearInterval(room.gameStopTimer)
    }
    room.state = 'secondInstruction';

    let allUserFinishedSecondInstruction = false;

    room.isSecondInstructionStage = true,
    room.roundDuration = 200000,

    io.in(room.roomName).emit('secondInstructionStage', room);

    //1초마다 5명이 전부 퀴즈까지 다 끝냈는지 검토
    room.roundTimer = setInterval(() => {
        room.roundDuration -= 1;
        io.in(room.roomName).emit('roundTimer', room.roundDuration);
    
        // 5명 모두, 다 마무리 했을경우
        if (room.secondInstructionCompletedUsers.length >= 5) {
            allUserFinishedSecondInstruction = true;
        }

        if (room.roundDuration == 0 || allUserFinishedSecondInstruction) {
            room.isSecondInstructionStage = false;

            // 여기서 룸내용 다시 정리 한번 해주고
            room = updateRoundToPartTwo(room)
            
            io.in(room.roomName).emit('secondInstructionStageEnd', room);

            room.waitingTimeout = setTimeout(() => {
                //모든 player들이 다 준비가 됐을경우니까
                io.in(room.roomName).emit('participantsReady2');
                //두번째 인스트럭션 퀴즈 전부 끝나고 새로운 10개 라운드 2초후 시작
                room.roleTimeout = setTimeout(() => {
                    io.in(room.roomName).emit('secondSetStart');
                    startRound(room)
                }, 2000); 

            }, 3000); 
        }
    }, 1000);
}

// depletion의 경우 그리고 Part1 이어서 Part2 게임이 진행될게 남아있는 경우
// 빠진 각 라운드들에 임의로 totalWater 값을 압데 해줌. Part1의 마지막 라운드 변함 없는 결과 값을 추가해 줍니다. 
function fixDataForSkippingRounds(room) {

    room.participants?.forEach(participant => {
        const totalWater = participant.results[participant.results.length - 1].totalWater;
        const totalScore = participant.results[participant.results.length - 1].totalScore;
        while ( participant.results.length < 12) {
            participant.results.push({ totalWater: totalWater, totalScore: totalScore })
        }
    })

    while (room.gameResults.length < 12) {
        room.gameResults.push({roundIndex: room.gameResults.length, round: "", updatedSortedResult: room.gameResults[room.gameResults.length - 1].updatedSortedResult, totalGroupWater: 0})
    }

    // room.participants.forEach((participant, index) => {
    //     if (index === 0) {
    //         console.log('participant.results example after: ', participant.results)
    //     }
    // })

    // room.gameResults.forEach((result, index) => {
    //     console.log('participant.results example after: ', index, result.updatedSortedResult)
    // })
}

//게임을 끝내고 또한 다음 라운드(혹 다음 상황들)를 위해서 다시 자료들을 리셋해주고 direct해주는 펑션
function endRound(room) {
    if (room.resultTimer) {
        clearInterval(room.resultTimer);
        room.resultTimer = null;
    }

    if (room.resultTransitonTimeout) {
        clearTimeout(room.resultTransitonTimeout);
        room.resultTransitonTimeout = null;
    }

    if (room.waitingRoomTimer) {
        clearInterval(room.waitingRoomTimer);
        room.waitingRoomTimer = null;
    }

    if (room.waitingTimeout) {
        clearTimeout(room.waitingTimeout);
        room.waitingTimeout = null;
    }
    if (room.roleTimeout) {
        clearTimeout(room.roleTimeout);
        room.roleTimeout = null;
    }

    if (room.roundTimer) {
        clearInterval(room.roundTimer);
        room.roundTimer = null;
    }

    if (room.waitingRoom2Timer) {
        clearInterval(room.waitingRoom2Timer);
        room.waitingRoom2Timer = null;
    }
     

    // Stop the round timer
    clearInterval(room.roundTimer);
    room.currentWater += 5;
    room.previousWater = room.currentWater;
    
    room.resultDuration= 20;

    room.roundTimer = null;
    
    //라운드가 끝났음을 모든 방에 알린다.
    room.state = 'roundEnded';
    io.in(room.roomName).emit('roundEnded', room);

    //물이 15미만이 되면 FirstPart에서인지 SecondPart에서인지를 표시하고 GameStop 메세지를 15초 보여준다
    // 다만 라운드인덱스가 11 혹 21 인 경우, 즉 마지막 라운드인경우는 정상종료로 처리 됩니다.
    if (room.previousWater < 15) {        
        if (room.roundIndex < 11) {
         
            room.isDepletedFirstPart = true;
            fixDataForSkippingRounds(room);
            console.log('isDepletedFirstPart: ', room.isDepletedFirstPart)
            startGameStop(room);
        } else if (room.roundIndex < 21) {

            room.isDepletedSecondPart = true;
            console.log('isDepletedSecondPart: ', room.isDepletedSecondPart)
            startGameStop(room);
        } else if (room.roundIndex == 21) {
            startGameStop(room);
        }
    } else {
        //마지막 라운드 일때(FirstPart/SecondPart) GameStop 메세지를 40초 보여준다
        if (room.roundIndex == 11 || room.roundIndex == 21 ) {
            startGameStop(room);
            if (room.roundIndex == 21) {
                room.gameCompleted = true;
            }
        // 전반부(10라운드 + 2연습 라운드)가 끝나고 후반부가 시작하기전에
        } else if (room.roundIndex == 1) {
            if (room.inGame) {
                // when practice rounds finished
                // 이걸로 프랙티스 끝남 Notification 이 나오는 탕디밍 결정해줌.
                room.resultDuration = 10;
                room.resultTimer = setInterval(() => {
                    room.resultDuration -= 1;
                    io.in(room.roomName).emit('practiceEndDuration', room.resultDuration);
                
                    if (room.resultDuration == 0) {
                        room.roundIndex += 1;
                        room.roundDuration = 60; // Reset the round duration
                    
                        room.resultDuration = 20;
                        room.currentRound = rounds[room.roundIndex]
                        startRound(room);
                    }
                }, 1000);
        }
        //다음라운드가 계속 진행되는 라운드일때
        } else {
            if (room.inGame) {
                // Prepare for the next round
                room.resultTransitonTimeout = setTimeout(() => {
                    room.roundIndex += 1;
                    room.roundDuration = 60; // Reset the round duration
                    room.now = 14 + (room.roundIndex * 4 );
                    room.currentRound = rounds[room.roundIndex]
                    startRound(room);
                }, 500); //
            } else {
                startRound(room);
            }
        }
    }
}

function endGameStopTimer(room) {
    if (room.gameStopTimer) {
        clearInterval(room.gameStopTimer);
        room.gameStopTimer = null;
    }

    if (room.roundIndex < 12) {
        room.gameStopDuration = 40;
        io.in(room.roomName).emit('endGameStop');
    } 
}

function updateRoundToInitialize(room) {
    // Stop the round timer
    clearInterval(room.roundTimer);
    room.roundTimer = null;

    room.roundIndex += 1;
    room.roundDuration = 60;
    room.currentRound = rounds[room.roundIndex]
    return room;
}

function updateRoundToPartTwo(room) {
    // Stop the round timer
    if (room.roundTimer) {
        clearInterval(room.roundTimer)
        room.roundTimer = null;
    }
    room.roundTimer = null;
    room.now = 62;
    room.roundIndex = 12;
    room.roundDuration = 60;
    room.currentRound = rounds[room.roundIndex]
    return room;
}

function endGame(room) {
    console.log('Game ended.');
    io.in(room.roomName).emit('gameEnded', room);
}

const getScore = (choice) => {
    if (choice == '0') {
        return 2;
    } else if (choice == '1') {
        return 5;
    }
}

const getWater = (choice) => {
    if (choice == '0') {
        return 1;
    } else if (choice == '1') {
        return 3;
    }
} 

const getPreviousWaterTotal = (participant, index) => {
    //if practice round is finished return waterTotal default again
    if (index == 1) {
        return 0;
    } else {
        return Number(participant.results[index].totalWater);
    }
}

const getPreviousScoreTotal = (participant, index) => {
    let totalWater = 0;
    //if practice round is finished return scoreTotal default again
    if (index == 1) {
        return 0;
    } else {
        return (Number(participant.results[index].totalScore));
    }
}

const sortResult = (results) => {

    let sortedResults = [];
    results.forEach(ele => {
        if (ele.role == 'Farmer1') {
            sortedResults[0] = ele
        } else if (ele.role == 'Farmer2') {
            sortedResults[1] = ele
        } else if (ele.role == 'Farmer3') {
            sortedResults[2] = ele
        } else if (ele.role == 'Farmer4') {
            sortedResults[3] = ele
        } else if (ele.role == 'Farmer5') {
            sortedResults[4] = ele
        }
    })
    
    // console.log('sorted Results: ', sortedResults)
    return sortedResults;
}

const calculateTotalGroupWater = (sortedResult, roomFound, roundIndex) => {
    const totalWaterUsed = sortedResult.reduce((acc, value) => Number(value.results[roundIndex].water) + acc, 0)
    return totalWaterUsed;
}

const createGameToDB = async (data) => {
    try {
        const newGame = new Game({
            ...data,
            gameCreatedTime: new Date(),
          });  

        const createdGame = await newGame.save();
        createdGame.roomName = createdGame._id + "_" + rooms.length;

        console.log('createdGame: roomName', createdGame?.roomName);

        // Update roomName with the generated _id after successful creation
        const updatedGame = await updateGameToDB(createdGame)
    
        return updatedGame;
    } catch (err) {
        console.error('Error creating game:', err);
    }
  };

async function updateGameToDB(room) {
    try {
        const updatedGame = await Game.findByIdAndUpdate(room._id, room, { new: true });
        console.log("Updated game to MongoDB through API", updatedGame?._id);
        return updatedGame;
    } catch (err) {
        console.error(err);
    }
}

function startGameStop(room) {
    console.log('room.roundIndex: part1, part2: ', room.roundIndex, room.isDepletedFirstPart, room.isDepletedSecondPart)

    //depletion message to Front End
    if (room.isDepletedFirstPart && room.roundIndex < 11) {
           console.log('222: ');
        io.in(room.roomName).emit('depletion', 'first', room.roundIndex);
           console.log('333: ');
    } else if (room.isDepletedSecondPart && room.roundIndex > 11 && room.roundIndex < 21) {
        io.in(room.roomName).emit('depletion', 'second', room.roundIndex);
    }

    // showGameStop message to Front End
    io.in(room.roomName).emit('showGameStop', room.roundIndex);

    // Start the gameStop timer
    if (room.roundIndex < 21) {
        if (room.roundTimer) {
            clearInterval(room.roundTimer);
            room.roundTimer = null;
        }

        room.gameStopTimer = setInterval(() => {
            if (room.gameStopDuration == 0) {
                endGameStopTimer(room);
    
                if (room.isDepletedFirstPart && room.roundIndex <= 11) {
                    startSecondInstruction(room);
                } else if (room.roundIndex == 11 && !room.isDepletedFirstPart ) {
                    startSecondInstruction(room);
                }
    
            } else {
                io.in(room.roomName).emit('gameStopDuration', room.gameStopDuration);
                room.gameStopDuration -= 1;
            }
        }, 1000);
    }
}

function startSurvey(room) {
    if (room.resultTimer) {
        clearTimeout(room.resultTimer);
        room.resultTimer = null;
    }

    if (room.resultTransitonTimeout) {
        clearTimeout(room.resultTransitonTimeout);
        room.resultTransitonTimeout = null;
    }

    if (room.waitingRoomTimer) {
        clearTimeout(room.waitingRoomTimer);
        room.waitingRoomTimer = null;
    }

    if (room.waitingTimeout) {
        clearTimeout(room.waitingTimeout);
        room.waitingTimeout = null;
    }
    if (room.roleTimeout) {
        clearTimeout(room.roleTimeout);
        room.roleTimeout = null;
    }

    if (room.roundTimer) {
        clearInterval(room.roundTimer);
        room.roundTimer = null;
    }

    if (room.gameStopTimer) {
        clearInterval(room.gameStopTimer);
        room.gameStopTimer = null;
    }
    io.in(room.roomName).emit('startSurvey');
}

function startWaitingRoom2Timer(roomFound, time) {
    roomFound.waitingRoom2Timer = setInterval(() => {
        time -= 1;
        io.in(roomFound.roomName).emit('waitingRoom2Time', time);
    
        if (time == 0) {
            endWaitingRoom2Time(roomFound);
        }
    }, 1000);
}

function getMturkcode(socketid, time) {
    const today = new Date(time);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    console.log(`${year}${month}${day}_${socketid}_b`)
    return `${year}${month}${day}_${socketid}_b`;
}

//게임 웹소켓 로직
io.on("connection", socket => {
    log.info(`User connected ${socket.id}`);

    console.log('=====================  Welcome Newly connected socket ===================== ')
    console.log('io.engine.clientsCount!: ', io.engine.clientsCount) // 현재 몇명 접속
    
    //현재 몇명 접속 정보 이벤트
    // io.emit("client_count", "New user connected, current count: ", io.engine.clientsCount)
    
    //join room event 
    socket.on('createOrJoinRoom', async ({treat}) => {
        // console.log('rooms createOrJoinRoom: ', rooms)
        console.log('++ ++ createOrJoinRoom')

        const roomIndex = getAvailableRoomIndex(treat);
        const room = rooms[roomIndex];
        //if the room to join is available
        if (roomIndex !== -1) {
            // 방에 정원이 다 찾는데 그리고 게임이 아직 시작된 상태가 아니면
          if (room.participants?.length === MAX_PARTICIPANTS_PER_ROOM - 1 && !room.inGame) {
              console.log('creating New Game...')
            if (room.waitingRoomTimer) {
                clearTimeout(room.waitingRoomTimer);
                room.waitingRoomTimer = null;
            }

              socket.join(room.roomName);
              const roleSelected = getRole(room);
              const mTurkcodeGenerated = getMturkcode(socket.id, room.gameCreatedTime);
              room.participants.push({ mTurkcode: mTurkcodeGenerated, socket_id: socket.id, role: roleSelected, results: [], extraScore: 0});
              io.in(room.roomName).emit('roleSelected', roleSelected, socket.id, mTurkcodeGenerated);
              io.in(room.roomName).emit('joinedRoom', {roomId: room._id, roomName: room.roomName, size: room.participants.length});
            
              startGame(room)

            //방에 정원이 아직 다 안 찾고 그리고 게임이 아직 시작된 상태가 아니면
            } else {
                const roleSelected = getRole(room);
                const mTurkcodeGenerated = getMturkcode(socket.id, room.gameCreatedTime);
                socket.join(room.roomName);
                room.participants.push({ mTurkcode: mTurkcodeGenerated, socket_id: socket.id, role: roleSelected, results: [], extraScore: 0});
                io.in(room.roomName).emit('roleSelected', roleSelected, socket.id, mTurkcodeGenerated);
                io.in(room.roomName).emit('joinedRoom', {roomId: room._id, roomName: room.roomName, size: room.participants.length});
            }
        //if the room to join is NOT available, create one
        } else {
          const newRoom = await createNewRoom(treat);

          socket.join(newRoom.roomName);
          const roleSelected = getRole(newRoom);
          const mTurkcodeGenerated = getMturkcode(socket.id, newRoom.gameCreatedTime);
          newRoom.participants.push({ mTurkcode: mTurkcodeGenerated, socket_id: socket.id, role: roleSelected, results: [], extraScore: 0});
          io.in(newRoom.roomName).emit('roleSelected', roleSelected, socket.id, mTurkcodeGenerated);
          io.in(newRoom.roomName).emit('joinedRoom', {roomId: newRoom._id, roomName: newRoom.roomName, size: newRoom.participants.length});

            // Start waiting room timer
            newRoom.waitingRoomTimer = setInterval(() => {
                newRoom.waitingRoomTime -= 1;
                io.in(newRoom.roomName).emit('waitingRoomTime', newRoom.waitingRoomTime);
            
                if (newRoom.waitingRoomTime == 0) {
                    console.log('room waiting time expired!')
                }
            }, 1000);
            console.log('newRome from create/join: ', newRoom)
        }
    })

    socket.on("secondQuizDone", ({room_name, player_id}) => {
        let roomFound = rooms.find((room) => room.roomName == room_name)

        roomFound.now = 62;
        let uniqueEntry = !roomFound?.secondInstructionCompletedUsers.includes(player_id)

        roomFound.secondInstructionCompletedUsers.push(player_id)
        io.in(roomFound.roomName).emit('secondWaitingRoomJoins', {users: roomFound.secondInstructionCompletedUsers});

        if (roomFound.waitingRoom2Timer == null ) {
            startWaitingRoom2Timer(roomFound, roomFound.waitingRoom2Time)
        }
    })

    socket.on("decisionNotice", async ({room_name, player_id, choice}) => {
        console.log('decisionNotice receiving from client to server: ', room_name, player_id, choice)

        const roomFound = rooms.find((room) => room.roomName == room_name)
        // console.log('roomFound decisionNotice: ', roomFound)
        const round = roomFound.currentRound;
        const roundIndex = roomFound.roundIndex;
        const participants = roomFound.participants;
        // console.log('participants: decisionNotice', participants)
        const participant = participants.find((participant => participant.socket_id == player_id))
        // console.log('participant: ', participant)
        const score = getScore(choice)
        const water = getWater(choice)
        const totalWater = roundIndex == 0 || roundIndex === 12 ?  water : water + getPreviousWaterTotal(participant, roundIndex - 1)
        const totalScore = roundIndex == 0 ?  score : score + getPreviousScoreTotal(participant, roundIndex - 1)

        participant?.results?.push({roundIndex, round, choice, water, totalWater, score, totalScore, crop: choice == '0' ? "A" : "B"})

        io.in(room_name).emit('resultArrived', {participants, roundIndex});

        const allFiveEnteredResults = participants.filter(participant => participant.results?.[roundIndex])
        
        //'treat' types will direct how much ExtraScore could be given out
        const calculateExtraScore = (sortedResult, treat,  previousWater, unsortedParticipants, totalGroupWaterUsed) => {
            const sortedParticipants = [];
            unsortedParticipants.forEach(ele => {
                if (ele.role == 'Farmer1') {
                    sortedParticipants[0] = ele
                } else if (ele.role == 'Farmer2') {
                    sortedParticipants[1] = ele
                } else if (ele.role == 'Farmer3') {
                    sortedParticipants[2] = ele
                } else if (ele.role == 'Farmer4') {
                    sortedParticipants[3] = ele
                } else if (ele.role == 'Farmer5') {
                    sortedParticipants[4] = ele
                }
            })

            let currentWater;
            
            if (roundIndex == 21) {
                console.log('roundIndex 22', previousWater, roundIndex)
                currentWater = previousWater - totalGroupWaterUsed;
            } else {
                console.log('not 22', previousWater, roundIndex)
                currentWater = previousWater - totalGroupWaterUsed + 5;
            }

            const cropAQuantities = sortedParticipants.map(participant => {
                const cropACount = participant.results.reduce((acc, result) => {
                    if (result.roundIndex > 11 && result.crop == 'A') {
                        return acc + 1;
                    } else {
                        return acc;
                    }
                }, 0)
                return cropACount;
            });

            const cropAQuantityTotal = cropAQuantities.reduce((acc, quantity) => quantity + acc);

            const waterConsumptions = sortedParticipants.map(participant => participant.results[participant.results.length - 1].totalWater);

            const waterConsuptionTotal = waterConsumptions.reduce((acc, consumption) => consumption + acc)
            
        }

        const getUpdatedResultWithExtraScore = (sortedResult, room, totalGroupWater) => {
            const updatedSortedResult = calculateExtraScore(sortedResult, room.treat, room. room.currentWater, room.participants, totalGroupWater);
            return updatedSortedResult;
        }

        if (allFiveEnteredResults?.length > 4) {
            const sortedResult = sortResult(allFiveEnteredResults, roomFound);
            const totalGroupWater = calculateTotalGroupWater(sortedResult, roomFound, roundIndex)
            let updatedSortedResult;
            //특정 round 일 경우에만 extraScore를 받는다. 
            if (roundIndex == 21) {
                // console.log('1 gogo')
                roomFound.gameCompleted = true;
                roomFound.gameEndTime = new Date();
                updatedSortedResult = getUpdatedResultWithExtraScore(sortedResult, roomFound, totalGroupWater)
            } else {
                updatedSortedResult = sortedResult;
            }

            roomFound.currentWater = roomFound.currentWater - totalGroupWater;
            console.log('1 updatedSortedResult: ', updatedSortedResult)
            //game state update
            roomFound.gameResults.push({roundIndex, round, updatedSortedResult, totalGroupWater: totalGroupWater})

            //game state save in DB
            await updateGameToDB(roomFound)

            //game state share to every players
            io.in(room_name).emit('totalGroupResultArrived', {totalGroupWater: totalGroupWater, result: updatedSortedResult});
        }
    })

    socket.on('session_mongo_all', (room_name) => {
        io.emit('session_mongo_all')
    });

    socket.on("decisionReadyTimer", (room_name) => {
        // io.in(room_name).emit('decisionReady');
    })

    socket.on("disconnecting", () => {
        console.log("someone leaving the room", socket.id)
        console.log('rooms from disconnecting: ', rooms.map(room => room.roomName))

        // rooms.forEach((room, roomId) => {
        //     const participantIndex = room.participants.forEach((ele, i) => {
        //         if (ele.id == socket.id) {
        //             return i;
        //         } else {
        //             return -1;
        //         }
        //     })

        //     if (participantIndex !== -1) {
        //         room.participants.splice(participantIndex, 1);

        //         if (room.participants.length == 0) {
        //             if (room.roundTimer) {
        //                 clearTimeout(room.roundTimer);
        //                 room.roundTimer = null;
        //             }

        //             if (room.waitingRoomTimer) {
        //                 clearTimeout(room.waitingRoomTimer);
        //                 room.waitingRoomTimer = null;
        //             }

        //             if (room.resultTimer) {
        //                 clearTimeout(room.resultTimer);
        //                 room.resultTimer = null;
        //             }
                
        //             if (room.resultTransitonTimeout) {
        //                 clearTimeout(room.resultTransitonTimeout);
        //                 room.resultTransitonTimeout = null;
        //             }

        //             if (room.waitingTimeout) {
        //                 clearTimeout(room.waitingTimeout);
        //                 room.waitingTimeout = null;
        //             }
        //             if (room.roleTimeout) {
        //                 clearTimeout(room.waitroleTimeoutingRoomTimer);
        //                 room.roleTimeout = null;
        //             }

        //             const index = rooms.indexOf(room);
        //             if (index !== -1) {
        //                 rooms.splice(index, 1);
        //             }
        //         }
        //     }
        // });
    })

    socket.on("disconnect", () => {
        // io.emit("client_count", "A user disconnected, count: ", io.engine.clientsCount)
        console.log("someone left current page", socket.id)
        console.log('io.engine.clientsCount!: ', io.engine.clientsCount) // 현재 몇명 접속
        console.log('-------------------------------------: ')
    })

    socket.on("norman_chat", (data) => {
        let room = io.sockets.adapter.rooms.get('1')
        console.log('chat content from Norman: ', data)
        socket.broadcast.to('1').emit('norman_chat', data)
    })

    socket.on("set_isGameOver", () => {
        let room = io.sockets.adapter.rooms.get('1')
        io.emit('set_isGameOver')
    })

    socket.on("user_left_frontend", () => {
        console.log('user_left_frontend received from backend!')

        // console.log('io.engine.clientsCount!: ', io.engine.clientsCount) // 현재 몇명 접속
    })

    socket.on('sessionUpdate', async (data) => {
        const { sessionID, updateData } = data;

        await Session.updateOne({ _id: sessionID }, { $set: updateData })
        .then(() => console.log('Session updated successfully'))
        .catch(err => console.error('Error updating session:', err));

        // socket.broadcast.emit('sessionUpdate', { sessionID, updateData });
    })

    socket.on('player-decision', async (data) => {
        try {
            const { playerId, decision } = data;
            const sessionData = await Session.findOneAndUpdate(
                { playerId },
                { $set: { decision } },
                { new: true } // Return the updated document
            );

            if (sessionData) {
                socket.emit('choice-updated', sessionData); // Send confirmation or updated data
            }
        } catch (error) {
            console.error('Error updating session data:', error);
        }
    });

    socket.on('participantLeft', async (roomName) => {
        console.log('participantLeft: roomName, roleID: ', roomName )

        const room = rooms.find(room => room.roomName === roomName);

        if (room) {
            console.log('== 한분 나가셨습니다. 지금 room 의 상황 : ', room.state, room.roundIndex < 3)

            const participantWentOut = room.participants?.find(participant =>participant.socket_id === socket.id)
            const participantsRest = room.participants?.filter(participant =>participant.socket_id !== socket.id)
            console.log('participantWentOut: ', participantWentOut)
            // console.log('participantsRest: ', participantsRest)
            
            
            if (room.state == 'waiting') {
                console.log('== 아직 waiting room...: ')
                console.log('room.participants: ')
                //add back roles available list to the room
                const availableRole = room.participants?.find(participant =>participant.socket_id === socket.id).role
                console.log('availableRole: ', availableRole)
                room.roles = [...room.roles, availableRole]
             
                // Remove the participant from the room
                room.participants = room.participants?.filter(participant => participant.socket_id !== socket.id);
                console.log('rooms after: ', rooms)
                // console.log('room.participants: ', room.participants)
                // Notify other players in the room about the updated player list
                io.to(roomName).emit('updateParticipants', room.participants);
        
                // Leave the room in Socket.io
                socket.leave(roomName);
        
                // 나간 사람의 소켓을 끊어냅니다.
                const socketWhoLeft = io.sockets.sockets.get(socket.id);
                if (socketWhoLeft) {
                    console.log(' 나간 사람의 소켓을 끊어냅니다.')

                    socketWhoLeft.disconnect();
                }

                // 나간사람이 방의 마지막 사람이었을경우, 방을 없앱니다. If the room is empty, remove it
                if (room.participants.length === 0) {
                    rooms = rooms.filter(ele => ele.roomName !== roomName);
                }
                console.log('========= 아직 웨이팅 룸 =============: ', rooms)
            } else if ( room.state == 'roundInProgress' && room.roundIndex <= 1) {
      

                // Leave the room in Socket.io 한 사람 나갔고 4명 남음.
                socket.leave(roomName);

                //남은 사람들만 방에 남기기, 깨진방으로 정리, 방깨진 시간 기록
             
                room.gameDropped = true;
                room.gameEndTime = new Date();
                room.participantDropped = participantWentOut;
                //이 깨진 룸에 대한 기록 데이터베이스 저장 
                await updateGameToDB(room)

                room.participants = participantsRest
                //그 정보를 남겨진 사람들에게 보내고
                io.to(roomName).emit('waitingRoomAgain', room);

                // Disconnect the user
                room.participants.forEach(participant => {
                const socketToKick = io.sockets.sockets.get(participant.socket_id);
                    if (socketToKick) {
                        socketToKick.disconnect();
                    }
                })

                // 나간 사람의 소켓을 끊어냅니다.
                const socketWhoLeft = io.sockets.sockets.get(socket.id);
                if (socketWhoLeft) {
                         console.log(' 나간 사람의 소켓을 끊어냅니다.')

                    socketWhoLeft.disconnect();
                }

                //방 목록에서 이 방을 지웁니다. 
                rooms = rooms.filter(ele => ele.roomName !== roomName);

                console.log('========= 다시 웨이팅 룸 =============: 남은방들: ', rooms)
            } else if ( (room.state == 'roundInProgress' && room.roundIndex > 1 && room.roundIndex < 21) || (room.state == 'roundInProgress' && room.roundIndex == 21 && room.resultDuration == 20) || room.state == 'secondInstruction') {
                console.log("-- 게임도중 끝났음으로: round: 끝냅니다. 게임도 끝나고, 방은 폭발", room.roundIndex, )

                // Leave the room in Socket.io 한 사람 나갔고 4명 남음.
                socket.leave(roomName);

                room.gameDropped = true;
                room.gameEndTime = new Date();
                room.participantDropped = participantWentOut;
                //이 깨진 룸에 대한 기록 데이터베이스 저장 
                await updateGameToDB(room)

   
                //남은 사람들만 방에 남기기, 깨진방으로 정리, 방깨진 시간 기록
                room.participants = participantsRest;
                //그 정보를 남겨진 사람들에게 보내고
                io.to(roomName).emit('gamePrematureOver', room);

                // Disconnect the user
                room.participants.forEach(participant => {
                const socketToKick = io.sockets.sockets.get(participant.socket_id);
                    if (socketToKick) {
                        socketToKick.disconnect();
                    }
                })

                // 나간 사람의 소켓을 끊어냅니다.
                const socketWhoLeft = io.sockets.sockets.get(socket.id);
                if (socketWhoLeft) {
                         console.log(' 나간 사람의 소켓을 끊어냅니다.')
                    socketWhoLeft.disconnect();
                }

                //방 목록에서 이 방을 지웁니다. 
                rooms = rooms.filter(ele => ele.roomName !== roomName);
                console.log('남은 방들 rooms: ', rooms)
                console.log('========= 이제 gamePrematureOver ===========남은 방들 rooms: ', rooms)
            } else if ( room.state == 'roundInProgress' && room.roundIndex == 21 && room.resultDuration < 20) {
                console.log("-- 게임22라운드 다 마친후, result화면에서 나간경우 입니다. 게임만 끝나고, 나갔다는 메세지는 안보내도 됩니다.", room.roundIndex, )

                // Leave the room in Socket.io 한 사람 나갔고 4명 남음.
                socket.leave(roomName);

                room.gameDropped = true;
                room.gameEndTime = new Date();
                room.participantDropped = participantWentOut;
                //이 깨진 룸에 대한 기록 데이터베이스 저장 
                await updateGameToDB(room)

                //남은 사람들만 방에 남기기, 깨진방으로 정리, 방깨진 시간 기록
                room.participants = participantsRest;

                // Disconnect the user
                room.participants.forEach(participant => {
                const socketToKick = io.sockets.sockets.get(participant.socket_id);
                    if (socketToKick) {
                        socketToKick.disconnect();
                    }
                })

                // 나간 사람의 소켓을 끊어냅니다.
                const socketWhoLeft = io.sockets.sockets.get(socket.id);
                if (socketWhoLeft) {
                         console.log(' 나간 사람의 소켓을 끊어냅니다.')
                    socketWhoLeft.disconnect();
                }

                //방 목록에서 이 방을 지웁니다. 
                rooms = rooms.filter(ele => ele.roomName !== roomName);
                console.log('남은 방들 rooms: ', rooms)
                console.log('========= 이제 gamePrematureOver ===========남은 방들 rooms: ', rooms)
            }
        }
    });

    socket.on('participantNotResponded', async ({room_name, player_id}) => {
        console.log('participantNotResponded: roomName, roleID: ', room_name, player_id)

        const room = rooms.find(room => room.roomName === room_name);

        if (room) {
            console.log(`== 라운드 ${room.roundIndex} 에서 시간 초과가 발생했습니다. : `, room.state, room.roundIndex < 3)

            const participantNotResponded = room.participants?.find(participant =>participant.socket_id === socket.id)
            const participantsRest = room.participants?.filter(participant =>participant.socket_id !== socket.id)
            // console.log('participantNotResponded: ', participantNotResponded)
            // console.log('participantsRest: ', participantsRest)

            //남은 사람들만 방에 남기기, 깨진방으로 정리, 방깨진 시간 기록
    
            room.gameDropped = true;
            room.gameEndTime = new Date();
            room.participantNotResponded = participantNotResponded;
            //이 깨진 룸에 대한 기록 데이터베이스 저장 
            await updateGameToDB(room)
     
            const socketsInRoom = io.sockets.adapter.rooms.get(room_name)

            if (socketsInRoom) {
                for (const socketId of socketsInRoom) {
                    if (socketId === participantNotResponded.socket_id) {
                        // Send a message specifically to the current socket
                        // console.log('안녕하세요!', socketId, participantNotResponded.socket_id)
                        // io.to(socketId).emit('youNotResponded', participantNotResponded.role);
                    } else {
                        // Send a different message to other sockets
                        io.to(socketId).emit('gameNotRespondedOver', participantNotResponded.role);
                    }
                };
            }
            // 소켓에서 사용자를 땝니다.
            room.participants.forEach(participant => {
                const socketToKick = io.sockets.sockets.get(participant.socket_id);
                if (socketToKick) {
                    socketToKick.disconnect();
                }
            })

            // 나간 사람의 소켓을 끊어냅니다.
            const socketWhoLeft = io.sockets.sockets.get(socket.id);
            if (socketWhoLeft) {
                     console.log(' 나간 사람의 소켓을 끊어냅니다.')
                socketWhoLeft.disconnect();
            }

            //깨졌음으로 방을 없앱니다. Remove the room
            rooms = rooms.filter(ele => ele.roomName !== room_name);

            console.log('========= 반응 없어서 쫓겨남 =============: 남은방들: ', rooms)

            socket.leave(room_name);
        
        }
    })
        
    // socket.on('disconnecting', () => {
    //     // Handle disconnecting: Remove the user from all rooms they are in
    //     socket.rooms.forEach((roomName) => {
    //         if (rooms[roomName]) {
    //             rooms[roomName] = rooms[roomName].filter(player => player.socketId !== socket.id);

    //             // Notify remaining players
    //             io.to(roomName).emit('updateRoom', rooms[roomName]);

    //             // Delete the room if it's empty
    //             if (rooms[roomName].length === 0) {
    //                 delete rooms[roomName];
    //             }
    //         }
    //     });

    //     console.log(`${socket.id} is disconnecting`);
    // });
})

server.listen(port, () => {
        log.info(`🚀 Server is listening at port: ${port} 🚀`);
        console.log(`Server is running on the port ${port}, from express server`)
    }
)
