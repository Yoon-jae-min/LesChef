import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainPage from './MainPage/mainPage';
import RecipePage from './RecipePage/recipePage';
import CustomerPage from './CustomerPage/customerPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/recipeMain' element={<RecipePage/>}/>
      <Route path='/customerMain' element={<CustomerPage/>}/>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
