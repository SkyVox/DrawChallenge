import React, { useCallback, useEffect, useState } from 'react';
import { Client } from '../../pages/main';
import { socket } from '../../shared/socketConnection';
import {
    Container,
    Messages,
    ChatMessage,
    MessageUser,
    MessageTime,
    MessageInput,
    SubmitButton
} from './styles';

interface Props {
    user: Client;
}

interface Message {
    user: string;
    message: string;
    time: string;
}

export const Chat: React.FC<Props> = ({ user }) => {
    const [ isMounted, setMounted ] = useState<boolean>(false);
    const [ inputMessage, setInputMessage ] = useState<string>('');
    const [ messages, setMessages ] = useState<Message[]>([]);

    const handleSubmit = useCallback((event: any) => {
        event.preventDefault();

        socket.emit('send-server-message', {
            message: inputMessage,
            userId: user.userId,
        });
        
        setInputMessage('');
    }, [inputMessage]);

    useEffect(() => {
        if (isMounted) {
            socket.on('send-client-message', (message: Message) => {
                setMessages((old) => [ ...old, message ]);
            });
        }
    }, [isMounted]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Container>
            <Messages>
                {messages && messages.map((message: Message) => {
                    return (
                        <div>
                            <MessageUser>
                                {message.user}
                            </MessageUser>
                            <MessageTime>
                                {message.time}
                            </MessageTime>
                            <ChatMessage>
                                {message.message}
                            </ChatMessage>
                        </div>
                    );
                })}
            </Messages>
            <>
                <form onSubmit={handleSubmit}>
                    <MessageInput type={'text'} value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} ></MessageInput>
                    <SubmitButton type='submit'>Send</SubmitButton>
                </form>
            </>
        </Container>
    );
}
