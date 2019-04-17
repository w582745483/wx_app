import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter } from 'react-router-dom';

import Main from './component/main';
ReactDOM.render(
    <div>
        <BrowserRouter>
            <Main/>
        </BrowserRouter>
      
    </div>,

document.getElementById('root'));

