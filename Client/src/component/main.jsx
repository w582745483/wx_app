import React from 'react'
import { Switch, Route} from 'react-router-dom';

import {Login} from './login';
import {Register} from './register'
import Logo from './logo';
import NineVideo from './ninevideo';
import Bigvideo from './bigvideo';
import Menu from './menu'
import Upload from './upload'
import Test from './test'

export default class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact={true} component={Menu}></Route>
                <Route path='/login' component={Login}></Route>
                <Route path='/register' component={Register}></Route>
                <Route path='/logo' component={Logo}></Route>
                <Route path='/ninevideo' component={NineVideo}></Route>
                <Route path='/bigvideo' component={Bigvideo}></Route>
                <Route path='/upload' component={Upload}></Route>
                <Route path='/test' component={Test}></Route>
            </Switch>
        )
    }
}