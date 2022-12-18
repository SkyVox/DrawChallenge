import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import {
    Box,
    Container,
    PageTitle
} from './styles';

export const Header = () => {
    return (
        <Box>
            <PageTitle>Draw Challenge</PageTitle>
            <Container>
                <FaInfoCircle size={20} color={'#EBF2FA'} />
                <PageTitle>Game Info</PageTitle>
            </Container>
        </Box>
    );
}
