import React, { useEffect, useState } from 'react';
import { Client } from '../../pages/main';
import {
    Box,
    UsersList,
    ListNames,
    Divisor
} from './styles';

interface Props {
    user: Client;
}

export const UserList: React.FC<Props> = ({ user }) => {
    const [ users, setUsers ] = useState<Array<string>>(user.connectedClients);

    useEffect(() => {
        setUsers(user.connectedClients);
    }, [user, user.connectedClients]);

    return (
        <Box>
            <UsersList>
                {users && users?.map((userName: string) => {
                    return (
                        <>
                            <ListNames>{userName}</ListNames>
                            <Divisor />
                        </>
                    )
                })}
            </UsersList>
        </Box>
    );
}
