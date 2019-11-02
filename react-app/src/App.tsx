import React from 'react';
import './App.css';
// @ts-ignore
import CanvasDraw from 'react-canvas-draw';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  return (
    <div className="App">
      <Row>
        <Col className="d-flex justify-content-center">
          <CanvasDraw canvasWidth={800} canvasHeight={800}/>
        </Col>
      </Row>
    </div>
  );
}

export default App;
