//기타
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

//CSS
import './CSS/common/index.css';

//컴포넌트
import MainPage from './Main/common/page';
import RecipePage from './Recipe/common/page';
import CustomerPage from './Customer/common/page';
import CommunityPage from './CommunityPage/communityPage';

//컨텍스트
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
