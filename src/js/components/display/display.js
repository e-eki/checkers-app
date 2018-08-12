
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
        this.userTurnIsDone = this.userTurnIsDone.bind(this);
        this.AITurnIsDone = this.AITurnIsDone.bind(this);
        this.createTurnDefinition = this.createTurnDefinition.bind(this);
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

    createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam) {

        let definition = '';

        definition += this.state.movesCount + ') ';
        definition += ' ' + (actor.isUserColor ? 'Ваша' : 'Противника');
        definition += ' ' + (actor.type == 'checker' ? 'шашка' : 'дамка');
        definition += ' перемещена с клетки ' + currentPosition + ' на клетку ' + newPosition + '.';

        if (eatenActor) {
            definition += ' ' + (eatenActor.isUserColor ? 'Ваша' : 'Противника');
            definition += ' ' + (eatenActor.type == 'checker' ? 'шашка' : 'дамка');
            definition += ' съедена.';
        }

        if (turnedToDam) {
            definition += ' ' + (actor.isUserColor ? 'Ваша шашка' : 'Противника шашка');
            definition += ' превратилась в дамку.';
        }

        return definition;
    }

    userTurnIsDone(currentPosition, newPosition, actor, eatenActor, turnedToDam) {

        console.log('display analyzeUserTurn', currentPosition, newPosition, actor, eatenActor, turnedToDam);
        
        this.state.currentUserTurn = {
            currentPosition: currentPosition,
            newPosition: newPosition,
        };

        this.state.isUserTurn = false;
        this.state.movesCount ++;
        this.state.currentActionDefinition = this.createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam);

        //TODO
        this.state.currentAITurn = {
            currentPosition:
                {positionX: 2, positionY: 5},
            newPosition:
                {positionX: 3, positionY: 4},
            actor: 
                {color: 'black', type: 'checker'},
            eatenActor: null,
            turnedToDam: false,
        }

        this.setState({});
    }

    AITurnIsDone() {

        this.state.isUserTurn = true;
        this.state.movesCount ++;
        this.state.currentActionDefinition = this.createTurnDefinition(this.state.currentAITurn.currentPosition, this.state.currentAITurn.newPosition, this.state.currentAITurn.actor, this.state.currentAITurn.eatenActor, this.state.currentAITurn.turnedToDam);
        //this.state.currentAITurn = this.defaultSettings.currentAITurn;

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

                    <Board 
                        startOfGame = {this.state.startOfGame}
                        endOfGame = {this.state.endOfGame}
                        isUserTurn = {this.state.isUserTurn} 
                        currentAITurn = {this.state.currentAITurn}
                        userTurnIsDone = {this.userTurnIsDone} 
                        AITurnIsDone = {this.AITurnIsDone}
                        boardSize = {this.state.boardSize} 
                        userColor = {this.state.userColor} 
                        mode = {this.state.mode}
                        updateData = {this.updateData} 
                    />			

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