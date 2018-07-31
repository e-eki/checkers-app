
import React, { Component } from 'react';
import Header from './header';
import Toolbar from './toolbar';
import Board from './board';
import Infobar from './infobar';

export default class Display extends Component {

    constructor(props) {
        super(props);

        this.defaultSettings = {
            userColor: 'white',
            boardSize: 8,
            level: 'easy',
            mode: 'classic',
            currentActionDefinition: 'Game start' + '\n' + '\n',
        }

        this.state = {
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
        };

        this.updateData = this.updateData.bind(this);
    }

    updateData(data, value) {

        this.state[`${data}`] = value;
        this.setState({});
    }

    resetDisplay() {
        this.setState({
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
        })
    }

    render() {
        console.log('render display');

        return (
            <div className = 'wrap'>
                <Header/>
				<div className = 'inner-wrap'>

                    <Toolbar updateData={this.updateData} userColor = {this.state.userColor} boardSize = {this.state.boardSize} level = {this.state.level} mode = {this.state.mode}/>
                    
                    <div className = 'main'>
		  		        <Board boardSize = {this.state.boardSize} mode = {this.state.mode}/>			
			        </div>

                    <Infobar currentActionDefinition = {this.state.currentActionDefinition}/>
                </div>
            </div>
        )
    }
}