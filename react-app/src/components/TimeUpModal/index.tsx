import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function TimeUpModal ({show, handleClose}) {
    return(
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Votre invitation</Modal.Title>
        </Modal.Header>
          <Modal.Body>Temps écoulé !</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

TimeUpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default TimeUpModal;