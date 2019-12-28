import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function RoundEndModal ({show, handleClose}) {
    return(
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Tour terminé</Modal.Title>
        </Modal.Header>
          <Modal.Body>Préparez-vous pour le prochain tour !</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

RoundEndModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default RoundEndModal;