import styled, { createGlobalStyle } from 'styled-components';

export const PageBox = styled.div`
    width: 100%;
    height: 100%;
`;

export const GlobalStyle = createGlobalStyle`
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #EBF2FA;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }

    #root {
        height: 100%;
    }
`;
