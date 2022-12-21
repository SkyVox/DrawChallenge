import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 15px;
    width: 25%;
    height: 80%;
    background-color: #727072;
    border: 1px solid white;
    border-radius: 5px;
`;

export const Messages = styled.div`
    height: 100%;
    padding: 3px;
    overflow-y: scroll;
`;

export const ChatMessage = styled.span`
    color: white;
`;

export const MessageUser = styled.span`
    font-size: 0.9rem;
    font-weight: bold;
    display: inline-block;

    &:after {
        content: ' ';
        white-space: pre;
    }
`;

export const MessageTime = styled.span`
    font-size: 0.75rem;
    font-style: italic;
    display: inline-block;

    &:after {
        content: ': ';
        white-space: pre;
        font-style: normal;
        font-size: 0.9rem;
    }
`;

export const MessageInput = styled.input`
    width: 100%;
    height: 25px;
    padding: 5px;
    box-sizing: border-box;
`;

export const SubmitButton = styled.button`
    width: 100%;
    height: 30px;
    box-sizing: border-box;
`;
