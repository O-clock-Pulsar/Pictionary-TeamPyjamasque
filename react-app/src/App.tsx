import React from 'react';
import './App.css';
import CanvasDraw from 'react-canvas-draw';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import Timer from './components/Timer';
import SendInvitation from './components/SendInvitation'

function App() {

  let canvas = useRef({getSaveData: () => null, clear: () => null});

  let [state, setState] = useState({
    currentPicture: null,
    isCanvasDisabled: true,
    brushColor: "#000000",
    brushRadius: 6,
    namespaceSocket: null,
    gameReady: false,
    namespace: null,
    username: null
  });

  const getUsername = async (): Promise<void> => {
    const token = Cookie.get("token");
    const decodedToken = JSON.parse(await (await fetch(`authentificate/${token}`)).json());
    const username = decodedToken.username;
    setState(state => ({
      ...state,
      username
    }))
  }

  const joinNamespace = (): void => {
    const username = state.username;
    const namespace = Cookie.get("namespace");

    const namespaceSocket: SocketIOClient.Socket = initaliseNamespace(namespace, username);

    setState(state => ({
      ...state,
      namespaceSocket,
      namespace
    }));
  };

  const initaliseNamespace = (namespace: string, username: string): SocketIOClient.Socket => {
    const socketAddress = process.env.REACT_APP_SOCKET_ADDRESS ? process.env.REACT_APP_SOCKET_ADDRESS : 'http://localhost:5060/'
    const namespaceSocket: SocketIOClient.Socket = io(`${socketAddress}${namespace}?username=${username}`);
    
    namespaceSocket.on("drawed", (currentPicture: JSON)=> {
      setState(state=> ({
        ...state,
        currentPicture
      }))
    })
    
    return namespaceSocket;
  }

  useEffect(() => {
    getUsername();

    return function disconnectNamespace(): void {
      state.namespaceSocket.disconnect();
    }
  },[]);

  useEffect(() => {
    if(state.username){
      joinNamespace();
    }
  }, [state.username])

  useEffect(() => {
    handleCanvasChange();
  }, [canvas.current])

  useEffect(() => {
    if(state.namespaceSocket){
      state.namespaceSocket.emit('draw', state.currentPicture)
    }
  }, [state.currentPicture])

  const handleCanvasChange = () => {
    const currentPicture = canvas.current.getSaveData();
    setState(state => ({
      ...state,
      currentPicture
    }));
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
          state.username && state.namespace && <SendInvitation username={state.username} namespace={state.namespace} />
        }
    </div>
  );
}

export default App;
