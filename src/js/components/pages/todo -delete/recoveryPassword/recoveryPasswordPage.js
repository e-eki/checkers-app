
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import apiConst from '../../apiConst';
import MessageForm from '../../forms/messageForm';

// страница восстановления пароля
export default class RecoveryPasswordPage extends Component {

	constructor(props) {
		super(props);

		this.apiUrl = {
			changePasswordApi: `${apiConst.api_url}/changepassword/`,
			emailConfirmApi: `${apiConst.api_url}/emailconfirm/`,
		}

		this.defaultData = {
			emailData: 'Введите e-mail',
		};

		this.state = {
			emailData: this.defaultData.emailData,
			messageIsShown: false,
			message: ''
		};

		this.changeData = this.changeData.bind(this);
		this.clickSendingButton = this.clickSendingButton.bind(this);
		this.clearData = this.clearData.bind(this);
		this.resetPage = this.resetPage.bind(this);
		this.responseHandle = this.responseHandle.bind(this);
	}

	// по клику на инпуте он очищается
	clearData(event) {

		if (event.target.name == 'email') {
			this.setState({
				emailData: ''
			});
		}
	}

	// ввод данных юзером
	changeData(event) {

		if (event.target.name == 'email') {
			this.setState({
				emailData: event.target.value
			});
		}
	}
	
	clickSendingButton(event) {
		debugger;

		//check email data
		if (this.state.emailData == this.defaultData.emailData || this.state.emailData == '') {
			this.setState({
				emailData: 'Введите корректный e-mail'
			});

			return;
		}
		
		return axios.post(this.apiUrl.changePasswordApi, {
			email: this.state.emailData,
		})
			.then((response) => {
				//response.data
				//response.status
				//response.statusText
				
				this.responseHandle(response);
			})
			.catch((error) => {
				//error.response.data
				//error.response.status
				//error.response.statusText

				this.responseHandle(error);
			})
	}

	responseHandle(response) {

		/*switch (response.status) {

			//case 404 : 
		};*/
		debugger;

		this.setState({
			messageIsShown: true,
			message: response.data
		});
	}

	resetPage() {

		this.page.removeEventListener('click', this.resetPage);
		this.page.removeEventListener('keydown', this.resetPage);
		
		this.setState({
			messageIsShown: false,
			message: '',
			emailData: this.defaultData.emailData,
		})
	}

	componentDidUpdate(prevState) {     
        // если стала видна форма с сообщением юзеру
		if (!prevState.messageIsShown && this.state.messageIsShown) {

            this.page.addEventListener('click', this.resetPage);
            this.page.addEventListener('keydown', this.resetPage);
		}
	}

	render() {
		console.log('--------render recoveryPasswordPage--------------');

		const contentClass = 'page__content content' + (this.state.messageIsShown ? ' content_transparent' : '');
		const messageFormClass = 'page__message-form ' + (this.state.messageIsShown ? 'message-form_shown' : 'message-form_hidden');
		
		return (

			<div ref = {elem => this.page = elem} className = 'page'>
			
				<div className = {contentClass}>
				
					<div className = 'content__login-form login-form'>				
						<div className = 'login-form_title'>Восстановление пароля</div>

						
						<input 
							name = "email"
							type = "text" 
							className = 'login-form_input' 
							maxLength = '40'
							value = {this.state.emailData}
							onChange = {this.changeData}
							onClick = {this.clearData}
						/>

						<button className = 'button button_login login-form__button' onClick = {this.clickSendingButton}>Отправить</button>
						
						<Link className = 'login-form_link' to="/login">
							На страницу входа	
						</Link>

					</div>
				</div>

				<MessageForm
					className = {messageFormClass}
					message = {this.state.message}
				/>

			</div>
		)
	}
}