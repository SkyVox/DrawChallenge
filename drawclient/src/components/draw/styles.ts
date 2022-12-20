import styled from 'styled-components';

export const Container = styled.div`
    &.main {
        height: 90%;
        width: 60%;
        margin: 15px;
    }

    &.board {
        height: 65%;
    }

    &.menu {
        margin-top: 10px;
    }

    select, button.menu-interact {
        height: 25px;
        margin-right: 10px;
    }
`;

export const Board = styled.div`
    border: 1px solid gray;
    border-radius: 2px;
    background-color: white;
    height: 100%;
    width: 100%;
`;
