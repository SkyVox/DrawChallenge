import React, { useEffect, useState } from 'react';
import { Chat } from '../../components/chat';
import { DrawBoard } from '../../components/draw';
import { UserList } from '../../components/logged_users';
import { socket } from '../../shared/socketConnection';
import {
    Container
} from './styles';

export interface Client {
    userName: string;
    userId: string;

    isPlaying: boolean;
    boardImage: string;

    connectedClients: Array<string>; // Client UserNames.
}

export const Main = () => {
    const [ isMounted, setMounted ] = useState<boolean>(false);
    const [ client, setClient ] = useState<Client>({} as Client);
    
    useEffect(() => {
        if (isMounted) {
            const name = prompt('Enter your name here') || 'random_user';

            socket.on('connect', () => {
                socket.emit('user-connected', name);
            });

            socket.on('user-has-connected', (user: Client) => {
                setClient(user);
            });

            socket.on('refresh-connected-users', (userNames: Array<string>) => {
                setClient((old) => ({
                    ...old,
                    connectedClients: userNames
                }));
            });
        }
    }, [isMounted]);

    useEffect(() => {
        window.onbeforeunload = () => {
            socket.emit('user-disconnect', client.userId);
        };
    }, [client]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Container>
            <UserList user={client} />
            <DrawBoard user={client} setClient={setClient} />
            <Chat user={client} />
        </Container>
    );
}
