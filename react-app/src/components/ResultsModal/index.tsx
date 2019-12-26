import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function ResultsModal({ isOver, results }) {
  return (
    <Modal show={isOver}>
      <Modal.Header>
        <Modal.Title>Votre invitation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Partie finie !</h3>
        <h4>Voici les résultats:</h4>
        <ol>
          {
            results.map(result => { return <li>{result[0]} : {result[1]}</li> })
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
  isOver: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired
}

export default ResultsModal;