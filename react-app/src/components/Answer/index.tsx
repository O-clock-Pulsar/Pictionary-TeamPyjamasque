import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';
import PropTypes from 'prop-types';

function Answer () {
    const [state, setState] = useState({
        inputText: "",
        answers: []
    });

    // Need to find better solution for props. Seems to be broken according to people on GitHub.
    const handleChange = (event): void => {
        let inputText = event.target.value;
        setState(state => ({
          ...state,
          inputText
        }));
    }

    const handleSubmit = (): void => {
        return
    }
    
    return(
        <div>
        <InputGroup className="my-4">
            <FormControl 
                type="email"
                placeholder="Ecrivez votre réponse"
                aria-label="Ecrivez votre réponse"
                onChange={handleChange}
                value={state.inputText} />
            <InputGroup.Append>
                <Button type="submit" onClick={handleSubmit}>Envoyer</Button>
            </InputGroup.Append>
        </InputGroup>
        <h4>Vos réponses</h4>
        <ListGroup>
            <ListGroup.Item>TEST</ListGroup.Item>
            <ListGroup.Item>TEST</ListGroup.Item>
            <ListGroup.Item>TEST</ListGroup.Item>
        </ListGroup>
        </div>
    )
}

Answer.propTypes = {
//   show: PropTypes.bool.isRequired,
//   success: PropTypes.bool.isRequired,
//   onClick: PropTypes.func.isRequired
}

export default Answer;