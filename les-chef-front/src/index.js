import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainPage from './MainPage/mainPage';
import RecipePage from './RecipePage/recipePage';
import CustomerPage from './CustomerPage/customerPage';
import CommunityPage from './CommunityPage/communityPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './Context/configContext';
import { UserProvider } from './Context/userContext';
import { AuthProvider } from './Context/authContext';
import { RecipeProvider } from './Context/recipeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ConfigProvider>
      <UserProvider>
        <RecipeProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<MainPage/>}/>
              <Route path='/recipeMain' element={<RecipePage/>}/>
              <Route path='/customerMain' element={<CustomerPage/>}/>
              <Route path='/communityMain' element={<CommunityPage/>}/>
            </Routes>
          </BrowserRouter>
        </RecipeProvider>
      </UserProvider>
    </ConfigProvider>
  </AuthProvider>
);

reportWebVitals();
