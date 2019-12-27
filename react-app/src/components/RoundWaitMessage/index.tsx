import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 
function RoundWaitMessage(){

    let [state, setState] = useState({
        timer: 5
      });

    useEffect(() => {
        const timerInterval = setInterval(countDown, 1000)

        return () => {
            clearInterval(timerInterval);
            setState(state => ({
                ...state,
                timer: 5
            }))
        }
    }, [])

    const countDown = () => {
        setState(state => ({
            ...state,
            timer: state.timer - 1
        }))
    }

    return(
        <Row>
            <Col>
                <h1 className="text-info text-center">LE PROCHAIN TOUR COMMENCE DANS... {state.timer}</h1>
            </Col>
        </Row>
    )
}

export default RoundWaitMessage