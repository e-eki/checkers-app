
import React, { Component } from 'react';
const Promise = require('bluebird');

import * as authActions from '../actions/authActions';

// форма для личного кабинета
export default class LkForm extends Component {

	constructor(props) {
		super(props);

		this.defaultGamesInfo = 'У вас пока еще нет игр.';

		this.clickLogoutButton = this.clickLogoutButton.bind(this);
	}

	clickLogoutButton() {
		debugger;

		return Promise.resolve(true)
			.then(() => {

				return authActions.logoutAction();
			})
			.then((response) => {

				this.props.switchLkLogout(true);
				this.props.showMessage('Выход из аккаунта осуществлен успешно.');
			})
			.catch((error) => {

				this.props.showMessage('Выход из аккаунта осуществлен неуспешно.');  //??
			})
	}

	shouldComponentUpdate(nextProps, nextState) {
		
		return (nextProps.className !== this.props.className || nextProps.message !== '');
	}
	

	render() {
		console.log('--------render lkForm--------------');

		const lkFormClass = 'lk-form ' + (this.props.className ? this.props.className : '');
		const roleInfo = (this.props.role == 'user') ? 'пользователь' : '';
		const emailInfo = 'Контактный email: ' + this.props.email + ' (' + (this.props.isEmailConfirmed ? '' : 'не ') + 'подтвержден)';
		const gamesInfo = this.props.games ? this.props.games : this.defaultGamesInfo;

		return (
			<div className = {lkFormClass}>

				<div className = 'lk-form__title'>Личный кабинет</div>
				
				<div className = 'lk-form__user-info'>

					<p>{this.props.login}</p>
					<p>{roleInfo}</p>
					<p>{emailInfo}</p>
				
				</div>

				<button className = 'lk-form__button button button_send' onClick = {this.clickLogoutButton}>Выйти</button>

				<div className = 'lk-form__title'>Мои игры</div>

				<div className = 'lk-form__games-info'>
					
					<p>{gamesInfo}</p>
				</div>

			</div>
		)
	}
}