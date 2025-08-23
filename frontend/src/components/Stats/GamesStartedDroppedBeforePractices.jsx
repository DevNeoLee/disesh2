
export default function GamesStartedDroppedBeforePractices ({ data }) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
        hour12: true, // 24-hour format
      };

    return (
        <div >
            {
                data?.map((game, id) => (
                    <div key={id} style={{ margin: "0.5rem", padding: "1rem", border: "1px solid brown", width: '600px'}}>
                        <p>Room Name: {game.roomName}</p>
                        <p>Scope: {game.treat}</p>
                        
                        <p>Time that Game Created(Eastern): {new Date(game?.gameCreatedTime).toLocaleString('en-US', options)}</p>
                        <p>Participants( {game.participants.length} ): </p>
                        <div>
                            {
                                game.participants.sort((a, b) => Number(a.role?.slice(6)) - Number(b.role?.slice(6))).map((participant, p_id) => (
                                    <div key={p_id} style={{ padding: "0.5rem", margin: "0.5rem"}}>
                                        <p>Role: <span style={{ fontSize: "1.3rem", color: "darkblue"}}>{participant.role}</span></p>
                                        <div style={{padding: "0 0.5rem", margin: "0 0.5rem"}}>
                                            <p>TotalScore from game: {participant.results[participant.results.length - 1]?.totalScore}</p>
                                            <p>M Turk Code: {participant.mTurkcode}</p>
                                            <div>
                                                {
                                                    participant.results.map((result, r_id) => (
                                                        <div key={r_id}>{r_id == 0 ? "-2" : r_id == 1 ? "-1" : r_id - 1}: choice: {result.crop}</div> 
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
