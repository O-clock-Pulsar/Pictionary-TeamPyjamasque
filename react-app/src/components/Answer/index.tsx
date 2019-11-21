import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import './style.css';

function Answer () {
    const [state, setState] = useState({
        inputText: "",
        answers: []
    });

    // Event type is broken according to GitHub discussions. Set to any.
    const handleChange = (event: any): void => {
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
            <Card id="chat-window">
                <Card.Header>
                    Vos Réponses
                </Card.Header>
                <div id="message-window"> 
                            { state.answers.length !== 0 && <ListGroup className="text-center my-2">
                                {
                                    state.answers.map((answer, index) => <ListGroup.Item key={`answer-${index.toString()}`}>{answer}</ListGroup.Item>)
                                }
                            </ListGroup> }
                </div> 
            </Card>
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
        </div>
    )
}

export default Answer;