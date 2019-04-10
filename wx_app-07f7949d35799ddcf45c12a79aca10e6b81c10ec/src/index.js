import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';


import Logo from './component/logo'
import Login from './component/login';
import Main from './component/main';
ReactDOM.render(
    <div>
        <BrowserRouter>
            <Main/>
        </BrowserRouter>
      
    </div>,

document.getElementById('root'));

