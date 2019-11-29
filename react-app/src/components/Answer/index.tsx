import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './style.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Answer () {

    let messagesEnd = useRef(null);

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const answer = state.inputText;
        if(answer){
            const answers = state.answers;
            answers.push(answer);
            setState(state => ({
                ...state,
                answers,
                inputText: ""
            }))
        }
    }

    useEffect(() => {
        if (messagesEnd.current){
            messagesEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [state.answers.length])
    
    return(
        <div>
            <Card id="chat-window">
                <Card.Header>
                    Réponses
                </Card.Header>
                <div id="message-window" > 
                            { state.answers.length !== 0 && <ListGroup className="text-center my-2">
                                {
                                    state.answers.map((answer, index) => <ListGroup.Item key={`answer-${index.toString()}`}>{answer}</ListGroup.Item>)
                                }
                                <div ref={messagesEnd} ></div>
                            </ListGroup> }
                </div> 
            </Card>
            <Form onSubmit={handleSubmit}>
                <InputGroup className="my-4">
                    <FormControl 
                        type="text"
                        placeholder="Ecrivez votre réponse"
                        aria-label="Ecrivez votre réponse"
                        onChange={handleChange}
                        value={state.inputText} />
                    <InputGroup.Append>
                        <Button type="submit">Envoyer</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        </div>
    )
}

export default Answer;