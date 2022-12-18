import React from 'react';
import { Header } from './components/header';
import { Main } from './pages/main';

import {
  GlobalStyle,
  PageBox
} from './shared/sharedStyles';

export const App = () => {

  return (
    <PageBox>
      <GlobalStyle />
      <Header />
      <Main />
    </PageBox>
  );
}
