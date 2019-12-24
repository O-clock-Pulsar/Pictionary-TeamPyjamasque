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
import FlashMessage from './components/FlashMessage';

function App() {

  let canvas = useRef({ getSaveData: () => null, clear: () => null });

  let [state, setState] = useState({
    currentPicture: null,
    isCanvasDisabled: true,
    isDesktop: window.innerWidth >= 768,
    canvasWidth: window.innerWidth/2,
    canvasHeight: window.innerHeight/2,
    isAnswerDisabled: false,
    brushColor: "#000000",
    brushRadius: window.innerWidth >= 768 ? 6 : 2,
    namespaceSocket: null,
    isGameReady: false,
    namespace: null,
    username: null,
    isPlayerReady: false,
    isGameStarted: false,
    word: "",
    timer: {displayMinutes: 0, displaySeconds: 0},
    answers: []
  });

  const getUsername = async (): Promise<void> => {
    const token = Cookie.get("token");
    const authResponse = JSON.parse(await (await fetch(`authentificate/${token}`)).json());
    const username = authResponse.username;
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
    let namespaceSocket: SocketIOClient.Socket;
    if ( process.env.NODE_ENV !== 'production'){
      const socketAddress = 'http://localhost:5050/'
      namespaceSocket = io(`${socketAddress}${namespace}?username=${username}`);
    } else {
      namespaceSocket = io(`/${namespace}?username=${username}`);
    }

    namespaceSocket.on('game ready', () => {
      setState(state => ({
        ...state,
        isGameReady: true
      }))
    })

    namespaceSocket.on('game start', (timerSeconds) => {
      const displayMinutes = Math.floor(timerSeconds/60);
      const displaySeconds = timerSeconds - displayMinutes * 60;
      setState(state => ({
        ...state,
        isGameStarted: true,
        timer: {displayMinutes, displaySeconds}
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

    namespaceSocket.on('waiting', () => {
      setState(state => ({
        ...state,
        isPlayerReady : true
      }))
    })

    namespaceSocket.on('become drawerer', () => {
      namespaceSocket.emit('became drawerer')
    })

    namespaceSocket.on('become answerer', () => {
      namespaceSocket.emit('became answerer')
    })

    namespaceSocket.on('set drawerer interface', () => {
      setState(state => ({
        ...state,
        isCanvasDisabled: false,
        isAnswerDisabled: true
      }))
    })

    namespaceSocket.on('answered', (answer) => {
      const answers = state.answers;
      answers.push(answer)
      setState(state => ({
        ...state,
        answers
      }))
    })

    return namespaceSocket;
  }

  const sendUserConfirmation = () => {
    state.namespaceSocket.emit('player ready', state.username)
  }

  const setIsDesktop = () => {
    handleCanvasChange();
    const isDesktop = window.innerWidth >= 768;
    if(isDesktop){
      setState(state => ({
        ...state,
        isDesktop,
        canvasWidth: window.innerWidth/2,
        canvasHeight:  window.innerHeight/2
      }))
    } else {
      setState(state => ({
        ...state,
        isDesktop,
        canvasWidth: window.innerWidth,
        canvasHeight:  window.innerHeight/3
      }))
    }
  }

  useEffect(() => {
    getUsername();
    setIsDesktop();
    window.addEventListener("resize", setIsDesktop)

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
    if (state.namespaceSocket && !state.isCanvasDisabled) {
      state.namespaceSocket.emit('draw', state.currentPicture)
    }
  }, [state.currentPicture, state.isCanvasDisabled])

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
      <FlashMessage/>
      <Row>
        <Col className="d-none d-md-block text-center">
          <h1>ODRAW</h1>
        </Col>
      </Row>
      {state.isGameStarted ?
        <div id="game-screen">
          <Row>
          {!state.isCanvasDisabled && state.word && 
              <Col className="text-center" xs={{order: 2}}>
                <h4>Votre mot est </h4>
                <h1 id="word-text">{state.word}</h1>
              </Col> 
            }
            <Col xs={{order: 1}} >
              <Timer displayMinutes={state.timer.displayMinutes} displaySeconds={state.timer.displaySeconds} />
              {!state.isDesktop &&
                <Row>
                  <Col className="text-center">
                    {!state.isCanvasDisabled && <Button onClick={handleCanvasClear}>Clear</Button>}
                  </Col>
                </Row>
              }
            </Col>
          </Row>
          <Row>
            <Col md={{ order: 2 }} >
              <Row>
                <Col>
                  <span className="border border-primary d-flex justify-content-center my-4" onTouchEnd={handleCanvasChange} onMouseUp={handleCanvasChange} >
                    <CanvasDraw
                      ref={canvas}
                      loadTimeOffset={0}
                      lazyRadius={0}
                      brushRadius={state.brushRadius}
                      brushColor={state.brushColor}
                      canvasWidth={state.canvasWidth}
                      canvasHeight={state.canvasHeight}
                      hideGrid={true}
                      disabled={state.isCanvasDisabled}
                      saveData={state.currentPicture}
                      immediateLoading={true}
                    />
                  </span>
                </Col>
              </Row>
              {state.isDesktop &&
                <Row>
                  <Col className="text-center">
                    {!state.isCanvasDisabled && <Button onClick={handleCanvasClear}>Clear</Button>}
                  </Col>
                </Row>
              }
            </Col>
            <Col md={{ order: 1 }}>
              <Answer namespaceSocket={state.namespaceSocket} answers={state.answers} isDisabled={state.isAnswerDisabled} />
            </Col>
          </Row>
        </div> :
        state.username && state.namespace && <div>
          <SendInvitation username={state.username} namespace={state.namespace} />
          <ReadyCheckModal show={state.isGameReady && !state.isPlayerReady} handleClose={sendUserConfirmation} />
          {state.isPlayerReady && 
            <Row>
              <Col className="text-center">On attend juste encore un petit peu...</Col>
            </Row>}
        </div>
      }
    </div>
  );
}

export default App;
