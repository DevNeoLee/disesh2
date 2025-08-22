
export default function SessionsCompeted ({ data }) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
        hour12: true, // 24-hour format
      };

    return (
        <div >
            {
                data?.map((session, id) => (
                    <div key={id} style={{ margin: "0.5rem", padding: "1rem", border: "1px solid brown", width: '550px'}}>
                         <p>mTurkNumber: {session.mTurkNumber}</p>
                         <p>Scope: {session.scope}</p>
                         <p>Payoff: {session.payoff}</p>
                         <p>Time that Session Created(Eastern): {new Date(session?.sessionStartTime).toLocaleString('en-US', options)}</p>
                         <p>Survey( {session.survey.length} ): </p>
                         <div>
                             {
                                 session.survey.map((question, p_id) => (
                                     <span key={p_id} style={{ padding: "0.5rem", margin: "0.5rem"}}>
                                         {p_id + 1}: {question.answer}
                                     </span>
                                 ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
