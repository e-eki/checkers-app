
import React, { Component } from 'react';
import Header from './header';
import Toolbar from './toolbar';
import Main from './main';
import Infobar from './infobar';

export default class Display extends Component {

    render() {

        return (
            <div className = 'wrap'>
                <Header/>
				<div className = 'inner-wrap'>
                    <Toolbar/>
                    <Main/>
                    <Infobar/>
                </div>
            </div>
        )
    }
}