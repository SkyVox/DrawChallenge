import styled from 'styled-components';

export const Box = styled.div`
    margin-top: 15px;
    width: 15%;
    height: 90%;
    background-color: #727072;
    border: 1px solid white;
    border-radius: 10px;
    overflow-y: scroll;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const UsersList = styled.div`
    width: 100%;
`;

export const ListNames = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px 0px;
    color: white;
    font-weight: bold;
`;

export const Divisor = styled.hr`
    border-color: #1F1E1F;
`;
