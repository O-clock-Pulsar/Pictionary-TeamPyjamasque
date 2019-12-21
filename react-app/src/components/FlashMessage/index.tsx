import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert'
import Cookie from 'js-cookie';
import './style.css'
 
function FlashMessage(){

    let [state, setState] = useState({
        message: "",
        isDanger: false,
        isShow: true
      });

    useEffect(() => {
        const message = Cookie.getJSON("flashMessage");
        const isDanger = Cookie.getJSON("flashIsDanger");
        setState(state => ({
            ...state,
            isDanger,
            message
        }))
        Cookie.remove("flashMessage");
        Cookie.remove("flashIsDanger");
    }, [])
    
    const toggleFlashMessage = () => {
        setState(state => ({
            ...state,
            isShow: !state.isShow
        }))
    }

    return(
        <Row>
            {state.isShow && state.message && 
                <Alert 
                    dismissible
                    onClose={toggleFlashMessage}
                    variant={state.isDanger ? "danger" : "success"}
                    className="flash-alert"
                    >
                    <span>
                        {state.message}
                    </span>
                </Alert>
            }
        </Row>
    )
}

export default FlashMessage