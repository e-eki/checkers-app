
import React, { Component } from 'react';
import axios from 'axios';
const Promise = require('bluebird');

import Header from './header';
import Footer from './footer';
import Toolbar from './toolbar';
import Grid from './grid';
import Infobar from './infobar';
import Tablo from './tablo';
import LkForm from '../../forms/lkForm';
import MessageForm from '../../forms/messageForm';
import * as authActions from '../../actions/authActions';
import apiConst from '../../apiConst';

// главная страница - страница игры
export default class GamePage extends Component {

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
            // игра в режиме ожидания и настройки (startOfGame = false && endOfGame = false)
            startOfGame: false,    // флаг начала игры
            endOfGame: false,      // флга завершения игры

            isUserTurn: null,       // флаг, что сейчас ход пользователя
            currentUserTurn: null,  // данные о текущем ходе пользователя
            currentAITurn: null,   // данные о текущем ходе ИИ

            movesCount: 0,      // количество ходов за игру - нужно для вывода в инфобаре
            whiteActorsCount: 0,     // количество белых фигур на доске - нужно для вывода в инфобаре
            blackActorsCount: 0,     // количество черных фигур на доске - нужно для вывода в инфобаре
            totalOfGame: 'standoff',   // результат игры - по умолчанию ничья

            messageIsShown: false,     // показывать сообщение об ошибке
            lkFormIsShown: false,     // показывать лк
            messageLink: '/',
            messageLinkName: 'На главную',
            message: '',
            lkLogin: '',
            lkEmail: '',
            lkIsEmailConfirmed: '',
            lkRole: '',
            lkLogout: false,
        }

        this.state = {
            // массив букв и цифр для разметки доски
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

            messageIsShown: this.defaultSettings.messageIsShown,
            lkFormIsShown: this.defaultSettings.lkFormIsShown,
            messageLink: this.defaultSettings.messageLink,
            messageLinkName: this.defaultSettings.messageLinkName,
            message: this.defaultSettings.message,
            lkLogin: this.defaultSettings.lkLogin,
            lkEmail: this.defaultSettings.lkEmail,
            lkIsEmailConfirmed: this.defaultSettings.lkIsEmailConfirmed,
            lkRole: this.defaultSettings.lkRole,
            lkLogout: this.defaultSettings.lkLogout,
        };

        this.drawMarks = this.drawMarks.bind(this);
        this.switchStartGame = this.switchStartGame.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.resetDefaultSettings = this.resetDefaultSettings.bind(this);
        this.createTurnDefinition = this.createTurnDefinition.bind(this);
        this.turnIsDone = this.turnIsDone.bind(this);
        this.hideMessageForm = this.hideMessageForm.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.clickLkButton = this.clickLkButton.bind(this);
        this.showLkForm = this.showLkForm.bind(this);
        this.switchLkLogout = this.switchLkLogout.bind(this);
    }

    // отрисовка разметки шахматной доски
    drawMarks(boardSize = this.state.boardSize) {

		this.state.marks.horizontal = [];
		this.state.marks.vertical = [];
        
        // уникальный ключ для каждой метки
        let markKey = 0;
        
		for (var i = 0; i < boardSize; i++) {

			this.state.marks.horizontal.push(<span key={markKey} >{this.marksSymbols.horizontal[i]}</span>);
            this.state.marks.vertical.push(<span key={markKey} >{this.marksSymbols.vertical[i]}</span>);
            
            markKey++;
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

            messageIsShown: this.defaultSettings.messageIsShown,
            lkFormIsShown: this.defaultSettings.lkFormIsShown,
            messageLink: this.defaultSettings.messageLink,
            messageLinkName: this.defaultSettings.messageLinkName,
            message: this.defaultSettings.message,
            lkLogin: this.defaultSettings.lkLogin,
            lkEmail: this.defaultSettings.lkEmail,
            lkIsEmailConfirmed: this.defaultSettings.lkIsEmailConfirmed,
            lkRole: this.defaultSettings.lkRole,
            lkLogout: this.defaultSettings.lkLogout,   //TODO: костыль?
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

        // из Board на каждом ходе передается количество черных и белых фигур в данный момент на доске ??для синхронизации??
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

    showMessage(message, messageLink = this.defaultSettings.messageLink, messageLinkName = this.defaultSettings.messageLinkName) {

        this.setState({

            message: message,
            messageIsShown: true,
            messageLink: messageLink,
            messageLinkName: messageLinkName,
        })
    }

    /*data = {
        login: user.login,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        role: user.role,
    }*/
    showLkForm(data) {

        this.setState({

            lkFormIsShown: true,

            lkLogin: data.login,
            lkEmail: data.email,
            lkIsEmailConfirmed: data.isEmailConfirmed,
            lkRole: data.role,
        })
    }

    clickLkButton() {
		debugger;

		return Promise.resolve(true)
			.then(() => {

				return authActions.getActualAccessToken();
			})
			.then((accessToken) => {
		
				const options = {
					method: 'GET',
					headers: { 'Authorization': `Token ${accessToken}` },
					url: `${apiConst.getLkDataApi}`
				};
				
				return axios(options);
			})
			.then((response) => {

                if (!response.data) throw new Error(''); 

				this.showLkForm(response.data);
			})
			.catch((error) => {
                // TODO: почему ссылка на страницу входа не срабатывает? аналогичная ссылка на главную со страницы входа работает.
				this.showMessage('Вы не авторизованы для данного действия', '/login', 'Войти на сайт');  
			})
	}

    switchLkLogout(logout) {
        debugger;

        this.state.lkLogout = logout;

        if (this.state.startOfGame) this.switchStartGame();
    }

    // когда скрывается сообщение, скрывается и лк (если был показан)
    hideMessageForm(event) {
        debugger;

        this.page.removeEventListener('click', this.hideMessageForm);
        this.page.removeEventListener('keydown', this.hideMessageForm);

        this.setState({

            messageIsShown: this.defaultSettings.messageIsShown,
            messageLink: this.defaultSettings.messageLink,
            messageLinkName: this.defaultSettings.messageLinkName,
            message: this.defaultSettings.message,

            lkFormIsShown: this.defaultSettings.lkFormIsShown,
            lkLogin: this.defaultSettings.lkLogin,
            lkEmail: this.defaultSettings.lkEmail,
            lkIsEmailConfirmed: this.defaultSettings.lkIsEmailConfirmed,
            lkRole: this.defaultSettings.lkRole,
            lkLogout: this.defaultSettings.lkLogout,
        });
    }

    componentWillMount() {
        this.drawMarks();
    }

    componentWillUpdate(nextProps, nextState) {
        // если в настройках изменился размер доски, перерисовываем разметку
        if (nextState.boardSize !== this.state.boardSize) {
            this.drawMarks(nextState.boardSize);
        }
    }

    componentDidUpdate(prevState) {   
        debugger;

        // если игра завершена, то появляется табло, и по клику или нажатию любой клавиши табло пропадает и сбрасываются настройки
        if (!prevState.endOfGame && this.state.endOfGame) {
            this.page.addEventListener('click', this.resetDisplay);
            this.page.addEventListener('keydown', this.resetDisplay);
        }
        // если было показано сообщение об ошибке, по клику/нажатию сообщение пропадает, ничего не сбрасывается
        else if ((!prevState.messageIsShown && this.state.messageIsShown) ||
                (!prevState.lkFormIsShown && this.state.lkFormIsShown)) {

            this.page.addEventListener('click', this.hideMessageForm);
            this.page.addEventListener('keydown', this.hideMessageForm);
        }
        
        //TODO!
        //this.switchLkLogout(false);
    }

    render() {
        console.log('render display');

        const contentClass = 'page__content content' + 
                            ((this.state.endOfGame || this.state.messageIsShown || this.state.lkFormIsShown) ? ' content_transparent' : '');
        const tabloClass = 'page__tablo ' + (this.state.endOfGame ? 'tablo_shown' : 'tablo_hidden');
        const messageFormClass = 'page__message-form ' + (this.state.messageIsShown ? 'message-form_shown' : 'message-form_hidden');
        const lkFormClass = 'page__lk-form ' + (this.state.lkFormIsShown ? 'lk-form_shown' : 'lk-form_hidden');

        return (
            <div ref = {elem => this.page = elem} className = 'page'>
                <div className = {contentClass}>
                    <Header className = 'content__header' quotesSwitchedOff = {this.state.quotesSwitchedOff}/>
                    
                    <div className = 'content__main main'>

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
                            clickLkButton = {this.clickLkButton}
                            lkLogout = {this.state.lkLogout}
                        />

                        <div className = 'main__chessboard chessboard'>
                            <div className = 'chessboard__marks-container marks-container marks-container_horizontal marks-container_top'>
                                {this.state.marks.horizontal}
                            </div>

                            <div className = 'chessboard__marks-container marks-container marks-container_horizontal marks-container_bottom'>
                                {this.state.marks.horizontal}
                            </div>

                            <div className = 'chessboard__marks-container marks-container marks-container_vertical marks-container_left'>
                                {this.state.marks.vertical}
                            </div>

                            <div className = 'chessboard__marks-container marks-container marks-container_vertical marks-container_right'>
                                {this.state.marks.vertical}
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

                    <Footer className = 'content__footer'/>
                </div>
               
                <Tablo 
                    className = {tabloClass}
                    movesCount = {this.state.movesCount}
                    whiteActorsCount = {this.state.whiteActorsCount}
                    blackActorsCount = {this.state.blackActorsCount}
                    totalOfGame = {this.state.totalOfGame}
                    userColor = {this.props.userColor}
                />

                <LkForm 
                    className = {lkFormClass}
                    login = {this.state.lkLogin}
                    email = {this.state.lkEmail}
                    isEmailConfirmed = {this.state.lkIsEmailConfirmed}
                    role = {this.state.lkRole}
                    showMessage = {this.showMessage}
                    switchLkLogout = {this.switchLkLogout}
                />

                <MessageForm 
                    className = {messageFormClass}
                    message = {this.state.message}
                    messageLink = {this.state.messageLink}
					messageLinkName = {this.state.messageLinkName}
                />

            </div>
        )
    }
}