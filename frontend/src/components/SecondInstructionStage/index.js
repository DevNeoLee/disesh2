import { useState, useEffect, useContext } from 'react'

import Instruction2 from "../Instruction2";
import Quizzes2 from "../Quizzes2"
import QuizSolution2 from '../QuizSolution2';
import WaitingRoom2 from '../WaitingRoom2';

import { GameContext } from '../../pages/Game';
import ParticipantsReady from '../Game/ParticipantsReady';

export default function SecondInstructionStage({roundTimer, participantsReady2, completedUser2}) {
  const [isInstruction, setIsInstruction] = useState(true);
  const [isQuizDone, setIsQuizDone] = useState(false);
  const playerSize = 5;

  const { role, gameState, setGameState, choice, setChoice, socket, setTotalGroupWater, scores, setChoiceList, notifyParticipantLeft} = useContext(GameContext);

  return (
    <div>
      {
        isInstruction 
        ?
        <Instruction2 setIsInstruction={setIsInstruction} scope={gameState.scope} payoff={gameState.payoff}/>
        :
        isQuizDone && !participantsReady2
        ?
        <WaitingRoom2 notifyParticipantLeft={notifyParticipantLeft} gameState={gameState} playerSize={playerSize} clientCount={completedUser2} />
        :
        !participantsReady2
        ?
        <Quizzes2 setIsQuizDone={setIsQuizDone} socket={socket} gameState={gameState}/>
        :
        <ParticipantsReady />
      }
    </div>
  )
}
