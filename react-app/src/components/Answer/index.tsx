import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';

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
        const answer = state.inputText;
        const answers = state.answers;
        answers.push(answer);
        setState(state => ({
            ...state,
            answers,
            inputText: ""
        }))
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
        {state.answers.length !== 0 &&
            <div>
                <h4>Vos réponses</h4>
                <ListGroup>
                    {
                        state.answers.map(answer => <ListGroup.Item key={answer}>{answer}</ListGroup.Item>)
                    }
                </ListGroup>
            </div>
        }
        </div>
    )
}

export default Answer;