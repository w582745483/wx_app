import React from 'react'
import background from '../assets/img/background.jpg'

export default class Background extends React.Component {
  
    render() {
        return (
            <div>
                <img src={background} alt='logo' className='login-background' />
            </div>
        )
    }
}