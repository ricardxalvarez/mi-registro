import React from 'react';
import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// pages
import Home from './pages/Home';
import Access from './pages/Access';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { AppContext } from './context/global';

function App() {
  return (
    <AppContext>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/access' element={<Access/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext>
  );
}

export default App;
