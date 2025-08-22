
export default function NeverStartedGames ({ data }) {
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
                    <div key={id} style={{ margin: "0.5rem", padding: "1rem", border: "1px solid brown", width: '500px'}}>
                        <p>Room Name: {game.roomName}</p>
                        <p>Scope: {game.scope}</p>
                        <p>Payoff: {game.payoff}</p>
                        <p>Time that Game Created(Eastern): {new Date(game?.gameCreatedTime).toLocaleString('en-US', options)}</p>
                        {/* <p>Room Name: {game.roomName}</p>
                        <p>Room Name: {game.roomName}</p>
                        <p>Room Name: {game.roomName}</p> */}
                    </div>
                ))
            }
        </div>
    )
}