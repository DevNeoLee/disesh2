import { useState, useEffect, useContext } from 'react';
import {Link} from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';

import { Table, Form, Row, Spinner, Badge } from 'react-bootstrap';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import styles from './decisionresult.module.css';
import { GameContext } from '../../pages/Game'

import Radio from '../Radio';

import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, Label, ComposedChart, Area,LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Rectangle } from 'recharts';
import { useAppContext } from '../../AppContext'; 
import PracticeNotification from '../PracticeNotification';
import { ChevronRight } from 'react-bootstrap-icons';

export const FarmersDecision = () => {
    const { treat, session, setSession, setTreat} = useAppContext();
    const { role, gameState, setGameState, choice, setChoice, socket, currentRound, choiceList} = useContext(GameContext);

    const handleRowClick = (e, index) => {
        // console.log('handleRowClick: ', index)
        setChoice(index)
    }

    return (
        <div className={styles.main}>
        <div className={`${styles.timeSuggestion}`}><p>* Please make your decision within <span style={{ color: "red", fontSize: "19px"}}>60 seconds</span> or you will be considered a <span style={{ color: "red", fontSize: "19px"}}>dropout</span>.</p></div>
        <div>
                <div >
                    <h4 style={{ marginLeft: "40px", marginBottom: "30px"}}>Which crop do you choose to grow?</h4>
                    <p style={{ marginLeft: "40px"}}>- Please select your crop choice (Crop A or Crop B)</p>
                    <p style={{ marginLeft: "40px"}}>- Then click the "MAKE DECISION" button below to submit your selection.</p>
                 
                    <p></p>
                    <div className={styles.mid}>
                        <div className={styles.midForm}>
                            <div className={styles.form}>
                                <Form>
                                <Table bordered hover >
                                    <thead className={styles.head} >
                                        <tr className={styles.row} >
                                            <th>

                                            </th>
                                            <th
                                            style={{ fontSize: "1.2rem", textAlign: "center"}}
                                            >
                                            Crop
                                            </th>
                                            <th
                                            style={{ fontSize: "1.2rem", textAlign: "center"}}
                                            >
                                            Water Use
                                            </th>
                                            <th
                                            style={{ fontSize: "1.2rem", textAlign: "center"}}
                                            >
                                            Income
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={ styles.body}>
                                        <tr
                                            onClick={(e) => handleRowClick(e, '0')}
                                        >       
                                            <td style={{ cursor: "pointer"}}>
                                                <div style={{ marginTop: "17px", height: "50px", width: "5rem", textAlign: "center", cursor: "pointer"}}>
                                                    <Radio handleChange={(e)=>console.log('')} checked={choice == '0'} name="abc" id="b" value="0" required={"required"}/>    
                                                </div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "0" ? "#0065ff" : "", cursor: "pointer"}} data-label="">
                                                 <div style={{ color: choice == "0" ? "white" : "", height: "50px", marginTop: "22px", textAlign: "center", fontSize: "1.4rem", textAlign: "center", cursor: "pointer"}}>
                                                    A
                                                </div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "0" ? "#0065ff" : "", cursor: "pointer"}} data-label="">
                                                 <div style={{ color: choice == "0" ? "white" : "", height: "50px", marginTop: "22px", textAlign: "center",  fontSize: "1.4rem", cursor: "pointer"}}>
                                                    {/* <Droplet color={choice == "0" ? "white": "#0065ff"} style={{ fontSize: "2rem"}}/> */}
                                                    <img src="/drop.png" width="30px"/>
                                                    <div style={{ textAlign: "center", width: "100%"}}>1 unit</div>
                                                </div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "0" ? "#0065ff" : "", cursor: "pointer", position: "relative"}} data-label="">
                                                 <div style={{ color: choice == "0" ? "white" : "", height: "50px", marginTop: "21px", textAlign: "center",  fontSize: "1.4rem", cursor: "pointer"}}>
                                                  <img src="/coin.png" width="30px"/>  <img src="/coin.png" width="30px"/>
                                                </div>
                                                <div style={{ position: "absolute", textAlign: "center", width: "100%", color: choice == "0" ? "white" : "", bottom: "1px", right: "0px"}}>2 tokens</div>

                                            </td>
                                        </tr>
                                            
                                        <tr
                                            onClick={(e) => handleRowClick(e, '1')}
                                        >
                                            <td style={{ cursor: "pointer"}}>
                                            <div style={{ marginTop: "17px", height: "50px", width: "5rem", textAlign: "center", cursor: "pointer"}}>
                                                <Radio handleChange={(e)=>console.log('')} checked={choice == '1' ? true : false} name="abc" id="a" value="1" required={"required"} />
                                            </div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "1" ? "#0065ff" : "", cursor: "pointer"}} >
                                                <div style={{color: choice == "1" ? "white" : "black", height: "50px", width: "5rem", marginTop: "22px", textAlign: "center",  fontSize: "1.4rem", cursor: "pointer"}}>
                                                    B
                                                </div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "1" ? "#0065ff" : "", cursor: "pointer"}} >
                                                <div style={{color: choice == "1" ? "white" : "black", marginTop: "22px", textAlign: "center",  fontSize: "1.4rem", cursor: "pointer"}}>
                                                    <img src="/drop.png" width="30px"/>    <img src="/drop.png" width="30px"/>    <img src="/drop.png" width="30px"/>
                                                </div>
                                                <div style={{ color: choice == "1" ? "white" : "", textAlign: "center"}}>3 units</div>
                                            </td>
                                            <td  style={{ backgroundColor: choice == "1" ? "#0065ff" : "", cursor: "pointer"}} >
                                                 <div style={{color: choice == "1" ? "white" : "black", marginTop: "22px",  textAlign: "center",  fontSize: "1.4rem", cursor: "pointer"}}>
                                                      <img src="/coin.png" width="30px"/><img src="/coin.png" width="30px"/><img src="/coin.png" width="30px"/><img src="/coin.png" width="30px"/><img src="/coin.png" width="30px"/>    
                                                </div>
                                                <div style={{ color: choice == "1" ? "white" : "", textAlign: "center"}}>5 tokens</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                    </Form>
                            </div> 
                        </div>
                        <div style={{ position: "absolute", right: "5px", top: "0px", zIndex: -300}}>
                            <img src="/gr.png" width="450px"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Result = ({currentWater, showPracticeEndNotification, practiceEndDuration}) => {
    const { treat, session, setSession, setTreat} = useAppContext();
    const { role, gameState, setGameState, choice, setChoice, choiceList, totalGroupWater, setTotalGroupWater, currentRound, extraScores, showFinalResultTable, setShowFinalResultTable} = useContext(GameContext);
    const [tokensAllocated, setTokensAllocated] = useState([{user1: null}, {user2: null}, {user3: null}, {user4: null}, {provider: null}])

    const [pv, setPv] = useState(0);
    const [recharge, setRecharge] = useState(0);

    useEffect(() => {
        if (totalGroupWater) {
            console.log('totalGroupWater: extraScores: ', totalGroupWater, extraScores)
            setPv(currentWater - totalGroupWater)
            setRecharge(5);
        }
    }, [totalGroupWater])

    useEffect(() => {
        setPv(0)
        setRecharge(0)
        setTotalGroupWater(0)
    }, [currentRound])


    const data = [
        {
          name: 'At the Beginning (this round)',
          uv: 0.1,
          line: 15,
          pv: gameState.previousWater,
          amt: gameState.previousWater,
        },
        {
          name: '',
          vv: 20,
          line: 15, 
          amt: currentWater - totalGroupWater,
        },
        {
          name: 'At the End (this round)',
          uv: recharge,
          pv: pv,
          line: 15, 
          amt: currentWater - totalGroupWater + 5,
        }
      ];

      const popoverRemainingWater = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Total Available Water</Popover.Header>
          <Popover.Body>
            {gameState.previousWater} units
          </Popover.Body>
        </Popover>
      );

      const popoverConsumptionTotalBase = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Left after Usage</Popover.Header>
          <Popover.Body>
            {gameState.previousWater - totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const popoverConsumptionTotalTop = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Total Water Used</Popover.Header>
          <Popover.Body>
            {totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const rechargedCurrentWaterBase = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Left after Usage</Popover.Header>
          <Popover.Body>
            {gameState.previousWater - totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const rechargeWater = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Recharge</Popover.Header>
          <Popover.Body>
            5 units
          </Popover.Body>
        </Popover>
      );

    return (
        <div className={styles.mainResult}>
            <div className={`${styles.hoverSuggestion}`}><p>* Please hover your mouse over each bar in the plot to see more detailed information.</p></div>
            <div className={styles.left}>
                <div className={styles.leftInside}>
                    <div className={styles.graphTitle}>
                        <h2>Groundwater Level </h2>

                    </div>
                    {/* remaining water */}
                    <OverlayTrigger trigger={['hover', 'focus']}  placement="bottom" overlay={popoverRemainingWater} style={{ zIndex: "30013"}}>
                        <div style={{ 
                              color: "white", height: `calc(${ 173 * gameState.previousWater / 60}px)`, backgroundColor: "#0065ff", width: "81px", bottom: "50px", left: "100px", position: "absolute", zIndex: "1000", transition: "500ms"
                        }}><div style={{ textAlign: "center", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{gameState.previousWater} units</div></div>
                    </OverlayTrigger>
                    {/* water consumption total Base*/}
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverConsumptionTotalBase} style={{ zIndex: "30013"}}>
                        <div style={{ 
                            color: "white", height: totalGroupWater ? `calc(${173 * (gameState.previousWater - totalGroupWater) / 60}px)` : 0, backgroundColor: "#0065ff", width: "81px", bottom: "50px", left: "260px", position: "absolute", zIndex: "1000", transition: "500ms"
                        }}><div style={{ textAlign: "center", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{totalGroupWater ? gameState.previousWater - totalGroupWater: null} {totalGroupWater ? "units" : null}</div> </div>
                    </OverlayTrigger>

                    {/* water consumption total Top*/}
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverConsumptionTotalTop} style={{ zIndex: "30013"}}>
                        <div style={{ 
                            color: "#a6182d", height: totalGroupWater ? `calc(${173 * (totalGroupWater) / 60}px)` : 0, border: totalGroupWater ? "2px dotted #a6182d" : null, backgroundColor: "null", width: "81px", bottom: `calc(${(173 * (gameState.previousWater - totalGroupWater ) / 60) + 50}px)`, transition: "500ms",left: "260px", position: "absolute", zIndex: "1000"
                        }}>
                            <div style={{ textAlign: "center", width: totalGroupWater > 9 ? "100%" : "100px", lineHeight: "15px", position: "absolute", right:totalGroupWater > 9 ? "0px": "-11px", bottom: totalGroupWater > 9 ? "0px" : "20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                {totalGroupWater ? totalGroupWater : null} {totalGroupWater ? "units Used" : null}
                            </div>
                        </div>
                    </OverlayTrigger>
                   
                    {/* recharged current water Base*/}
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={rechargedCurrentWaterBase} style={{ zIndex: "30013"}}>
                        <div style={{ 
                              color: "white", height: totalGroupWater ? `calc(${173 * (gameState.previousWater - totalGroupWater) / 60}px)` : 0, backgroundColor: "#0065ff", width: "81px", bottom: "50px", left: "417px", position: "absolute", zIndex: "1000", transition: "500ms",
                        }}> <div style={{ textAlign: "center", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{totalGroupWater ? gameState.previousWater - totalGroupWater: null} {totalGroupWater ? "units" : null}</div></div>
                    </OverlayTrigger>

                    {/* recharge water : 5 units, Top */}
                    {
                        currentRound == 'J' || currentRound == 'T' 
                        ?
                        null
                        :
                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={rechargeWater} style={{ zIndex: "30013"}}>
                            <div style={{ 
                                color: "white", height: totalGroupWater ?  `calc(${173 * 5 / 60}px)` : 0, backgroundColor: "lightblue", width: "81px", bottom: `calc(${(173 * (gameState.previousWater - totalGroupWater ) / 60) + 50}px)`, left: "417px", position: "absolute", zIndex: "1000", transition: "500ms",
                            }}><div style={{ textAlign: "center", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", justifyContent: "center"}}>{totalGroupWater ? 5 : null} {totalGroupWater ? "units" : null}</div></div>
                        </OverlayTrigger>
                    }

                    {/* Red Line, indicator depletion water point, 15 */}
                        <>
                            <div style={{ color: "black", fontSize: "1.1rem", position: "absolute", left: "545px", bottom: "79px", zIndex: "0"}}>15</div>
                            <div className={styles.blinker} style={{ color: "#444", fontSize: "0.9rem", position: "absolute", left: "314px", bottom: "67px", zIndex: "1001", letterSpacing: "2px"}}>Critical Depletion Point</div>
                            <div className={styles.redLine}></div>
                        </>

                    {/* Light Red Line, Target Level of Conservation, 25 */}
                    {/* {
                        gameState.roundIndex > 11 ?
                        <>
                            <div style={{ color: "#ff32cc", fontSize: "1.1rem", position: "absolute", left: "545px", bottom: "107px", zIndex: "1001"}}>25</div>
                            <div  style={{ color: "#ff32cc", fontSize: "1.1rem", position: "absolute", left: "314px", bottom: "122px", zIndex: "1001", letterSpacing: "2px"}}>Target Level of Conservation</div>
                            <div className={styles.redLine3}></div>
                        </>
                        :
                        null
                    } */}
                    {
                        totalGroupWater ?
                        <div style={{ position: "absolute", bottom: "110px", left: "207px"}}><img src="/arrowRight.png" width="30px" /></div>
                        :
                        null
                    }
                    {
                        totalGroupWater ?
                        <div style={{ position: "absolute", bottom: "110px", left: "364px"}}><img src="/arrowRight.png" width="30px" /></div>
                        :
                        null
                    }
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                        width={100}
                        height={600}
                        data={data}
                        margin={{
                            top: 20,
                            right:0,
                            left: 0,
                            bottom: 20,
                        }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 80]}/>
                            {/* <Bar dataKey="pv" stackId="a" fill="#2F57B8"/>
                            <Bar dataKey="uv" stackId="a" fill="lightblue" />
                            <Line type="monotone" dataKey="line" stroke="#0095FF" />
                            <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" /> */}
                        </BarChart>
                            <div style={{ left: "54px", bottom: "223px", backgroundColor: "white", width: "10px", height: "59px", position: "absolute"}}></div>
                            <div style={{ left: "31px", bottom: "268px", backgroundColor: "white", width: "22px", height: "22px", position: "absolute"}}></div>
                    </ResponsiveContainer>
                </div>  
            </div>
            <div className={styles.rightResultContainer}>
                <div className={styles.topbox}>
                    <Table bordered hover>
                        <thead>
                            <tr style={{ fontSize: "18px"}}>
                                <th>Player</th>
                                <th>Crop</th>
                                <th>Water Used <span style={{ fontSize: "14px"}}>(this round)</span></th>
                                <th><span>Income </span><br /><div style={{ marginTop: "4px", fontSize: "14px", minWidth: "90px"}}>(this round)</div></th>
                                <th>Water Used <span style={{ fontSize: "14px"}}>(cumulative)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{fontSize: "18px", border: role == "Farmer1"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer1" ? "3px solid #0065ff" : "null"}}>
                                <td>
                                    <div className={styles.playerContainer}>
                                        Farmer 1{role == "Farmer1" ? <span className={styles.playerContainerRole}> (You)</span>: null}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{ fontSize: "18px",  fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[0]?.crop ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[0]?.crop}</div> : <div style={{ width: "100%", textAlign: "center"}}> <Badge pill bg="dark" text="light">waiting</Badge></div>}</div> 
                                </td>
                                <td >
                                    <div className={styles.noticibleContainer} style={{fontSize: "18px",  fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[0]?.water ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[0]?.water} <span style={{ fontSize: "0.9rem", marginLeft: "0px", marginTop: "3px"}}>{choiceList?.[0]?.water > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td >
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[0]?.score ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[0]?.score}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[0]?.score > 1 ? "tokens" : "token"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{fontSize: "18px",  fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[0]?.totalWater ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[0]?.totalWater}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[0]?.totalWater > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                            </tr>

                            <tr style={{border: role == "Farmer2"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer2" ? "3px solid #0065ff" : "null", color: "#0065ff"}}>
                                <td >
                                    <div className={styles.playerContainer}>
                                    Farmer 2{role == "Farmer2" ? <span className={styles.playerContainerRole}> (You)</span>: null}
                                    </div>
                                </td>
                                <td >
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[1]?.crop ? <div style={{ fontSize: "20px", fontWeight: role == "Farmer2" ? "600" : null, width: "100%", textAlign: "center"}}>{choiceList?.[1]?.crop}</div> : <div style={{ width: "100%", textAlign: "center"}}> <Badge pill bg="dark" text="light">waiting</Badge></div>}</div> 
                                </td>
                                <td >
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[1]?.water ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[1]?.water} <span style={{ fontSize: "0.9rem", marginLeft: "0px", marginTop: "3px"}}>{choiceList?.[1]?.water > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td >
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[1]?.score ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[1]?.score}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[1]?.score > 1 ? "tokens" : "token"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[1]?.totalWater ? <div style={{fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[1]?.totalWater}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[1]?.totalWater > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                            </tr>
                   
                            <tr style={{border: role == "Farmer3"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer3" ? "3px solid #0065ff" : "null"}}>
                                <td >                                
        <div className={styles.playerContainer}>
                                    Farmer 3{role == "Farmer3" ? <span className={styles.playerContainerRole}> (You)</span>: null}
                                    </div>
                                </td>
                                <td >        
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[2]?.crop ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[2]?.crop}</div> : <div style={{ width: "100%", textAlign: "center"}}> <Badge pill bg="dark" text="light">waiting</Badge></div>}</div> 
                                </td>
                                <td >        
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[2]?.water ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[2]?.water} <span style={{ fontSize: "0.9rem", marginLeft: "0px", marginTop: "3px"}}>{choiceList?.[2]?.water > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td >        
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[2]?.score ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[2]?.score}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[2]?.score > 1 ? "tokens" : "token"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[2]?.totalWater ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[2]?.totalWater}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[2]?.totalWater > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                            </tr>
                            
                            <tr style={{border: role == "Farmer4"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer4" ? "3px solid #0065ff" : "null"}}>
                                <td >        
                                    <div className={styles.playerContainer}>
                                    Farmer 4{role == "Farmer4" ? <span className={styles.playerContainerRole} > (You)</span>: null}
                                    </div>
                                </td>
                                <td >      
                                    <div className={styles.noticibleContainer} style={{fontWeight: role == "Farmer4" ? "600" : null,  color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[3]?.crop ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[3]?.crop}</div> : <div style={{ width: "100%", textAlign: "center"}}> <Badge pill bg="dark" text="light">waiting</Badge></div>}</div> 
                                </td>
                                <td >      
                                    <div className={styles.noticibleContainer} style={{fontWeight: role == "Farmer4" ? "600" : null,  color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[3]?.water ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[3]?.water} <span style={{ fontSize: "0.9rem", marginLeft: "0px", marginTop: "3px"}}>{choiceList?.[3]?.water > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td >      
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer4" ? "600" : null, color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[3]?.score ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[3]?.score} <span style={{ fontSize: "0.9rem", marginLeft: "1px", marginTop: "3px"}}>{choiceList?.[3]?.score > 1 ? "tokens" : "token"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{fontWeight: role == "Farmer4" ? "600" : null,  color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[3]?.totalWater ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[3]?.totalWater}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[3]?.totalWater > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                            </tr>

                            <tr style={{border: role == "Farmer5"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer5" ? "3px solid #0065ff" : "null"}}>
                                <td >      
                                    <div className={styles.playerContainer}>
                                    Farmer 5{role == "Farmer5" ? <span className={styles.playerContainerRole}> (You)</span>: null}
                                    </div>
                                </td>
                                <td >   
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" :"#3d3d3d"}}>{choiceList?.[4]?.crop ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[4]?.crop}</div> : <div style={{ width: "100%", textAlign: "center"}}> <Badge pill bg="dark" text="light">waiting</Badge></div>}</div> 
                                </td>
                                <td >   
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[4]?.water ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[4]?.water} <span style={{ fontSize: "0.9rem", marginLeft: "0px", marginTop: "3px"}}>{choiceList?.[4]?.water > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td >   
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[4]?.score ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[4]?.score}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[4]?.score > 1 ? "tokens" : "token"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                                <td>
                                    <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" : "#3d3d3d"}}>{choiceList?.[4]?.totalWater ? <div style={{ fontSize: "20px", width: "100%", textAlign: "center"}}>{choiceList?.[4]?.totalWater}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>{choiceList?.[4]?.totalWater > 1 ? "units" : "unit"}</span></div> : <div style={{ width: "100%", textAlign: "center"}}><Spinner animation="border" size="sm" variant="dark" /></div>}</div> 
                                </td>
                            </tr>

                        </tbody>
                    </Table>
                </div>
            </div>
            {
                showPracticeEndNotification
                ?
                <PracticeNotification practiceEndDuration={practiceEndDuration}/>
                :
                null
            }
        </div>
    );
}

export const FinalResult = ({currentWater, showPracticeEndNotification, practiceEndDuration, finalScores}) => {
    const { treat, session, setSession, setTreat} = useAppContext();
    const { role, gameState, setGameState, choice, setChoice, choiceList, totalGroupWater, extraScores, setTotalGroupWater, currentRound, showFinalResultTable, setShowFinalResultTable} = useContext(GameContext);
    const [tokensAllocated, setTokensAllocated] = useState([{user1: null}, {user2: null}, {user3: null}, {user4: null}, {provider: null}])

    const [pv, setPv] = useState(0);
    const [recharge, setRecharge] = useState(0);

    useEffect(() => {
        if (totalGroupWater) {
            console.log('totalGroupWater: extraScores: ', totalGroupWater, extraScores)
            setPv(currentWater - totalGroupWater)
            setRecharge(5);
        }
    }, [totalGroupWater])

    useEffect(() => {
        setPv(0)
        setRecharge(0)
        setTotalGroupWater(0)
    }, [currentRound])

    useEffect(() => {
        console.log('finalScores: ', finalScores)
    }, [finalScores])

      const popoverRemainingWater = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Total Available Water</Popover.Header>
          <Popover.Body>
            {gameState.previousWater} units
          </Popover.Body>
        </Popover>
      );

      const popoverConsumptionTotalBase = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Left after Usage</Popover.Header>
          <Popover.Body>
            {gameState.previousWater - totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const popoverConsumptionTotalTop = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Total Water Used</Popover.Header>
          <Popover.Body>
            {totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const rechargedCurrentWaterBase = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Left after Usage</Popover.Header>
          <Popover.Body>
            {gameState.previousWater - totalGroupWater} units
          </Popover.Body>
        </Popover>
      );

      const rechargeWater = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Water Recharge</Popover.Header>
          <Popover.Body>
            5 units
          </Popover.Body>
        </Popover>
      );

    return (
        <div style={{ padding: "0 3rem"}}>
            <div style={{ textAlign: "center"}}>
                <Table bordered hover>
                    <thead>
                        <tr style={{ fontSize: "18px", backgroundColor: "lightblue"}}>
                            <th style={{ backgroundColor: "lightgray"}}>Player</th>
                            <th style={{ backgroundColor: "lightgray"}}>Earnings<span style={{ fontSize: "14px"}}>( from crops )</span></th>
                            <th style={{ backgroundColor: "lightgray"}}>Extra Earnings <span style={{ fontSize: "14px"}}>( from remaining ground water )</span></th>
                            <th style={{ backgroundColor: "lightgray"}}>Total Earnings <span style={{ fontSize: "14px"}}></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{fontSize: "18px", border: role == "Farmer1"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer1" ? "3px solid #0065ff" : "null"}}>
                            <td >
                                <div className={styles.playerContainer}>
                                    Farmer 1{role == "Farmer1" ? <span className={styles.playerContainerRole2}> (You)</span>: null}
                                </div>
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{ fontSize: "18px",  fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{finalScores?.[0] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{finalScores?.[0]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{fontSize: "18px",  fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[0] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{extraScores?.[0]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer1" ? "600" : null, color: role == "Farmer1" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[0] && finalScores[0] ? extraScores?.[0] + finalScores?.[0] : finalScores?.[0]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> 
                            </td>
                        </tr>

                        <tr style={{border: role == "Farmer2"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer2" ? "3px solid #0065ff" : "null", color: "#0065ff"}}>
                            <td >
                                <div className={styles.playerContainer}>
                                Farmer 2{role == "Farmer2" ? <span className={styles.playerContainerRole2}> (You)</span>: null}
                                </div>
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{finalScores?.[1] ? <div style={{ fontSize: "24px", fontWeight: role == "Farmer2" ? "600" : null, width: "100%", textAlign: "center"}}>{finalScores?.[1]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[1] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{extraScores?.[1]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer2" ? "600" : null, color: role == "Farmer2" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[1] && finalScores[1] ? extraScores?.[1] + finalScores?.[1] : finalScores?.[1]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> 
                            </td>
                        </tr>
                
                        <tr style={{border: role == "Farmer3"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer3" ? "3px solid #0065ff" : "null"}}>
                            <td >                                
                                <div className={styles.playerContainer}>
                                Farmer 3{role == "Farmer3" ? <span className={styles.playerContainerRole2}> (You)</span>: null}
                                </div>
                            </td>
                            <td >        
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{finalScores?.[2] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{finalScores?.[2]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >        
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[2] ?  <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{extraScores?.[2]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >        
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer3" ? "600" : null, color: role == "Farmer3" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[2] && finalScores[2] ? extraScores?.[2] + finalScores?.[2] : finalScores?.[2]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> 
                            </td>
                        </tr>
                        
                        <tr style={{border: role == "Farmer4"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer4" ? "3px solid #0065ff" : "null"}}>
                            <td >        
                                <div className={styles.playerContainer}>
                                Farmer 4{role == "Farmer4" ? <span className={styles.playerContainerRole2} > (You)</span>: null}
                                </div>
                            </td>
                            <td >      
                                <div className={styles.noticibleContainer} style={{fontWeight: role == "Farmer4" ? "600" : null,  color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{finalScores?.[3] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{finalScores?.[3]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >      
                                <div className={styles.noticibleContainer} style={{fontWeight: role == "Farmer4" ? "600" : null,  color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[3] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{extraScores?.[3]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >      
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer4" ? "600" : null, color: role == "Farmer4" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[3] && finalScores[3] ? extraScores?.[3] + finalScores?.[3] : finalScores?.[3]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> 
                            </td>
                        </tr>

                        <tr style={{border: role == "Farmer5"  ? "3px solid #0065ff" : "null", borderTop: role == "Farmer5" ? "3px solid #0065ff" : "null"}}>
                            <td >      
                                <div className={styles.playerContainer}>
                                Farmer 5{role == "Farmer5" ? <span className={styles.playerContainerRole2}> (You)</span>: null}
                                </div>
                            </td>
                            <td >   
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" :"#3d3d3d"}}>{finalScores?.[4] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{finalScores?.[4]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >   
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[4] ? <div style={{ fontSize: "24px", width: "100%", textAlign: "center"}}>{extraScores?.[4]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> : <div style={{ width: "100%", fontSize: "24px", textAlign: "center"}}>0<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>token</span></div>}</div> 
                            </td>
                            <td >   
                                <div className={styles.noticibleContainer} style={{ fontWeight: role == "Farmer5" ? "600" : null, color: role == "Farmer5" ? " #0065ff" : "#3d3d3d"}}>{extraScores?.[4] && finalScores[4] ? extraScores?.[4] + finalScores?.[4] : finalScores[4]}<span style={{ fontSize: "0.9rem", marginLeft: "3px", marginTop: "3px"}}>tokens</span></div> 
                            </td>
                        </tr>

                    </tbody>
                </Table>
            </div>
        </div>
    );
}
