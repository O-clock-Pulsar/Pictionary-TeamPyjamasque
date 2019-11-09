import React, { SyntheticEvent } from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
 
function SendInvitation(){

    let [state, setState] = useState({
        baseSocket: null,
        playerName: ""
      });

    const joinBaseSocket = (): void => {
        //Add back in environment variable later when closer to prod
        const baseSocket: SocketIOClient.Socket = io(process.env.SOCKET_IO_ADDRESS+process.env.SOCKET_IO_PORT || "http://localhost:5060");
        setState({
          ...state,
          baseSocket
        });
    }

    useEffect(() => {
        joinBaseSocket();
    
        return function disconnectNamespace(): void {
          state.baseSocket.disconnect();
        }
      },[]);

    const emitInvite = (event: React.FormEvent<HTMLButtonElement>): void => {
      state.baseSocket.emit("invite", state.playerName)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      let playerName = event.target.value;
      setState({
        ...state,
        playerName
      })
    }

    return(
        <Row>
            <Col md={4} />
            <Col className="text-center">
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