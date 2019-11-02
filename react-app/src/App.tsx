import React from 'react';
import './App.css';
// @ts-ignore
import CanvasDraw from 'react-canvas-draw';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useState, useRef } from 'react';

function App() {

  let [state, setState] = useState({
    currentPicture: null,
    isCanvasDisabled: true,
    brushColor: "#000000",
    brushRadius: 6
  });

  let canvas = useRef<any>(null);

  const handleCanvasChange = () => {
      const currentPicture = canvas.current.getSaveData();
      setState({
        ...state,
        currentPicture
      });
  }

  const handleCanvasClear = () => {
    canvas.current.clear()
    handleCanvasChange();
  }

  return (
    <div className="App">
      <Row>
        <Col className="text-center">
          <h1>ODRAW</h1>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <span className="border border-primary" onMouseMove={handleCanvasChange}>
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
    </div>
  );
}

export default App;
