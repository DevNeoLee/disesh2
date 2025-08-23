import { createContext, useState, useContext, useEffect } from 'react';

const Context = createContext();

export const AppProvider = ({ children }) => {
    const [treat, setTreat] = useState('')
    const [session, setSession] = useState({})

    // const [totalEanrningFromExercise, setTotalEarningFromExercise] = useState(0)
    // const [totalEanrningFromQuiz, setTotalEarningFromQuiz] = useState(0)
    const [totalTokens, setTotalTokens] = useState(0)
    // const [yourTokensInDollar, setYourTokensInDollar] = useState(0)
    const [mTurkcode, setMTurkcode] = useState('')
    const [timeTracker, setTimeTracker] = useState({})

    const values = {
      treat,
      setTreat,
      session,
      setSession,
      totalTokens, 
      setTotalTokens,
      timeTracker,
      setTimeTracker,
      setMTurkcode,
      mTurkcode
    }

    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    );
};

export const useAppContext = () => useContext(Context)