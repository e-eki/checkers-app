
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
            currentUserTurn: null,
            isUserTurn: true,
            currentAITurn: null,
        }

        this.state = {
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            endOfGame: this.defaultSettings.endOfGame,
            isUserTurn: this.defaultSettings.isUserTurn,
            currentUserTurn: this.defaultSettings.currentUserTurn,
            currentAITurn: this.defaultSettings.currentAITurn,
        };

        this.updateData = this.updateData.bind(this);
        this.drawGameOver = this.drawGameOver.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.userTurn = this.userTurn.bind(this);
    }

    updateData(data, value) {

        this.state[`${data}`] = value;

        if (data == 'userColor') {
            this.state.isUserTurn = (this.state.userColor == 'white') ? true : false;
        };

        this.setState({});
    }

    getUserTurn(currentPosition, newPosition, movedActor, eatenActor) {

        console.log('display userTurn');
        
        this.state.currentUserTurn = {
            currentPosition: currentPosition,
            newPosition: newPosition,
            movedActor: movedActor,
            eatenActor: eatenActor
        };

        //this.state.is

        this.setState({});

        console.log(this.state.currentTurn);
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
            currentUserTurn: this.defaultSettings.currentUserTurn,
            currentAITurn: this.defaultSettings.currentAITurn,
        });
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

                    <Toolbar 
                        updateData = {this.updateData} 
                        userColor = {this.state.userColor} 
                        boardSize = {this.state.boardSize} 
                        level = {this.state.level} 
                        mode = {this.state.mode}
                    />

                    <div className = 'main'>
                        <Board 
                            isUserTurn = {this.state.isUserTurn} 
                            userTurn = {this.userTurn} 
                            boardSize = {this.state.boardSize} 
                            userColor = {this.state.userColor} 
                            mode = {this.state.mode}
                        />			
                    </div>

                    <Infobar currentActionDefinition = {this.state.currentActionDefinition}/>
                    </div>
                </div>
               
                <Tablo className = {tabloClass}/>
            </div>
        )
    }
}