
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

        // символы для разметки шахматной доски
        this.marksSymbols = {
			horizontal : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
			vertical: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
		};

        this.defaultSettings = {
            quotesSwitchedOff: false,   // флаг, показывать ли панель с цитатами
            userColor: 'white',    // цвет фигур юзера
            boardSize: 8,          // размер доски
            level: 'easy',         // уровень сложности игры
            mode: 'classic',       // режим игры
            currentActionDefinition: '',       // описание текущего хода - нужно для вывода в инфобаре

            // есть три состояния игры: игра в режиме ожидания и настройки (startOfGame = false && endOfGame = false),
            // игра началась (startOfGame = true && endOfGame = false),
            // игра завершилась (startOfGame = false && endOfGame = true)
            startOfGame: false,    // флаг начала игры
            endOfGame: false,      // флга завершения игры
            isUserTurn: null,       // флаг, что сейчас ход пользователя
            currentUserTurn: null,  // данные о текущем ходе пользователя
            currentAITurn: null,   // данные о текущем ходе ИИ

            movesCount: 0,      // количество ходов за игру - нужно для вывода в инфобаре
            whiteActorsCount: 0,     // количество белых фигур на доске - нужно для вывода в инфобаре
            blackActorsCount: 0,     // количество черных фигур на доске - нужно для вывода в инфобаре
        }

        this.state = {
            // массив букв и цифр джля разметки доски
            marks: {
                horizontal: [],
                vertical: [],
            },
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

        this.drawMarks = this.drawMarks.bind(this);
        this.switchStartGame = this.switchStartGame.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.resetDefaultSettings = this.resetDefaultSettings.bind(this);
        this.createTurnDefinition = this.createTurnDefinition.bind(this);
        this.turnIsDone = this.turnIsDone.bind(this);
    }

    // отрисовка разметки шахматной доски
    drawMarks(boardSize = this.state.boardSize) {

		this.state.marks.horizontal = [];
		this.state.marks.vertical = [];
		
		for (var i = 0; i < boardSize; i++) {

			this.state.marks.horizontal.push(<span>{this.marksSymbols.horizontal[i]}</span>);
			this.state.marks.vertical.push(<span>{this.marksSymbols.vertical[i]}</span>);
		}
	}

    // обновление настроек по событиям из тулбара
    updateData(data, value) {

        this.state[`${data}`] = value;

        //TODO ??
        // если меняется размер доски, перерисовываем разметку
        if (data == 'boardSize') {
            this.drawMarks();
        }

        this.setState({});
    }

    // переключение начала/завершения игры (кнопкой из тулбара)
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

    // вернуть все визуальные настройки игры по умолчанию (кнопкой из тулбара)
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
    // по клику или нажатию любой клавиши табло исчезает и происходит reset
    resetDisplay(event) {
        console.log('resetDisplay', event);

        this.wrap.removeEventListener('click', this.resetDisplay);
        this.wrap.removeEventListener('keydown', this.resetDisplay);

        // сброс всех данных игры
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

    // получить описание текущего хода - нужно для вывода в инфобаре
    createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam) {

        // метки на доске, соответствующие координатам хода
        const currentPositionMarks = {
			markX: this.marksSymbols.horizontal[currentPosition.positionX],
			markY: this.marksSymbols.vertical[currentPosition.positionY]
		};

		const newPositionMarks = {
			markX: this.marksSymbols.horizontal[newPosition.positionX],
			markY: this.marksSymbols.vertical[newPosition.positionY]
		};

        let definition = '';

        definition += this.state.movesCount + ') ';
        definition += ' ' + (actor.isUserColor ? 'Ваша' : 'Противника');
        definition += ' ' + (actor.type == "checker" ? 'шашка' : 'дамка');
        definition += ' перемещена с клетки ' + currentPositionMarks.markX + currentPositionMarks.markY + 
                        ' на клетку ' + newPositionMarks.markX + newPositionMarks.markY + '.';

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

    // событие сделанного (отрисованного) юзером хода - вызывается из Board
    /*userTurnIsDone(currentPosition, newPosition, actor, eatenActor, turnedToDam) {

        console.log('display analyzeUserTurn', currentPosition, newPosition, actor, eatenActor, turnedToDam);
        
        // TODO ???
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

    // событие сделанного (отрисованного) ИИ хода - вызывается из Board
    AITurnIsDone() {

        this.state.isUserTurn = true;
        this.state.movesCount ++;
        this.state.currentActionDefinition = this.createTurnDefinition(this.state.currentAITurn.currentPosition, this.state.currentAITurn.newPosition, this.state.currentAITurn.actor, this.state.currentAITurn.eatenActor, this.state.currentAITurn.turnedToDam);
        //this.state.currentAITurn = this.defaultSettings.currentAITurn;

        this.setState({});
    }*/

    turnIsDone(currentPosition, newPosition, actor, eatenActor, turnedToDam, whiteActorsCount, blackActorsCount) {
        debugger;

        console.log('display turnIsDone', currentPosition, newPosition, actor, eatenActor, turnedToDam);

        this.state.whiteActorsCount = whiteActorsCount;
        this.state.blackActorsCount = blackActorsCount;
        this.state.movesCount++;

        if (whiteActorsCount == 0 || blackActorsCount == 0) {

            this.switchStartGame();
            return;
        }

        if (this.state.isUserTurn) {
            console.log('user turn');

            this.state.currentUserTurn = {
                currentPosition: currentPosition,
                newPosition: newPosition,
            };
    
            this.state.currentActionDefinition = this.createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam);
    
            //TODO!!!
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
        }
        else {
            console.log('AI turn');
            this.state.currentActionDefinition = this.createTurnDefinition(this.state.currentAITurn.currentPosition, this.state.currentAITurn.newPosition, this.state.currentAITurn.actor, this.state.currentAITurn.eatenActor, this.state.currentAITurn.turnedToDam);
            this.state.currentAITurn = this.defaultSettings.currentAITurn;  //TODO???
        }
       
        this.state.isUserTurn = !this.state.isUserTurn;

        this.setState({});
    }

    componentWillMount() {
        this.drawMarks();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.boardSize !== this.state.boardSize) {
            this.drawMarks(nextState.boardSize);
        }

        return true;
    }

    componentDidUpdate(prevState) {
        
        // если игра завершена, то появляется табло, и по клику или нажатию любой клавиши табло пропадает и сбрасываются настройки
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
                            <div className = 'marks-container'>
                                <div className = 'marks marks_horizontal marks_top'>
                                    {this.state.marks.horizontal}
                                </div>

                                <div className = 'marks marks_horizontal marks_bottom'>
                                    {this.state.marks.horizontal}
                                </div>

                                <div className = 'marks marks_vertical marks_left'>
                                    {this.state.marks.vertical}
                                </div>

                                <div className = 'marks marks_vertical marks_right'>
                                    {this.state.marks.vertical}
                                </div>
                            </div>

                            <Board 
                                startOfGame = {this.state.startOfGame}
                                endOfGame = {this.state.endOfGame}
                                isUserTurn = {this.state.isUserTurn} 
                                currentAITurn = {this.state.currentAITurn}
                                turnIsDone = {this.turnIsDone} 
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
                            isUserTurn = {this.state.isUserTurn}
                            movesCount = {this.state.movesCount}
                            whiteActorsCount = {this.state.whiteActorsCount}
                            blackActorsCount = {this.state.blackActorsCount}
                        />
                    </div>
                </div>
               
                <Tablo className = {tabloClass}/>
            </div>
        )
    }
}