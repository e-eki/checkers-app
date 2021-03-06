'use strict';

import React, { Component } from 'react';
import Promise from 'bluebird';
import Header from './header';
import Footer from './footer';
import Toolbar from './toolbar';
import Grid from './grid';
import Infobar from './infobar';
import Tablo from './tablo';
import LkForm from '../../forms/lkForm';
import MessageForm from '../../forms/messageForm';
import * as authActions from '../../actions/authActions';
import * as utilsActions from '../../actions/utilsActions';
import * as gameActions from '../../actions/gameActions';
import gameConst from '../../../constants/gameConst';

// главная страница - страница игры
export default class GamePage extends Component {

    constructor(props) {
        super(props);

        this.defaultSettings = {
            quotesSwitchedOff: false,   // флаг, показывать ли панель с цитатами
            userActorsColor: gameConst.userActorsColor.white,    // цвет фигур юзера
            boardSize: gameConst.boardSize.default,          // размер доски
            level: gameConst.level.easy,         // уровень сложности игры
            mode: gameConst.mode.classic,       // режим игры
            currentActionDefinition: '',       // описание текущего хода - нужно для вывода в инфобаре

            // есть три состояния игры:
            // игра началась (startOfGame = true && endOfGame = false),
            // игра завершилась (startOfGame = false && endOfGame = true)
            // игра в режиме ожидания и настройки (startOfGame = false && endOfGame = false)
            startOfGame: false,    // флаг начала игры
            endOfGame: false,      // флаг завершения игры

            isUserTurn: null,       // флаг, что сейчас ход пользователя
            currentUserTurn: null,  // данные о текущем ходе пользователя
            currentAITurn: null,    // данные о текущем ходе ИИ

            movesCount: 0,           // количество ходов за игру - нужно для вывода в инфобаре
            whiteActorsCount: 0,     // количество белых фигур на доске - нужно для вывода в инфобаре
            blackActorsCount: 0,     // количество черных фигур на доске - нужно для вывода в инфобаре
            totalOfGame: gameConst.totalOfGame.standoff,    // результат игры - по умолчанию ничья

            messageIsShown: false,     // показывать сообщение об ошибке
            lkFormIsShown: false,     // показывать лк
            messageLink: '/',          // ссылка в сообщении об ошибке
            messageLinkName: 'На главную',  // текст ссылки сообщении об ошибке
            message: '',               // текст сообщения об ошибке
            lkLogin: '',               // логин юзера в лк
            lkEmail: '',               // имейл юзера в лк
            lkIsEmailConfirmed: '',    // статус подтверждения почты юзера в лк
            lkRole: '',                // роль юзера в лк
            lkGames: [],               // игры юзера в лк
            lkLogout: false,           // флаг, что юзер разлогинился   //??
        }

        this.state = {
            // массив букв и цифр для разметки доски
            marks: {
                horizontal: [],
                vertical: [],
            },
            quotesSwitchedOff: this.defaultSettings.quotesSwitchedOff,
            userActorsColor: this.defaultSettings.userActorsColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
            currentActionDefinition: this.defaultSettings.currentActionDefinition,
            startOfGame: this.defaultSettings.startOfGame,
            endOfGame: this.defaultSettings.endOfGame,
            isUserTurn: this.defaultSettings.isUserTurn,
            currentUserTurn: this.defaultSettings.currentUserTurn,  //??
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
            lkGames: this.defaultSettings.lkGames,
            lkLogout: this.defaultSettings.lkLogout,
        };

        this.drawMarks = this.drawMarks.bind(this);
        this.switchStartGame = this.switchStartGame.bind(this);
        this.updateData = this.updateData.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.resetDefaultSettings = this.resetDefaultSettings.bind(this);
        this.createTurnDefinition = this.createTurnDefinition.bind(this);
        this.turn = this.turn.bind(this);
        this.resetPage = this.resetPage.bind(this);
        //this.showMessage = this.showMessage.bind(this);
        this.responseHandle = this.responseHandle.bind(this);
        this.errorResponseHandle = this.errorResponseHandle.bind(this);  //??
        this.clickLkButton = this.clickLkButton.bind(this);
        this.showLkForm = this.showLkForm.bind(this);
        this.clickLogoutButton = this.clickLogoutButton.bind(this);
    }

