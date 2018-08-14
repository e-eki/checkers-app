
import React, { Component } from 'react';
import Header from './header';
import Toolbar from './toolbar';
import Grid from './grid';
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
        
        this.myWorker = null;

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
            totalOfGame: 'standoff',   // результат игры - по умолчанию ничья
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
            totalOfGame: this.defaultSettings.totalOfGame,
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

    // переключение начала/завершения игры - вызывается кнопкой в тулбаре или когда число белых или черных фигур = 0
    switchStartGame(event) {
        console.log('switchStartGame');

        // начать игру
        if (this.state.startOfGame == false) {
            this.setState({
                startOfGame: true,
                endOfGame: false,
                isUserTurn: (this.state.userColor == 'white') ? true : false,
            });
        }
        //завершить игру
        else {
            this.setState({
                startOfGame: false,
                endOfGame: true,
            });

            // по завершении игры подводим итог - кто выиграл
            // если передано событие event, то метод был вызван кнопкой в тулбаре, и значит, юзер сам завершил игру - ничья
            if (!event) {
                // если на доске не осталось фигур цвета юзера, то победил ИИ
                if ((this.state.userColor == 'white' && this.state.whiteActorsCount == 0) ||
                    (this.state.userColor == 'black' && this.state.blackActorsCount == 0)) {
                        this.state.totalOfGame = 'AI';
                    }
                else {
                    this.state.totalOfGame = 'user';
                }   
            }
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

        this.page.removeEventListener('click', this.resetDisplay);
        this.page.removeEventListener('keydown', this.resetDisplay);

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
            totalOfGame: this.state.totalOfGame,
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
        definition += ' ' + (actor.type == "grid__actor_checker" ? 'шашка' : 'дамка');
        definition += ' перемещена с клетки ' + currentPositionMarks.markX + currentPositionMarks.markY + 
                        ' на клетку ' + newPositionMarks.markX + newPositionMarks.markY + '.';

        if (eatenActor) {
            definition += ' ' + (eatenActor.isUserColor ? 'Ваша' : 'Противника');
            definition += ' ' + (eatenActor.type == 'grid__actor_checker' ? 'шашка' : 'дамка');
            definition += ' съедена.';
        }

        if (turnedToDam) {
            definition += ' ' + (actor.isUserColor ? 'Ваша шашка' : 'Противника шашка');
            definition += ' превратилась в дамку.';
        }

        return definition;
    }

    // обработчик хода
    turnIsDone(currentPosition, newPosition, actor, eatenActor, turnedToDam, whiteActorsCount, blackActorsCount) {
        console.log('display turnIsDone', currentPosition, newPosition, actor, eatenActor, turnedToDam);

        // из Board на каждом ходе передается количество черных и белых фигур в данный момент на доске
        this.state.whiteActorsCount = whiteActorsCount;
        this.state.blackActorsCount = blackActorsCount;
        this.state.movesCount++;

        // если количество черных или белых фигур = 0, то завершение игры.
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
                    {positionX: 1, positionY: 2},
                newPosition:
                    {positionX: 2, positionY: 3},
                actor: 
                    {color: 'grid__actor_black', type: 'grid__actor_checker'},
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

    /*componentDidMount() {

        debugger;

        this.myWorker = new Worker("game.js");
        this.myWorker.postMessage({'cmd': 'Hello World'});

        this.myWorker.onmessage = function(e) {
            console.log('Message received from worker');
            console.log(e.data);
          }
    }*/

    componentWillUpdate(nextProps, nextState) {
        // если в настройках изменился размер доски, перерисовываем разметку
        if (nextState.boardSize !== this.state.boardSize) {
            this.drawMarks(nextState.boardSize);
        }
    }

    componentDidUpdate(prevState) {     
        // если игра завершена, то появляется табло, и по клику или нажатию любой клавиши табло пропадает и сбрасываются настройки
        if (!prevState.endOfGame && this.state.endOfGame) {
            this.page.addEventListener('click', this.resetDisplay);
            this.page.addEventListener('keydown', this.resetDisplay);
        }
    }

    render() {
        console.log('render display');
        //const gameOverClass = this.state.endOfGame ? 'game-over' : '';
        const pageContentStyle = 'page__content' + (this.state.endOfGame ? ' page__content_transparent' : '');
        const tabloClass = this.state.endOfGame ? 'tablo_shown' : 'tablo_hidden';

        return (
            <div ref = {elem => this.page = elem} className = 'page'>
                <div className = {pageContentStyle}>
                    <Header quotesSwitchedOff = {this.state.quotesSwitchedOff}/>
                    
                    <div className = 'main'>

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

                        <div className = 'main__chessboard chessboard'>
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

                            <Grid 
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
               
                <Tablo 
                    className = {tabloClass}
                    isUserTurn = {this.state.isUserTurn}
                    movesCount = {this.state.movesCount}
                    whiteActorsCount = {this.state.whiteActorsCount}
                    blackActorsCount = {this.state.blackActorsCount}
                    totalOfGame = {this.state.totalOfGame}
                    userColor = {this.props.userColor}
                />
            </div>
        )
    }
}