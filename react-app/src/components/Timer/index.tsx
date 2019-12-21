import React from 'react';
import { useState, useEffect } from 'react';
import './style.css';
import PropTypes from 'prop-types';
 
function Timer({displayMinutes, displaySeconds}){

  let [state, setState] = useState({
      seconds: displaySeconds,
      minutes: displayMinutes,
      interval: null
    });

  const runTimer = () => {
    setInterval(() => {
      setState(state => {
        const seconds = state.seconds - 1;
        if (state.seconds || state.minutes){
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
      }} else {
        clearInterval(state.interval);
        return {
          ...state,
          minutes: 0,
          seconds: 0
        }
      }
    })}, 1000)
  }

  useEffect(() => {
    setState({
      ...state,
      interval: runTimer()
    })

    return clearInterval(state.interval);
  },[])

   return(
    <h1 className="text-center">
      <span id="timer-text">{state.minutes}:{state.seconds > 9 ? state.seconds : "0" + String(state.seconds)}</span>
    </h1>
   )
   
}

Timer.propTypes = {
  displayMinutes: PropTypes.number.isRequired,
  displaySeconds: PropTypes.number.isRequired
}

export default Timer;
