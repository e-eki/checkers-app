
import React, { Component } from 'react';
import Header from './header';
import Toolbar from './toolbar';
import Board from './board';
import Infobar from './infobar';
import Tablo from './tablo';

// визуальное представление приложения
export default class Display extends Component {

    constructor(props) {
        super(props);

        this.defaultSettings = {
            quotesSwitchedOff: false,
            userColor: 'white',
            boardSize: 8,
            level: 'easy',
            mode: 'classic',
            currentActionDefinition: '',
            startOfGame: false,
            endOfGame: false,
            isUserTurn: null,   // флаг, что сейчас ход пользователя
            currentUserTurn: null,  // данные о текущем ходе пользователя
            currentAITurn: null,   // данные о текущем ходе ИИ

            movesCount: 0,
            whiteActorsCount: 0,
            blackActorsCount: 0, 
        }

        this.state = {
            quotesSwitchedOff: this.defaultSettings.quotesSwitchedOff,
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            startOfGame: this.defaultSettings.startOfGame,
            endOfGame: this.defaultSettings.endOfGame,
            isUserTurn: this.defaultSettings.isUserTurn,
            currentUserTurn: this.defaultSettings.currentUserTurn,
            currentAITurn: this.defaultSettings.currentAITurn,

            movesCount: this.defaultSettings.movesCount,
            whiteActorsCount: this.defaultSettings.whiteActorsCount,
            blackActorsCount: this.defaultSettings.blackActorsCount, 
        };

        this.switchStartGame = this.switchStartGame.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.resetDefaultSettings = this.resetDefaultSettings.bind(this);
        this.analyzeUserTurn = this.analyzeUserTurn.bind(this);
    }

    // обновление настроек по событиям из тулбара
    updateData(data, value) {
        debugger;

        this.state[`${data}`] = value;
        this.setState({});
    }

    switchStartGame() {
        console.log('switchStartGame');

        if (this.state.startOfGame == false) {
            this.setState({
                startOfGame: true,
                endOfGame: false,
                isUserTurn: (this.state.userColor == 'white') ? true : false,
            });
        }
        else {
            this.setState({
                startOfGame: false,
                endOfGame: true,
            });
        } 
    }

    resetDefaultSettings() {
        console.log('resetSettings');

        this.setState({
            quotesSwitchedOff: this.defaultSettings.quotesSwitchedOff,
            userColor: this.defaultSettings.userColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
        })
    }

    // при завершении игры показывается табло с результатами,
    // по клику или нажатию любой клавиши происходит reset
    resetDisplay(event) {
        console.log('resetDisplay', event);

        this.wrap.removeEventListener('click', this.resetDisplay);
        this.wrap.removeEventListener('keydown', this.resetDisplay);

        this.setState({  
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            startOfGame: this.defaultSettings.startOfGame,
            endOfGame: this.defaultSettings.endOfGame,
            isUserTurn: this.defaultSettings.isUserTurn,
            currentUserTurn: this.defaultSettings.currentUserTurn,
            currentAITurn: this.defaultSettings.currentAITurn,

            movesCount: this.defaultSettings.movesCount,
            whiteActorsCount: this.defaultSettings.whiteActorsCount,
            blackActorsCount: this.defaultSettings.blackActorsCount, 
        });
    }

    getTurnDefinition(actor, currentPosition, newPosition, eatenActor) {

        let definition = '';
    }

    analyzeUserTurn(currentPosition, newPosition) {

        console.log('display analyzeUserTurn');
        
        this.state.currentUserTurn = {
            currentPosition: currentPosition,
            newPosition: newPosition,
        };

        this.state.isUserTurn = false;

        this.setState({});
    }

    componentDidUpdate(prevState) {
        
        if (!prevState.endOfGame && this.state.endOfGame) {
            this.wrap.addEventListener('click', this.resetDisplay);
            this.wrap.addEventListener('keydown', this.resetDisplay);
        }
    }

    render() {
        console.log('render display');
        const gameOverClass = this.state.endOfGame ? 'game-over' : '';
        const tabloClass = this.state.endOfGame ? 'tablo_shown' : 'tablo_hidden';

        return (
            <div ref = {elem => this.wrap = elem} className = 'wrap'>
                <div className = {gameOverClass}>
                    <Header quotesSwitchedOff = {this.state.quotesSwitchedOff}/>
                    <div className = 'inner-wrap'>

                    <Toolbar 
                        quotesSwitchedOff = {this.state.quotesSwitchedOff}
                        startOfGame = {this.state.startOfGame}
                        endOfGame = {this.state.endOfGame}
                        switchStartGame = {this.switchStartGame}
                        updateData = {this.updateData} 
                        resetDefaultSettings = {this.resetDefaultSettings}
                        userColor = {this.state.userColor} 
                        boardSize = {this.state.boardSize} 
                        level = {this.state.level} 
                        mode = {this.state.mode}
                    />

                    <div className = 'main'>
                        <Board 
                            startOfGame = {this.state.startOfGame}
                            endOfGame = {this.state.endOfGame}
                            isUserTurn = {this.state.isUserTurn} 
                            currentAITurn = {this.state.currentAITurn}
                            analyzeUserTurn = {this.analyzeUserTurn} 
                            boardSize = {this.state.boardSize} 
                            userColor = {this.state.userColor} 
                            mode = {this.state.mode}
                            updateData = {this.updateData} 
                        />			
                    </div>

                    <Infobar 
                        startOfGame = {this.state.startOfGame}
                        endOfGame = {this.state.endOfGame}
                        currentActionDefinition = {this.state.currentActionDefinition}
                    />
                    </div>
                </div>
               
                <Tablo className = {tabloClass}/>
            </div>
        )
    }
}