import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

function TransitionNotification({message}) {
    const [count, setCount] = useState(10)

    useEffect(() => {
        let waitCount = setInterval(() => {
            setCount(prev => {
                if (prev > 0) {
                    console.log('count: ', prev);
                    return prev - 1;
                } else {
                    console.log('no');
                    clearInterval(waitCount);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(waitCount)
    }, [])

  return (
    <Card style={{ letterSpacing: "1px", width: '55rem', height: "23rem", position: 'fixed', top: '48%', left: '50%', transform: 'translate(-48%, -50%)', zIndex: "2000"}}>
      <Card.Header>
        <Card.Title style={{ textAlign: "center"}}>Next: Part II </Card.Title>
      </Card.Header>
      <Card.Body style={{ fontSize: "1.2rem", width: "100%", height: "100%"}}>
      <div style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "0.8rem 0" }}>Now, a fresh set of rounds will be played by you and other
players.</div>
              <div style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "1rem 3rem", textAlign: "center", lineHeight: "2" }}>60 units of groundwater will be available again for your
group to grow crops.</div>
<div style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "0.8rem 3rem", textAlign: "center", lineHeight: "2" }}>You will watch video instructions and do a quiz for this 2nd set of rounds</div>

          <div style={{ padding: "2rem 1rem", fontSize: "1.2rem", width: "100%", textAlign: "center", letterSpacing: "2px"}}> Starts in <span style={{ fontSize: "1.5rem", color: "#0065ff", margin: "1rem 1rem"}}>{count}</span>{count > 1 ? "seconds" : "second"}</div>
      </Card.Body>
    </Card>
  );
}

export default TransitionNotification;