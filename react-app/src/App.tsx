import React from 'react';
import './App.css';
import CanvasDraw from 'react-canvas-draw';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import jsonwebtoken from 'jsonwebtoken';
import Timer from './components/Timer';
import SendInvitation from './components/SendInvitation'

function App() {

  let canvas = useRef(null);

  let [state, setState] = useState({
    currentPicture: null,
    isCanvasDisabled: true,
    brushColor: "#000000",
    brushRadius: 6,
    namespaceSocket: null,
    gameReady: false
  });

  const joinNamespace = (): void => {
    const token = Cookie.get("token");
    const decodedToken: any = jsonwebtoken.verify(token,
      process.env.JWT_SECRET || 'dummy');
    const namespace = Cookie.get("namespace");
    const username: string = decodedToken.username;
    //Add back in environment variable later when closer to prod
    const namespaceSocket: SocketIOClient.Socket = io(`http://localhost:5060/${namespace}?username=${username}`);
    setState({
      ...state,
      namespaceSocket
    });
  };

  useEffect(() => {
    joinNamespace();

    return function disconnectNamespace(): void {
      state.namespaceSocket.disconnect();
    }
  },[]);

  const handleCanvasChange = () => {
      const currentPicture = canvas.current.getSaveData();
      setState({
        ...state,
        currentPicture
      });
  };

  const handleCanvasClear = () => {
    canvas.current.clear();
    handleCanvasChange();
  };

    return (
      <div className="App">
        <Row>
          <Col className="text-center">
            <h1>ODRAW</h1>
          </Col>
        </Row>
        {state.gameReady ?
          <div id="game-screen">
            <Row>
              <Col>
                <Timer />
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center">
                <span className="border border-primary" onMouseUp={handleCanvasChange}>
                  <CanvasDraw
                    ref={canvas}
                    loadTimeOffset={0}
                    lazyRadius={0}
                    brushRadius={state.brushRadius} 
                    brushColor={state.brushColor}
                    canvasWidth="50vw" 
                    canvasHeight="50vh"
                    hideGrid={true}
                    disabled={state.isCanvasDisabled}
                    saveData={state.currentPicture}
                    immediateLoading={true}
                  />
                </span>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button className='my-4' onClick={handleCanvasClear}>Clear</Button>
              </Col>
            </Row>
          </div> :
          <div>
            <SendInvitation/>
          </div>}
      </div>
    );
}

export default App;