    // отрисовка разметки шахматной доски
    drawMarks(boardSize = this.state.boardSize) {
		this.state.marks.horizontal = [];
		this.state.marks.vertical = [];
        
        // уникальный ключ для каждой метки
        let markKey = 0;
        
		for (var i = 0; i < boardSize; i++) {
			this.state.marks.horizontal.push(<span key={markKey} >{gameConst.marksSymbols.horizontal[i]}</span>);
            this.state.marks.vertical.push(<span key={markKey} >{gameConst.marksSymbols.vertical[i]}</span>);
            
            markKey++;
		}
	}

    // обновление настроек при кликах по кнопкам в тулбаре
    updateData(data, value) {
        debugger;
        this.state[`${data}`] = value;

        // если меняется размер доски, перерисовываем разметку
        if (data == 'boardSize') {
            this.drawMarks();
        }

        this.setState({});
    }

    // переключение начала/завершения игры - вызывается кнопкой в тулбаре, лк логаутом, или когда число белых или черных фигур = 0
    switchStartGame(event) {

        // начать игру
        /*if (this.state.startOfGame == false) {
            this.setState({
                startOfGame: true,
                endOfGame: false,
                isUserTurn: (this.state.userActorsColor == 'white') ? true : false,
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
                if ((this.state.userActorsColor == 'white' && this.state.whiteActorsCount == 0) ||
                    (this.state.userActorsColor == 'black' && this.state.blackActorsCount == 0)) {
                        this.state.totalOfGame = 'AI';
                    }
                else {
                    this.state.totalOfGame = 'user';
                }   
            }
        } */

        debugger;
		return Promise.resolve(true)
			.then(() => {
				return authActions.getActualAccessToken();
			})
			.then((accessToken) => {
                //TODO!
                this.state.isUserTurn = (this.state.userActorsColor == gameConst.userActorsColor.white) ? true : false;

                let tasks = [];
        
                // начать игру
                if (this.state.startOfGame === false) {
                    tasks.push(gameActions.startGameAction(accessToken, this.state.userActorsColor.name, this.state.boardSize, this.state.level.name, this.state.mode.name));

                    if (!this.state.isUserTurn) 
                        tasks.push(gameActions.getAIturn(accessToken));
                }
                // завершить игру
                else {
                    // по завершении игры подводим итог - кто выиграл
                    // если передано событие event, то метод был вызван кнопкой в тулбаре, и значит, юзер сам завершил игру - ничья
                    if (!event) {
                        // если на доске не осталось фигур цвета юзера, то победил ИИ
                        if ((this.state.userActorsColor == gameConst.userActorsColor.white && this.state.whiteActorsCount == 0) ||
                            (this.state.userActorsColor == gameConst.userActorsColor.black && this.state.blackActorsCount == 0)) {
                                this.state.totalOfGame = gameConst.totalOfGame.AI;
                            }
                        else {
                            this.state.totalOfGame = gameConst.totalOfGame.user;
                        }   
                    }

                    tasks.push(gameActions.finishGameAction(accessToken, this.state.movesCount, this.state.totalOfGame.name));
                }

                return Promise.all(tasks);
            })
            .spread((switchGameResponse, AIturnResponse) => {
                debugger;
                // начать игру
                if (this.state.startOfGame == false) {
                    //TODO!
                    if (!this.state.isUserTurn && AIturnResponse) {
                        this.state.currentAITurn = {
                            currentPosition: AIturnResponse.data.currentPosition,
                            newPosition: AIturnResponse.data.targetPosition,
                        };
                    }
                    this.setState({
                        startOfGame: true,
                        endOfGame: false,
                        //isUserTurn: (this.state.userActorsColor == 'white') ? true : false,
                    });
                }
                //завершить игру
                else {
                    this.setState({
                        startOfGame: false,
                        endOfGame: true,
                    });
                } 

                return switchGameResponse;
            })
			.catch((error) => {              
                this.state.messageLink = '/login';
                this.state.messageLinkName = 'Войти на сайт';
                
                this.errorResponseHandle(error);
			})
    }

