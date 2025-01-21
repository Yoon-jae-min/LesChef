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
import CommunityPage from './Community/common/page';

//컨텍스트
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './Context/config';
import { UserProvider } from './Context/user';
import { RecipeProvider } from './Context/recipe';
import { FoodsProvider } from './Context/foods';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider>
      <UserProvider>
        <RecipeProvider>
          <FoodsProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/recipeMain' element={<RecipePage/>}/>
                <Route path='/customerMain' element={<CustomerPage/>}/>
                <Route path='/communityMain' element={<CommunityPage/>}/>
              </Routes>
            </BrowserRouter>
          </FoodsProvider>
        </RecipeProvider>
      </UserProvider>
    </ConfigProvider>
);

reportWebVitals();
