import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function InvitationModal (props) {
    return(
      <Modal show={props.show}>
        <Modal.Header>
          <Modal.Title>Votre invitation</Modal.Title>
        </Modal.Header>
        {props.success ?
          <Modal.Body>Votre invitation a été envoyé avec succès !</Modal.Body> :
          <Modal.Body>Cet utilisateur n'a pas été trouvé.</Modal.Body>
        }
        <Modal.Footer>
          <Button onClick={props.handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default InvitationModal;