    // обработчик хода
    turn(currentPosition, newPosition, actor, eatenActor, turnedToDam) {
        debugger;
        return Promise.resolve(true)
			.then(() => {
                this.state.movesCount++;
                this.state.currentActionDefinition = this.createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam);

                // если количество черных или белых фигур = 0, то завершение игры.
                if (whiteActorsCount == 0 || blackActorsCount == 0) {
                    this.switchStartGame();  //todo!
                    return false;
                }

				return authActions.getActualAccessToken();
			})
			.then((accessToken) => {
                if (accessToken === false) return false;

                let tasks = [];

                if (this.state.isUserTurn) {
                    this.state.currentUserTurn = {
                        currentPosition: currentPosition,
                        targetPosition: newPosition,
                    };
            
                    tasks.push(gameActions.setUserTurn(accessToken, this.state.currentUserTurn));
                    tasks.push(gameActions.getAIturn(accessToken));
                }
                else {       
                    this.state.currentAITurn = this.defaultSettings.currentAITurn;  
                }

                return Promise.all(tasks);
            })
            .spread((setUserTurnResponse, AIturnResponse) => {
                if (AIturnResponse) {
                    this.state.currentAITurn = {
                        currentPosition: AIturnResponse.data.currentPosition,
                        newPosition: AIturnResponse.data.targetPosition,
                    };
                }

                this.state.isUserTurn = !this.state.isUserTurn;
                this.setState({});
            })
            .catch((error) => {              
                this.state.messageLink = '/login';
                this.state.messageLinkName = 'Войти на сайт';
                
                this.errorResponseHandle(error);
			})
    }

    // вернуть все визуальные настройки игры по умолчанию (кнопкой из тулбара)
    resetDefaultSettings() {
        this.setState({
            quotesSwitchedOff: this.defaultSettings.quotesSwitchedOff,
            userActorsColor: this.defaultSettings.userActorsColor,
            boardSize: this.defaultSettings.boardSize,
            level: this.defaultSettings.level,
            mode: this.defaultSettings.mode,
        })
    }

    // при завершении игры показывается табло с результатами,
    // по клику или нажатию любой клавиши табло исчезает и происходит reset
    resetAll(event) {
        this.page.removeEventListener('click', this.resetAll);
        this.page.removeEventListener('keydown', this.resetAll);

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
            lkGames: this.defaultSettings.lkGames,
            lkLogout: this.defaultSettings.lkLogout,   //TODO: костыль?
        });
    }

    // получить описание текущего хода - нужно для вывода в инфобаре
    createTurnDefinition(currentPosition, newPosition, actor, eatenActor, turnedToDam) {
        debugger;
        // метки на доске, соответствующие координатам хода
        const currentPositionMarks = {
			markX: gameConst.marksSymbols.horizontal[currentPosition.x],
			markY: gameConst.marksSymbols.vertical[currentPosition.y]
		};

		const newPositionMarks = {
			markX: gameConst.marksSymbols.horizontal[newPosition.x],
			markY: gameConst.marksSymbols.vertical[newPosition.y]
		};

        let definition = '';

        definition += this.state.movesCount + ') ';
        definition += ' ' + (actor.isuserActorsColor ? 'Ваша' : 'Противника');
        definition += ' ' + (actor.type == "grid__actor_checker" ? 'шашка' : 'дамка');
        definition += ' перемещена с клетки ' + currentPositionMarks.markX + currentPositionMarks.markY + 
                        ' на клетку ' + newPositionMarks.markX + newPositionMarks.markY + '.';

        if (eatenActor) {
            definition += ' ' + (eatenActor.isuserActorsColor ? 'Ваша' : 'Противника');
            definition += ' ' + (eatenActor.type == 'grid__actor_checker' ? 'шашка' : 'дамка');
            definition += ' съедена.';
        }

        if (turnedToDam) {
            definition += ' ' + (actor.isuserActorsColor ? 'Ваша шашка' : 'Противника шашка');
            definition += ' превратилась в дамку.';
        }

        return definition;
    }

    clickLkButton() {
		debugger;

		return Promise.resolve(true)
			.then(() => {
				return authActions.getActualAccessToken();
			})
			.then((accessToken) => {		
				return authActions.getLkDataAction(accessToken);
			})
			.then((response) => {
                debugger;
                if (!response.data) throw new Error('no lk data for user'); 

				this.showLkForm(response.data);
			})
			.catch((error) => {
                // TODO: почему ссылка на страницу входа не срабатывает? аналогичная ссылка на главную со страницы входа работает.
                this.state.messageLink = '/login';
                this.state.messageLinkName = 'Войти на сайт';
                this.state.lkLogout = true;

                // TODO
                if (error.response) {
                    error.response.message = 'Вы не авторизованы для данного действия';
                }
                else {
                    error.message = 'Вы не авторизованы для данного действия';
                }    
                
                this.errorResponseHandle(error);
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
            lkGames: data.games,
        })
    }
    
    // TODO
    /*showMessage(message, messageLink = this.defaultSettings.messageLink, messageLinkName = this.defaultSettings.messageLinkName) {
        this.setState({
            message: message,
            messageIsShown: true,
            messageLink: messageLink,
            messageLinkName: messageLinkName,
        })
    }*/

    responseHandle(response) {	
		this.setState({
			messageIsShown: true,
			message: (response.data ? response.data : ''),  //??
		});
    }

    errorResponseHandle(error) {
		debugger;		
		let message = utilsActions.getErrorResponseMessage(error);

		this.setState({
			messageIsShown: true,
			message: message,
		});
	}
    
    clickLogoutButton(event) {
		debugger;

		return Promise.resolve(true)
			.then(() => {
                let tasks = [];

                tasks.push(authActions.logoutAction());

                if (this.state.startOfGame === true) {
                    tasks.push(this.switchStartGame(event));
                }
                
                return Promise.all(tasks);
			})
			.spread((logoutResponse, switchStartGameResponse) => {
                debugger;

                let response = switchStartGameResponse ? switchStartGameResponse : logoutResponse;
				 // TODO!! сделать, чтобы сначала выводилось сообщение о выходе, а потом табло с завершением игры
				 this.state.lkLogout = true;

				response.data = 'Выход из аккаунта осуществлен успешно.';
				this.responseHandle(response);				
			})
			.catch((error) => {
				this.errorResponseHandle(error);  
			})
    }
    
    // когда скрывается сообщение, скрывается и лк (если был показан)
    resetPage(event) {
        debugger;
        this.page.removeEventListener('click', this.resetPage);
        this.page.removeEventListener('keydown', this.resetPage);

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
            lkGames: this.defaultSettings.lkGames,
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
        // если игра завершена, то появляется табло, и по клику/нажатию любой клавиши табло пропадает и сбрасываются настройки
        if (!prevState.endOfGame && this.state.endOfGame) {
            this.page.addEventListener('click', this.resetAll);
            this.page.addEventListener('keydown', this.resetAll);
        }
        // если было показано сообщение об ошибке, по клику/нажатию сообщение пропадает, ничего не сбрасывается
        else if ((!prevState.messageIsShown && this.state.messageIsShown) ||
                (!prevState.lkFormIsShown && this.state.lkFormIsShown)) {
            this.page.addEventListener('click', this.resetPage);
            this.page.addEventListener('keydown', this.resetPage);
        }
        
        //TODO!
        if (this.state.lkLogout == true && prevState.lkLogout == false) {
            this.state.lkLogout = this.defaultSettings.lkLogout;
        }
    }

    render() {
        //console.log('render display');

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
                            userActorsColor = {this.state.userActorsColor} 
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
                                turn = {this.turn} 
                                boardSize = {this.state.boardSize} 
                                userActorsColor = {this.state.userActorsColor} 
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
                    userActorsColor = {this.props.userActorsColor}
                />

                <LkForm 
                    className = {lkFormClass}
                    login = {this.state.lkLogin}
                    email = {this.state.lkEmail}
                    isEmailConfirmed = {this.state.lkIsEmailConfirmed}
                    role = {this.state.lkRole}
                    games = {this.state.lkGames}
                    clickLogoutButton = {this.clickLogoutButton}
                    lkLogout = {this.state.lkLogout}
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