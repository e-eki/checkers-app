
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
            userColor: 'white',
            boardSize: 8,
            level: 'easy',
            mode: 'classic',
            currentActionDefinition: 'Game start' + '\n' + '\n',
            startOfGame: false,
            endOfGame: false,
            isUserTurn: null,   // флаг, что сейчас ход пользователя
            currentUserTurn: null,  // данные о текущем ходе пользователя
            currentAITurn: null,   // данные о текущем ходе ИИ
        }

        this.state = {
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
        };

        this.switchStartGame = this.switchStartGame.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.resetDefaultSettings = this.resetDefaultSettings.bind(this);
        this.analyzeUserTurn = this.analyzeUserTurn.bind(this);
    }

    // обновление настроек по событиям из тулбара
    updateData(data, value) {

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
        });
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
                    <Header/>
                    <div className = 'inner-wrap'>

                    <Toolbar 
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
                        />			
                    </div>

                    <Infobar 
                        startOfGame = {this.state.startOfGame}
                        currentActionDefinition = {this.state.currentActionDefinition}
                    />
                    </div>
                </div>
               
                <Tablo className = {tabloClass}/>
            </div>
        )
    }
}