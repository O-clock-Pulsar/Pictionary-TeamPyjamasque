import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function ResultsModal({ isGameOver, results }) {
  return (
    <Modal show={isGameOver}>
      <Modal.Header>
        <Modal.Title>Partie finie !</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Voici les résultats:</h3>
        <ol>
          {
            results.map((result: Array<any>, index: number) => { return <li key={index}>{result[0]} : {result[1]}</li> })
          }
        </ol>
      </Modal.Body>
      <Modal.Footer>
        <Button href={process.env.NODE_ENV === 'production' ? '/home' : 'http://localhost:5050/home'}>
          Retourner vers la liste des parties
          </Button>
      </Modal.Footer>
    </Modal>
  )
}

ResultsModal.propTypes = {
  isGameOver: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired
}

export default ResultsModal;