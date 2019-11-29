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
import SendInvitation from './components/SendInvitation';
import ReadyCheckModal from './components/ReadyCheckModal';
import Answer from './components/Answer';

function App() {

  let canvas = useRef({ getSaveData: () => null, clear: () => null });

  let [state, setState] = useState({
    currentPicture: null,
    isCanvasDisabled: true,
    brushColor: "#000000",
    brushRadius: 6,
    namespaceSocket: null,
    isGameReady: false,
    namespace: null,
    username: null,
    isPlayerReady: false,
    isGameStarted: false,
    word: null
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

    namespaceSocket.on('game ready', () => {
      setState(state => ({
        ...state,
        isGameReady: true
      }))
    })

    namespaceSocket.on('game start', () => {
      setState(state => ({
        ...state,
        isGameStarted: true
      }))
    })

    namespaceSocket.on("drawed", (currentPicture: JSON) => {
      setState(state => ({
        ...state,
        currentPicture
      }))
    })

    namespaceSocket.on("receive word", (word: string) => {
      setState(state => ({
        ...state,
        word
      }))
    })

    return namespaceSocket;
  }

  const sendUserConfirmation = () => {
    state.namespaceSocket.emit('player ready', state.username)
  }

  useEffect(() => {
    getUsername();

    return function disconnectNamespace(): void {
      state.namespaceSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (state.username) {
      joinNamespace();
    }
  }, [state.username])

  useEffect(() => {
    handleCanvasChange();
  }, [canvas.current])

  useEffect(() => {
    if (state.namespaceSocket) {
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
      {state.isGameStarted ?
        <div id="game-screen">
          <Row>
            <Col>
              <Timer />
            </Col>
          </Row>
          <Row>
            <Col>
              <Answer />
            </Col>
            <Col>
              {/*
          {state.isDrawer ?
              state.word && <span>{state.word}</span>
          :
          // don't render the word
           */}
              <Row>
                <Col>
                  <span className="border border-primary d-flex justify-content-center" onMouseUp={handleCanvasChange}>
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
                  {!state.isCanvasDisabled && <Button className='my-4' onClick={handleCanvasClear}>Clear</Button>}
                </Col>
              </Row>
            </Col>
          </Row>
        </div> :
        state.username && state.namespace && <div>
          <SendInvitation username={state.username} namespace={state.namespace} />
          <ReadyCheckModal show={state.isGameReady} handleClose={sendUserConfirmation} />
          {state.isPlayerReady && "On attend juste encore un petit peu..."}
        </div>
      }
    </div>
  );
}

export default App;
