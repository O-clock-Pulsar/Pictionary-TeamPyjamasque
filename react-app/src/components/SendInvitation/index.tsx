import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import InvitationModal from '../Modal';
import PropTypes from 'prop-types';
 
function SendInvitation({username, namespace}){

    let [state, setState] = useState({
        baseSocket: null,
        playerName: "",
        modalShow: false,
        modalSuccess: false
      });

    const joinBaseSocket = (): void => {
      //Add back in environment variable later when closer to prod
      const baseSocket: SocketIOClient.Socket = io(`http://localhost:5060?username=${username}`);
      setState(state => ({
        ...state,
        baseSocket
      }));
      
      baseSocket.on('invitationSuccess', () => {
        setState(state => ({
          ...state,
          modalShow: true,
          modalSuccess: true
        }));
      });

      baseSocket.on('invitationFail', () => {
        setState(state => ({
          ...state,
          modalShow: true,
          modalSuccess: false
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
      state.baseSocket.emit("sendInvitation", {
        receiver: state.playerName,
        sender: username,
        namespace: namespace
      });
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
              <h2>Voulez-vous inviter un ami ?</h2>
              <input type="text" className="form-control" onChange={handleChange} />
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