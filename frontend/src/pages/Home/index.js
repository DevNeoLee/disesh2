
import styles from './home.module.css';
import HOST from '../../utils/routes.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState} from 'react';


const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate()

  const [scope, setScope] = useState('')
  const [payoff, setPayoff] = useState('')


  const openPopUp = () => {
    const url = `${HOST}welcome/?scope=${scope}&payoff=${payoff}`
    const options = 'height=10000,width=10000,toolbar=no,location=no,menubar=no,titlebar=no';
     window.open(url, '_self', options);

    // window.open(url, 'popup', options);
  }

  useEffect(() => {
    if (!['c', 'i'].includes(queryParams.get('scope'))) {
      console.log('not found scope.')
      navigate('/notfound')
    } else {
      setScope(queryParams.get('scope'))
    }

    if (!['e', 'f', 's'].includes(queryParams.get('payoff'))) {
      console.log('not found payoff.')
      navigate('/notfound')
    } else {
      setPayoff(queryParams.get('payoff'))
    }

  }, [scope, payoff])

 



  return (
    <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1 style={{ fontSize: "2rem", color: "#0065ff", marginBottom: "5rem", letterSpacing: "1px", lineHeight: "1.3"}}>DECISION-MAKING EXERCISES ON USING GROUNDWATER TO GROW CROP</h1>
              <p style={{ fontSize: "1.4rem"}}>Before starting the exercises, please note the following:</p>
          </div>
          <div className={styles.paragraph}>
              <li>Watch or read the instructions carefully, as it may affect the amount of money you earn from the exercises.</li>
              <div><p style={{ marginLeft: "35px", marginTop: "10px"}}>- <span className={styles.bold}>Only laptops or desktop computers</span> can be used to play these exercises. <span className={styles.bold}>Mobile or tablet devices are not allowed</span>.</p></div>
              <div><p style={{ marginLeft: "35px"}}>- Make sure that you <span className={styles.bold}> don’t leave the browser idle </span>during the exercises; otherwise, you will not be able to continue with the exercises.</p></div>
              <li>To begin, click the start button below to open a new window. Maximize this new window to continue with the exercises </li>
          </div>
          <div className={styles.butttonContainer}>
            {/* <button className={styles.button} onClick={() => openPopUp(`${HOST}welcome/?scope=${scope}&payoff=${payoff}`)}> */}
            <button className={styles.button} onClick={openPopUp}>
              {/* <Link 
              to={`/welcome/?scope=${scope}&payoff=${payoff}`}> */}
              {/* onClick={() => openPopUp(`${HOST}welcome/?scope=${scope}&payoff=${payoff}`)} */}
                Start
              {/* </Link> */}
            </button>
          </div>
        </div>
    </div>
  );
}

export default Home;