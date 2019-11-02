import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './style.css';
 
function Timer(){

  let [state, setState] = useState({
      seconds: 0,
      minutes: 5,
    });

  const myInterval = () => {
    setInterval(() => {
      setState(state => {
        const seconds = state.seconds - 1;
        if (seconds >= 0){
          return {
          ...state,
          seconds: state.seconds - 1
        } 
      } else {
        return {
          ...state,
          minutes: state.minutes - 1,
          seconds: 59
        }
      }
    })}, 1000)
  }

  useEffect(() => {
    myInterval();
  },[])

   return(
      <Row>
        <Col className="text-center">
          <h1>
            <span id="timer-text">{state.minutes}:{state.seconds > 10 ? state.seconds : "0" + String(state.seconds)}</span>
          </h1>
        </Col>
      </Row>
   )
   
}
export default Timer;
