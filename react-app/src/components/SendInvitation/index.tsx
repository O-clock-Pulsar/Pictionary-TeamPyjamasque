import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import InvitationModal from '../Modal';
 
function SendInvitation(props){

    let [state, setState] = useState({
        baseSocket: null,
        playerName: "",
        modalShow: false,
        modalSuccess: false
      });

    const joinBaseSocket = (): void => {
      //Add back in environment variable later when closer to prod
      const baseSocket: SocketIOClient.Socket = io(`http://localhost:5060?username=${props.username}`);
      setState({
        ...state,
        baseSocket
      });
      
      baseSocket.on('invitationSuccess', () => {
        setState({
          ...state,
          modalShow: true,
          modalSuccess: true
        })
      })

      baseSocket.on('invitationFail', () => {
        setState({
          ...state,
          modalShow: true,
          modalSuccess: false
        })
      })
    }

    useEffect(() => {
        joinBaseSocket();
    
        return function disconnectNamespace(): void {
          state.baseSocket.disconnect();
        }
      },[]);

    const emitInvite = (event: React.FormEvent<HTMLButtonElement>): void => {
      state.baseSocket.emit("sendInvitation", {
        receiver: state.playerName,
        sender: props.username,
        namespace: props.namespace
      })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      let playerName = event.target.value;
      setState({
        ...state,
        playerName
      })
    }

    const closeModal = () => {
      setState({
        ...state,
        modalShow: false
      })
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

export default SendInvitation