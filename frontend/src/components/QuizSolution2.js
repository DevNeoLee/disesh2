
import axios from "axios";
import React, { useEffect, useMemo, useState, useContext } from "react";

import styles from './QuizSolution/index.module.css'
import Table from 'react-bootstrap/Table';
import data from "../pages/Quizzes/DataQuizzes";

import { useAppContext } from "../AppContext";

import { format } from 'date-fns';

export default function QuizSolution2({questions, yourScore}) {
  const [pass, setPass] = useState(questions.length == yourScore);
  const { treat, setTreat} = useAppContext();

  useEffect( () => {
    setPass(questions.length == yourScore)
  }, [questions]);

  const filteredItem = ["choices", "hint", "comment", "question"];
  const columnOrder = [ "id", "yourAnswer", "answer", , "comment", "hint", "question", "review"];

  const isEven = (idx) => idx % 2 === 0;

  return (
    <div className={styles.tableContainer}>
        { pass 
        ? 
        <div className={styles.tableMessagePassed}>
          <p>Thank you. You answered all the questions correctly. You can now join the exercise.</p>
        </div>
        :
        <div className={styles.tableMessage}>
          <ul className={styles.paragraph}>
            <li>  You have correctly answered {yourScore} question{ yourScore > 1 ? "s" : null}. </li>
            <li>  Note that you need to correctly answer all questions in order to proceed to the decision exercises. You can re-try the quiz until you correctly answer all quiz questions. </li>
          </ul>
        </div>
        }
      <Table className={styles.table}>
        <thead className={styles.head}>
            <tr className={styles.row}>
                <th
                  // className={styles.tablehead} 
                >
                  Question No.
                </th>
                <th
                  // className={styles.tablehead} 
                >
                  Your Answer
                </th>
                <th
                  // className={styles.tablehead} 
                >
                  Correct Answer
                </th>
                <th
                  // className={styles.tablehead} 
                >
                  Instruction Review
                </th>
            </tr>
        </thead>
        <tbody className={ styles.body}>
          {
            questions.map((question, idx) => (
              <tr
                className={ styles.card}
                key={idx}
              >
                  <td className={styles.cell} style={{         
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    verticalAlign: "center",
                    backgroundColor: question["answer"]?.["isCorrect"] ? "#b7e597" : "#ffe7aa",
                  }} data-label="">
                   {idx + 1}
                  </td>
                  <td className={styles.cell} style={{         
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    verticalAlign: "center",
                    backgroundColor: question["answer"]?.["isCorrect"] ? "#b7e597" : "#ffe7aa",
                  }} data-label="">
                    {
                      idx == 1 && treat == 'i' 
                      ?
                      question.yourAnswer
                      :
                      question.yourAnswer
                    }
                  </td>
                  <td className={styles.cell} style={{         
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    verticalAlign: "center",
                    backgroundColor: question["answer"]?.["isCorrect"] ? "#b7e597" : "#ffe7aa",
                  }} data-label="">
                    {
                      question["answer"]?.["isCorrect"]  
                      ?
                      question?.answer.answer 
                      :
                      "?"
                    }
                  </td>
                  <td className={styles.cell} style={{         
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    verticalAlign: "center",
                    backgroundColor: question["answer"]?.["isCorrect"] ? "#b7e597" : "#ffe7aa",
                  }} data-label="">
                    {  
                      (idx == 1 && treat == 'i') || (idx == 2 && treat == 'i') ?
                      question?.hintB
                      :
                      (idx == 2 && treat == 'i') ?
                      question?.hintIS
                      :
                      (idx == 2 && treat == 'i') ?
                      question?.hintIF
                      :
                      (idx == 2) ?
                      question?.hintF
                      :
                      (idx == 2) ?
                      question?.hintS
                      :
                      question?.hint
                    }
                  </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

    </div>
  );
}

