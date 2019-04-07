import React from 'react'
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import Logo from './logo';
import Video from './video';
import Bigvideo from './bigvideo';
import HomeAd from './HomeAd/homead'

export default class Main extends React.Component {
    render() {
        return (
         
                <Switch>
                    <Route path='/home' component={HomeAd}></Route> 
                    <Route path='/login' component={Login}></Route> 
                    <Route path='/logo' component={Logo}></Route>
                    <Route path='/video' component={Video}></Route>
                    <Route path='/bigvideo' component={Bigvideo}></Route>
                </Switch>
      

        )
    }
}