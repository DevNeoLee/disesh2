
import styles from './instruction.module.css';
import { useState, useEffect, useRef } from 'react';
import Bar from '../ProgressBar';
import {Link} from "react-router-dom";
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';

const Instruction2 = ({setIsInstruction,  treat}) => {
    const now=60;
    const [beginTime, setBeginTime] = useState(null)
    const [clickTabArray, setClickTabArray] = useState([])
    const {session, setTimeTracker, timeTracker} = useAppContext();
    const videoRef = useRef()

    useEffect(() => {
        setTimeTracker(prev => ({...prev, instruction2: {...prev.instruction, beginTime: beginTime}}))
      }, [setTimeTracker])
    
      useEffect(() => {
        console.log('clickTabArray: ', clickTabArray)
      }, [clickTabArray])
    
      useEffect(() => {
        console.log('beginTime: ', beginTime)
      }, [beginTime])

    const handleClick = (url) => {
        setIsInstruction(false)
    }

    const handleTabSelect = (type) => {
        console.log('type', type)
        setClickTabArray(prev => [...prev, {choice: type, clickTime: new Date()}])
    
        if (type == 'text') {
            videoRef.current.pause();
        }
      }
    
  
    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbContainer}><Bar now={now}/></div>
            <div className={styles.content}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>Instructions on How to Play<span style={{ color: "black"}}>(click the play button)</span></h1><span></span>
                    </div>
                    <div style={{ width: "100%"}}>
                        <Tabs
                            id="uncontrolled-tab-example"
                            // fill
                            defaultActiveKey={"video"}
                            onSelect={handleTabSelect}
                        >
                            <Tab eventKey="video" title="Watch" width="50%">
                                <div className={styles.videoContainer}>
                                        {
                                            treat == 'const' 
                                            ?
                                            <video ref={videoRef} width="100%" controls>
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/1_disesVIdeoGTEqual_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            treat == 'const' 
                                            ?
                                            <video ref={videoRef} width="100%" controls>       
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/2_disesVideoGTFair_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            treat == 'const' 
                                            ?
                                            <video ref={videoRef} width="100%" controls>       
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/3_disesVideoGTStatusQuo_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            treat == 'i' 
                                            ?
                                            <video ref={videoRef}  width="100%" controls>       
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/4_disesVideoITEqual_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            treat == 'i' 
                                            ?
                                            <video ref={videoRef} width="100%" controls>       
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/5_disesVideoITFair_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            treat == 'i' 
                                            ?
                                            <video ref={videoRef} width="100%" controls>       
                                                <source src="https://dises2-93fb98d8241f.herokuapp.com/6_disesVideoITStatusQuo_Final.mp4" type="video/mp4" />
                                            </video>
                                            :
                                            null
                                        }
                                </div>
                            </Tab>
                            <Tab eventKey="text" title="Read">
                                <div className={styles.pptContainer}>
                                    {/* <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQOD_E0TykcnEDpeUWvAtbQQOT1BolJAp09buQsRw5tK-4eAugBe-aT1GY0oH4xog/embed" frameBorder="0" width="1060" height="632" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe> */}
                                    {
                                        treat == 'const' 
                                        ?
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT8pXRpXpgWmXKLV5xyd9MPWQYr6cXCT7X4T2rRulRvGMBgGu7aNgfNHdgvmFCeww/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>                          
                                        :
                                        treat == 'const' 
                                        ?
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTazeTamJJQZEx10Hw9OAADKtHH3WzakMD0AWofgD4LlUkC4niJPifhBByoIgZw_Q/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                                        :
                                        treat == 'const' 
                                        ?                            
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTzZQcKklwDGGuiu6-dZTXLnS0LWvnS2oTm-L-FTc2IJc7auJWTacayajhh6B_QmA/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                                        :
                                        treat == 'i' 
                                        ?
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRoS5zLwcM2fZbhdVIHJwQgFMNDyUwNk-Lw9RBhtB9pVW33pGlSr6H25qIFJiyw-Q/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>                            
                                        :
                                        treat == 'i' 
                                        ?
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQ7Ke7kbOvb98CnwQzZOmJ6bkM3ixrPM66qUCvqYm8IwI0V22Gi_Wp7_GOp9gsdCQ/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>                            
                                        :
                                        treat == 'i' 
                                        ?                            
                                        <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSzf820jaGF6c2sUeNV-D9FD69xRe43aKDfjz6WIcQwndLdoL0kxCovaS3CDm7tZQ/embed?start=false&loop=false&delayms=3000" frameBorder={0} width="1150px" height="657px" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>                            
                                        :
                                        null
                                    }
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <div>
                    <p>• There will be a short quiz (3 questions) to assess your understanding after viewing the instruction.</p>
                    <p>• All questions need to be correctly answered to proceed to the decision exercises.</p>
                    <p>• The quiz can be attempted multiple times until you answer all questions correctly.</p>
                        
                    </div>
                    <button className={styles.button} onClick={handleClick}>
                        Start Quiz 2
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Instruction2;