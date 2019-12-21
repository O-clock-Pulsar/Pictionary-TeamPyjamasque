import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function ReadyCheckModal ({show, handleClose}) {

    return(
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Partie prête</Modal.Title>
        </Modal.Header>
        <Modal.Body>Est-ce que vous êtes prêt ?</Modal.Body> :
        <Modal.Footer>
          <Button onClick={handleClose}>
            C'est parti !!!
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

ReadyCheckModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default ReadyCheckModal;