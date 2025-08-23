
import styles from './stat.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState} from 'react';
import HOST from "../../utils/routes";
import Accordion from 'react-bootstrap/Accordion';
import NeverStartedGames from '../../components/Stats/NeverStartedGames';
import GamesStartedDroppedAfterPractices from '../../components/Stats/GamesStartedDroppedAfterPractices';
import GamesStartedDroppedBeforePractices from '../../components/Stats/GamesStartedDroppedBeforePractices';
import GamesCompleted from '../../components/Stats/GamesCompleted';
import SessionsAll from '../../components/Stats/SessionsAll';
import SessionsCompleted from '../../components/Stats/SessionsCompleted';
import axios from 'axios';
import { FiletypeCsv } from 'react-bootstrap-icons';
import { CSVLink } from 'react-csv';
import { states } from '../Survey/DataQuestionnaire';

const Stat = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate()

  const [dataGames, setDataGames] = useState(null);
  const [dataSessions, setDataSessions] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')

  const [sessionsSurveyCompleted, setSessionsSurveyCompleted] = useState([])

  const [neverStartedGames, setNeverStartedGames] = useState([]);
  const [notMadeToActualRounds, setNotMadeToActualRounds] = useState([]);
  const [gamesMadeToActualRoundsButDropped, setGamesMadeToActualRoundsButDropped] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [csvObject, setCsvObject] = useState([
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Mary', age: 35, city: 'Chicago' }
  ])

  useEffect(() => {

    const prepareCSV = async () => {
      const apiUrlGame = `${HOST}api/game?year=${queryParams.get('year')}&month=${queryParams.get('month')}&day=${queryParams.get('day')}`;
      const apiUrlSession = `${HOST}api/session?year=${queryParams.get('year')}&month=${queryParams.get('month')}&day=${queryParams.get('day')}`;

      const objectOrder = [
        "date",
        "type",
        "MTurk Code",
        "Quiz 1",
        "Quiz 2",
        "Group ID",
        "Player ID",
        "Round Practice A Decision",
        "Round Practice A Cumulative Earnings",
        "Round Practice A RemRech",
        "Round Practice B Decision",
        "Round Practice B Cumulative Earnings",
        "Round Practice B RemRech",
        "Round A Decision",
        "Round A Cumulative Earnings",
        "Round A RemRech",
        "Round B Decision",
        "Round B Cumulative Earnings",
        "Round B RemRech",
        "Round C Decision",
        "Round C Cumulative Earnings",
        "Round C RemRech",
        "Round D Decision",
        "Round D Cumulative Earnings",
        "Round D RemRech",
        "Round E Decision",
        "Round E Cumulative Earnings",
        "Round E RemRech",
        "Round F Decision",
        "Round F Cumulative Earnings",
        "Round F RemRech",
        "Round G Decision",
        "Round G Cumulative Earnings",
        "Round G RemRech",
        "Round H Decision",
        "Round H Cumulative Earnings",
        "Round H RemRech",
        "Round I Decision",
        "Round I Cumulative Earnings",
        "Round I RemRech",
        "Round J Decision",
        "Round J Cumulative Earnings",
        "Round J RemRech",
        "Round K Decision",
        "Round K Cumulative Earnings",
        "Round K RemRech",
        "Round L Decision",
        "Round L Cumulative Earnings",
        "Round L RemRech",
        "Round M Decision",
        "Round M Cumulative Earnings",
        "Round M RemRech",
        "Round N Decision",
        "Round N Cumulative Earnings",
        "Round N RemRech",
        "Round O Decision",
        "Round O Cumulative Earnings",
        "Round O RemRech",
        "Round P Decision",
        "Round P Cumulative Earnings",
        "Round P RemRech",
        "Round Q Decision",
        "Round Q Cumulative Earnings",
        "Round Q RemRech",
        "Round R Decision",
        "Round R Cumulative Earnings",
        "Round R RemRech",
        "Round S Decision",
        "Round S Cumulative Earnings",
        "Round S RemRech",
        "Round T Decision",
        "Round T Cumulative Earnings",
        "Round T RemRech",
        "Extra Score",
        "Final Game Score",
        "Survey Q1",
        "Survey Q2",
        "Survey Q3",
        "Survey Q4",
        "Survey Q5",
        "Survey Q6",
        "Survey Q7",
        "Survey Q8",
        "Survey Q9",
        "Survey Q10",
        "Survey Q11",
        "Survey Q12",
      ]

      const idealResult = [
        {"Practice A": "NA"},
        {"Practice B": "NA"},
        {"A": "NA"},
        {"B": "NA"},
        {"C": "NA"},
        {"D": "NA"},
        {"E": "NA"},
        {"F": "NA"},
        {"G": "NA"},
        {"H": "NA"},
        {"I": "NA"},
        {"J": "NA"},
        {"K": "NA"},
        {"L": "NA"},
        {"M": "NA"},
        {"N": "NA"},
        {"O": "NA"},
        {"P": "NA"},
        {"Q": "NA"},
        {"R": "NA"},
        {"S": "NA"},
        {"T": "NA"}
      ]

      const getRemainingArray = (participants) => {
        let remainingWater = 60;
        const remainingWaterArray = Array(22).fill('NA')
        let updatedIdealResult = Array(22).fill('NA');
        // console.log('participants a: ', participants)

        const participantChoices = participants.map(participant => {
          const choices = participant.results.map(result => result.crop)
          return choices
        })

        if (participantChoices.every(choices => choices.length > 0)) {
          // console.log('participantChoices: ', participantChoices)
          updatedIdealResult = idealResult.map((item, index) => {
            if (participantChoices.every((choices) => choices[index])) {
              if (index == '2' || index == '12') {
                remainingWater = 60;
              }
              participantChoices.forEach(choices => {
            
                choices[index] == 'A' ? remainingWater = remainingWater - 1 : remainingWater = remainingWater - 3;
              })
              if (index != '21' && index != '11') {
                // console.log('remainingWater before: ', remainingWater)
                remainingWater = remainingWater + 5;
                // console.log('remainingWater after: ', remainingWater, index)
              } 
              return remainingWater;
            } else {
              return 'NA'
            }
          })
        }

        // console.log('updatedIdealResult: ', updatedIdealResult)
        return updatedIdealResult;
      }

      const getFinalTotalScores = (participants) => {
        const extraScorePlusTotalScores = participants.map(participant => {
          const finalScore = participant.results[participant.results.length - 1]?.totalScore + participant.extraScore;
          return finalScore
        })

        // console.log('extraScorePlusTotalScores: ', extraScorePlusTotalScores)
        return extraScorePlusTotalScores;
      }

      const generatecsvObject = async (dataGame, year, month, day, sessions) => {
        // console.log('dataGame: ', dataGame);
        const csvArray = [];

        dataGame.forEach(game => {
          if (game.participants.length > 0) {
            const remainingWaterArray = getRemainingArray(game.participants)
            // console.log('remainingWaterArray: ', remainingWaterArray)

            const finalScoresArray = getFinalTotalScores(game.participants)

            game.participants.forEach((participant, parIdx) => {
              // console.log('participant: ', participant)
              const mapped = idealResult.map((item, indexR) => {
                // console.log('item: ', item)
                if (participant.results[indexR] && participant.results[indexR].round) {

                  return {[`Round ${participant.results[indexR].round} Decision`]: participant.results[indexR].crop, [`Round ${participant.results[indexR].round} Cumulative Earnings`]:  participant.results[indexR].totalScore, [`Round ${participant.results[indexR].round} RemRech`]: remainingWaterArray[indexR] }
                } else {
                  return {[`Round ${Object.keys(item)[0]} Decision`]: "NA", [`Round ${Object.keys(item)[0]} Cumulative Earnings`]: "NA", [`Round ${Object.keys(item)[0]} RemRech`]: "NA" }
                }
              })
              // console.log('participant.results: ', participant.results)
              // const mappedParticipantResult = participant.results.map(result => ({[`Round ${result.round} Decision`]: result.crop, [`Round ${result.round} Cumulative Earnings`]: result.totalScore }))
              // console.log('participant: ', participant)

              let mappedSecondTime = {}
              mapped.forEach(item => mappedSecondTime = {...item, ...mappedSecondTime}) 

              csvArray.push({
                date: `${year}-${month}-${day}`,
                type: `${game.treat}`,
                "MTurk Code": participant.mTurkcode ? participant.mTurkcode : "",
                // "Quiz 1": participant.preQuiz.length > 0 ? 1 : 0,
                "Quiz 1": 1,
                "Quiz 2": game.secondInstructionCompletedUsers.includes(participant.socket_id) ? 1 : 0,
                "Group ID": game.roomName,
                "Player ID": participant.role,
                ...mappedSecondTime,
                "Extra Score": participant.extraScore,
                "Final Game Score": (typeof finalScoresArray[parIdx] === 'number' && !Number.isNaN(finalScoresArray[parIdx])) ? finalScoresArray[parIdx] : "NA",
              })
            })
        }
        })
        // console.log('data csvObject before: ' , csvArray)
        // console.log('data csv sessions: ' , sessions)

        // 이날 들어왔던 모든 사람들(세션들)의 자료 하나하나에서 csvArray모은 자료를 기반으로 해서
        sessions.forEach(session => {
          //게임에 들어가지는 못했으나 퀴즈는 푼(엠터크 코드는 있는 사람들) 추가
          if (session.mTurkNumber && !csvArray.find(ele => ele["MTurk Code"] == session.mTurkNumber )) {
            const mappedSession = {
              date: `${year}-${month}-${day}`,
              type: `${session.treat}`,
              "MTurk Code": session.mTurkNumber ? session.mTurkNumber : "",
              "Quiz 1": session.preQuiz.length > 0 ? 1 : 0,
              "Quiz 2": 0,
              "Group ID": "",
              "Player ID": "",
            }
            csvArray.push(mappedSession)
          //서베이 마친 결과를 게임을 온전히 끝낸 그룹에게 넣어주기
          } else if ( session.survey.length > 0 && session.mTurkNumber && csvArray.find(ele => ele["MTurk Code"] == session.mTurkNumber)) {
            const surveyObject = {};
            // console.log('session.survey: ', session.survey)
            session.survey.forEach(item => {
              if (item.id == '3') {
                // console.log('states[Number(item.answer)]: ', states[Number(item.answer)])
                surveyObject[`Survey Q${item.id}`] = states[Number(item.answer)]
              } else {
                surveyObject[`Survey Q${item.id}`] = Number(item.answer)
              }
            })

            // console.log('surveyObject: ', surveyObject)

            csvArray.forEach((ele, i) => {
              if (ele["MTurk Code"] == session.mTurkNumber) {
                csvArray[i] ={ ...ele, ...surveyObject}
              } 
            })
          
          }
        })

        const orderedCSVArray = csvArray.map(object => {
          const sortedObj = objectOrder.reduce((acc, key) => {
            if (object.hasOwnProperty(key)) {
              acc[key] = object[key];  // Add keys based on the custom order
            }
            return acc;
          }, {});
          return sortedObj;
        })

        // console.log('data csvObject after: ' , orderedCSVArray)
        setCsvObject(orderedCSVArray)
      }

      const fetchDataSessions = async () => {
          try {
            const response = await axios.get(apiUrlSession);
            // Check if the response is successful (status code 200)
            // if (!response.ok) {
            //   throw new Error('Network response was not ok');
            // }
    
            // Parse JSON dataGames from the response
            // const result = await response.json();

            if (response) {
              setDataSessions(response.data.data); // Set the dataGames in state
              processSessions(response.data.data);
              return response.data.data;
            }
          } catch (err) {
            setError(err.message); // Set error if any
          } finally {
            setLoading(false); // Set loading to false after fetching is done
          }
      };

      const fetchDataGames = async (year, month, day, sessions) => {
        const response = await axios.get(apiUrlGame);
        // Check if the response is successful (status code 200)
        // if (!response.ok) {
        //   throw new Error('Network response for games was not ok');
        // }

        // Parse JSON dataGames from the response
        // const result = await response.json();

        if (response) {
          setDataGames(response.data.data); // Set the dataGames in state
          processGames(response.data.data);
          generatecsvObject(response.data.data, year, month, day, sessions);
        }
      };

      if (queryParams.get('year') && queryParams.get('month') && queryParams.get('day')) {
          // console.log('welcome, result dataGames for: ', queryParams.get('month'), queryParams.get('day'))
          setYear(queryParams.get('year'))
          setMonth(queryParams.get('month'))
          setDay(queryParams.get('day'))
          const anySession = await fetchDataSessions();

          if (anySession) {
            fetchDataGames(queryParams.get('year'), queryParams.get('month'), queryParams.get('day'), anySession);
          }
      } else {
          console.log('not matched parameters')
          navigate('/notfound')
      }
    }
   prepareCSV();
  }, [])

  const processSessions = (sessions) => {  
    const sessionsSurveyCompleted = sessions.filter(session => session.survey?.length > 2)
    // console.log('sessionsSurveyCompleted: ', sessionsSurveyCompleted)
    setSessionsSurveyCompleted(sessionsSurveyCompleted);
  }

  const processGames = (games) => {  
    const gamesNeverStarted = games.filter(game => game.participants?.length < 2)
    // console.log('numberOfGamesNeverStarted: ', gamesNeverStarted.length)
    setNeverStartedGames(gamesNeverStarted)

    const gamesNeverMadeToActualRounds = games.filter(game => game.participants.length > 2 && ["Practice A", "Practice B"].includes(game.currentRound))
    // console.log('gamesNeverMadeToActualRounds: ', gamesNeverMadeToActualRounds)
    setNotMadeToActualRounds(gamesNeverMadeToActualRounds)

    const gamesMadeToActualRoundsButDropped = games.filter(game => game.participants.length > 2 && !["Practice A", "Practice B"].includes(game.currentRound) && game.gameStarted && game.gameDropped)
    // console.log('gamesMadeToActualRoundsButDropped: ', gamesMadeToActualRoundsButDropped)
    setGamesMadeToActualRoundsButDropped(gamesMadeToActualRoundsButDropped)

    const gamesCompleted = games.filter(game => game.gameStarted && !game.gameDropped)
    setCompletedGames(gamesCompleted)   
  }

  // Render the component UI
  if (loading) {
      return <div>Loading...</div>;
  }
  
  if (error) {
      return <div>Error: {error}</div>;
  }

  //raw data_DISES H3 (GW, CE)_012825
  if (dataSessions) {
      return (
          <div className={styles.container}>
            <div className={styles.box}>
              <div className={styles.title}>
                  <h1 style={{ fontSize: "2rem", color: "#0065ff", marginBottom: "3rem", letterSpacing: "1px", lineHeight: "1.3"}}>Daily Statistics</h1>
                  <div className={styles.menu}>
                    <h2 style={{ marginRight: "10rem", fontSize: "2rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3"}}>{year}-{month}-{day} <span style={{ color: "darkblue"}}>games: <span style={{ color: "blue"}}>{JSON.stringify(dataGames?.length)}, </span></span><span style={{ color: "darkblue"}}>sessions: <span style={{ color: "blue"}}>{JSON.stringify(dataSessions?.length)}</span></span> </h2>
                    <CSVLink
                      data={csvObject}
                      filename={`data_DISES_${month}_${day}_${year}.csv`}
                    >
                      <FiletypeCsv size="30" className={styles.csvFile}/>
                    </CSVLink>
                  </div>
              </div>
              <div className={styles.paragraph}>
                <h2 style={{ fontSize: "2rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3"}}>Games ( {JSON.stringify(dataGames?.length)} )</h2>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion defaultActiveKey={null}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>Games Never Started ( {neverStartedGames.length} )</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <NeverStartedGames data={neverStartedGames}/>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>Games Started & Dropped Before 'Round A'( {notMadeToActualRounds.length} )</h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <GamesStartedDroppedBeforePractices data={notMadeToActualRounds} />
                    </Accordion.Body>
                  </Accordion.Item>
                  </Accordion>
                </div>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>Games Started & Dropped After 'Round A'( {gamesMadeToActualRoundsButDropped.length} )</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <GamesStartedDroppedAfterPractices data={gamesMadeToActualRoundsButDropped} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>Games Started & Completed ( {completedGames.length} )</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <GamesCompleted data={completedGames} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
              <div className={styles.paragraph}>
                <h2 style={{ fontSize: "2rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3"}}>Sessions ( {JSON.stringify(dataSessions?.length)} )</h2>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>People who Completed Survey( {sessionsSurveyCompleted.length} )</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <SessionsCompleted data={sessionsSurveyCompleted} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div style={{ padding: "1rem", margin: "0.5rem"}}>
                  <Accordion>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <h3 style={{ fontSize: "1.5rem", color: "#0065ff", letterSpacing: "1px", lineHeight: "1.3", marginLeft: "2rem"}}>All Sessions( {dataSessions.length} )</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <SessionsAll data={dataSessions} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        );
  }
 
}

export default Stat;