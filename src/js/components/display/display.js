
import React, { Component } from 'react';
import Header from './header';
import Toolbar from './toolbar';
import Board from './board';
import Infobar from './infobar';
import Tablo from './tablo';

export default class Display extends Component {

    constructor(props) {
        super(props);

        this.defaultSettings = {
            userColor: 'white',
            boardSize: 8,
            level: 'easy',
            mode: 'classic',
            currentActionDefinition: 'Game start' + '\n' + '\n',
            endOfGame: false,
            currentTurn: null,
        }

        this.state = {
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            endOfGame: this.defaultSettings.endOfGame,
            currentTurn: this.defaultSettings.currentTurn,
            
        };

        this.updateData = this.updateData.bind(this);
        this.drawGameOver = this.drawGameOver.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.userTurn = this.userTurn.bind(this);
    }

    updateData(data, value) {

        this.state[`${data}`] = value;
        this.setState({});
    }

    userTurn(currentPosition, newPosition, movedActor, eatenActor) {

        console.log('display userTurn');
        
        this.state.currentTurn = {
            currentPosition: currentPosition,
            newPosition: newPosition,
            movedActor: movedActor,
            eatenActor: eatenActor
        };

        this.setState({});
    }

    drawGameOver() {
        this.setState({
            endOfGame: true,
        });

        addEventListener('click', this.resetDisplay);
        addEventListener('keydown', this.resetDisplay);
    }

    resetDisplay() {

        removeEventListener('click', this.resetDisplay);
        removeEventListener('keydown', this.resetDisplay);

        this.setState({
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            endOfGame: this.defaultSettings.endOfGame,
            currentTurn: this.defaultSettings.currentTurn,
        })
    }

    render() {
        console.log('render display');
        const gameOverClass = this.state.endOfGame ? 'game-over' : '';
        const tabloClass = this.state.endOfGame ? 'tablo_shown' : 'tablo_hidden';

        return (
            <div className = 'wrap'>
                <div className = {gameOverClass}>
                    <Header/>
                    <div className = 'inner-wrap'>

                    <Toolbar updateData = {this.updateData} userColor = {this.state.userColor} boardSize = {this.state.boardSize} level = {this.state.level} mode = {this.state.mode}/>

                    <div className = 'main'>
                        <Board userTurn = {this.userTurn} boardSize = {this.state.boardSize} userColor = {this.state.userColor} mode = {this.state.mode}/>			
                    </div>

                    <Infobar currentActionDefinition = {this.state.currentActionDefinition}/>
                    </div>
                </div>
               
                <Tablo className = {tabloClass}/>
            </div>
        )
    }
}