import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function InvitationModal ({show, success, handleClose}) {
    return(
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Votre invitation</Modal.Title>
        </Modal.Header>
        {success.sent ?
          <Modal.Body>Votre invitation a été envoyé avec succès !</Modal.Body> :
          success.isSamePlayer ? <Modal.Body> Mais ce n'est pas vous ? </Modal.Body> :
            <Modal.Body>Cet utilisateur n'a pas été trouvé.</Modal.Body>
        }
        <Modal.Footer>
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

InvitationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  success: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default InvitationModal;