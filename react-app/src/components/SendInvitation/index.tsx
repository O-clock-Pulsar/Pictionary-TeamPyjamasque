import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import InvitationModal from '../InvitationModal';
import PropTypes from 'prop-types';
 
function SendInvitation({username, namespace}){

    let [state, setState] = useState({
        baseSocket: null,
        playerName: "",
        modalShow: false,
        modalSuccess: {sent: false, isSamePlayer: false},
      });

    const joinBaseSocket = (): void => {
      let baseSocket: SocketIOClient.Socket;
      if ( process.env.NODE_ENV !== 'production'){
        const socketAddress = 'http://localhost:5060/'
        baseSocket = io(`${socketAddress}?username=${username}`);
      } else {
        baseSocket = io(`?username=${username}`);
      }
      setState(state => ({
        ...state,
        baseSocket
      }));
      
      baseSocket.on('invitationSuccess', () => {
        setState(state => ({
          ...state,
          modalShow: true,
          modalSuccess: {sent: true, isSamePlayer: false},
        }));
      });

      baseSocket.on('invitationFail', () => {
        setState(state => ({
          ...state,
          modalShow: true,
          modalSuccess: {sent: false, isSamePlayer: false},
        }));
      });
    }

    useEffect(() => {
      if(username){
        joinBaseSocket();
      }
    
      return function disconnectNamespace(): void {
        if(state.baseSocket){
          state.baseSocket.disconnect();
        }
      }
    },[username]);

    const emitInvite = (event: React.FormEvent<HTMLButtonElement>): void => {
      if(state.playerName){
        if (state.playerName !== username){
          state.baseSocket.emit("sendInvitation", {
            receiver: state.playerName,
            sender: username,
            namespace: namespace
          });
        } else {
          setState(state => ({
            ...state,
            modalShow: true,
            modalSuccess: {sent: false, isSamePlayer: true},
          }));
        }
      }

      setState(state => ({
        ...state,
        playerName: ""
      }))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      let playerName = event.target.value;
      setState(state => ({
        ...state,
        playerName
      }));
    }

    const closeModal = () => {
      setState(state => ({
        ...state,
        modalShow: false
      }));
    }

    return(
        <Row>
            <Col md={4} />
            <Col className="text-center">
              <InvitationModal show={state.modalShow} success={state.modalSuccess} handleClose={closeModal} />
              <h1>En attente de joueurs</h1>
              <h2>Voulez-vous inviter un ami&nbsp;?</h2>
              <input type="text" className="form-control" onChange={handleChange} value={state.playerName} />
              <Button className="my-3" onClick={emitInvite}>Envoyer</Button>
            </Col>
            <Col md={4} />
        </Row>
    )
}

SendInvitation.propTypes = {
  username: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired
}

export default SendInvitation