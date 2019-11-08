import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 
function sendInvitation(){

    return(
        <Row>
            <Col md={4} />
            <Col className="text-center">
                <h1>En attente de joueurs</h1>
                <p>
                    <h2>Voulez-vous inviter un ami ?</h2>
                    <input type="text" className="form-control" />
                </p>
            </Col>
            <Col md={4} />
        </Row>
    )
}

export default sendInvitation