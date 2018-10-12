
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import apiConst from '../apiConst';
import MessageForm from './messageForm';

// страница входа на сайт
export default class AuthUtilsForm extends Component {

	constructor(props) {
		super(props);

		this.titles = {
			vkTitle: 'Войти с помощью Вконтакте',
			fbTitle: 'Войти с помощью Facebook',
			googleTitle: 'Войти с помощью Google',
		};

		this.apiUrl = {
			loginApi: `${apiConst.api_url}/login/`,
			vkApi: `https://oauth.vk.com/authorize?client_id=${apiConst.vk_client_id}&display=page&scope=email&redirect_uri=${apiConst.api_url}/login&response_type=code&v=5.85&state=vk`,
			googleApi: `https://accounts.google.com/o/oauth2/auth?redirect_uri=${apiConst.api_url}/login&response_type=code&client_id=${apiConst.google_client_id}&scope=https://www.googleapis.com/auth/userinfo.email`,
			changePasswordApi: `${apiConst.api_url}/changepassword/`,
			emailConfirmApi: `${apiConst.api_url}/emailconfirm/`,
		}

		this.defaultData = {
			emailData: 'Введите e-mail',
			passwordData: 'Повторите пароль',
		};

		this.warningData = {
			emailData: 'Введите корректный e-mail',
			passwordData: 'Введите корректный пароль',
			duplicatePasswordData: 'Пароли не совпадают'
		};

		this.state = {
			emailData: this.defaultData.emailData,
			passwordData: this.defaultData.passwordData,
			messageIsShown: false,
			message: ''
		};

		this.changeData = this.changeData.bind(this);
		this.clickLoginButton = this.clickLoginButton.bind(this);
		this.clearData = this.clearData.bind(this);
		this.clickSocialLoginButton = this.clickSocialLoginButton.bind(this);
		this.resetPage = this.resetPage.bind(this);
		this.responseHandle = this.responseHandle.bind(this);
		this.clickRecoveryPasswordButton = this.clickRecoveryPasswordButton.bind(this);
		this.checkData = this.checkData.bind(this);
		this.clickEmailConfirmButton = this.clickEmailConfirmButton.bind(this);
		this.clickResetPasswordButton = this.clickResetPasswordButton.bind(this);
	}

	// по клику на инпуте он очищается
	clearData(event) {

		if (event.target.name == 'email') {
			this.setState({
				emailData: ''
			});
		}
		else if (event.target.name == 'password') {
			this.setState({
				passwordData: ''
			});
		}
		else if (event.target.name == 'duplicatePassword') {
			this.setState({
				duplicatePasswordData: ''
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
		else if (event.target.name == 'password') {
			this.setState({
				passwordData: event.target.value
			});
		}
		else if (event.target.name == 'duplicatePassword') {
			this.setState({
				duplicatePasswordData: event.target.value
			});
		}
	}

	//check user data
	checkData(emailData, passwordData, duplicatePasswordData) {

		debugger;
		
		if ( emailData && (
			emailData == this.defaultData.emailData || emailData == this.warningData.emailData 
			|| emailData == '')) {
			this.setState({
				emailData: this.warningData.emailData
			});

			return false;
		}
		else if ( passwordData && (
				passwordData == this.defaultData.passwordData || 
				passwordData == this.warningData.passwordData|| passwordData == '')) {
					this.setState({
						passwordData: this.warningData.passwordData
					});

					return false;
		}
		else if ( duplicatePasswordData && (
			duplicatePasswordData == this.defaultData.duplicatePasswordData || 
			duplicatePasswordData == this.warningData.duplicatePasswordData|| duplicatePasswordData == '')) {
				this.setState({
					duplicatePasswordData: this.warningData.duplicatePasswordData
				});

				return false;
		}

		return true;
	}

	clickLoginButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData, this.state.passwordData);

		if (!dataIsCorrect) return;

		return axios.post(this.apiUrl.loginApi, {
			email: this.state.emailData,
			password: this.state.passwordData
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

	clickSocialLoginButton(event) {

		const service = event.target.name;
		let socialLink;

		switch (service) {
			case 'vkontakte':
				socialLink = this.apiUrl.vkApi;
				break;
			case 'google':
				socialLink = this.apiUrl.googleApi;
				break;
			default:  //??
				console.log('login error: no service name');
				break;
		}
		debugger;

		// TODO!!! vkontakte api не отвечает localhost (нет 'Access-Control-Allow-Origin' в заголовке)
		return axios.get(socialLink)
			.then((response) => {

				debugger;
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	clickRecoveryPasswordButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData);

		if (!dataIsCorrect) return;
		
		return axios.post(this.apiUrl.changePasswordApi, {
			email: this.state.emailData,
		})
			.then((response) => {
				//response.data
				//response.status
				//response.statusText
				
				response.data = 'Инструкции по восстановлению пароля отправлены на указанный адрес электронной почты.';
				this.responseHandle(response);
			})
			.catch((error) => {
				//error.response.data
				//error.response.status
				//error.response.statusText

				this.responseHandle(error);
			})
	}

	clickEmailConfirmButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData);

		if (!dataIsCorrect) return;
		
		return axios.post(this.apiUrl.emailConfirmApi, {
			email: this.state.emailData,
		})
			.then((response) => {
				//response.data
				//response.status
				//response.statusText
				response.data = 'Письмо с кодом подтверждения отправлено на указанный адрес электронной почты.';
				
				this.responseHandle(response);
			})
			.catch((error) => {
				//error.response.data
				//error.response.status
				//error.response.statusText

				this.responseHandle(error);
			})
	}

	clickResetPasswordButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(undefined, this.state.passwordData, this.state.duplicatePasswordData);

		if (!dataIsCorrect) return;
		
		return axios.put(this.apiUrl.changePasswordApi, {
			email: this.state.emailData,
		})
			.then((response) => {
				//response.data
				//response.status
				//response.statusText
				response.data = 'Пароль изменен.';
				
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
			passwordData: this.defaultData.passwordData,
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

		console.log('--------render authUtilsPage--------------');

		const LoginFormContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>

				<div className = 'auth-utils-form_title'>Вход</div>

				<div className = 'auth-utils-form_social'>

					<img 
						name = "vkontakte"
						className = 'social-icon' 
						src = '/icons/vkontakte-icon_blue.png' 
						alt = {this.titles.vkTitle} 
						title = {this.titles.vkTitle}
						onClick = {this.clickSocialLoginButton}>
					</img>

					<img 
						name = "facebook"
						className = 'social-icon social-icon_facebook' 
						src = '/icons/facebook-icon_grey.png' 
						alt = {this.titles.fbTitle} 
						title = {this.titles.fbTitle}>
					</img>

					<img 
						name = "google"
						className = 'social-icon' 
						src = '/icons/google-icon_red.png' 
						alt = {this.titles.googleTitle} 
						title = {this.titles.googleTitle}
						onClick = {this.clickSocialLoginButton}>
					</img>
				</div>

				<input 
					name = "email"
					type="text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>
				<input 
					name = 'password'
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.passwordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_login auth-utils-form__button' onClick = {this.clickLoginButton}>Войти</button>

				<div className = 'auth-utils-form_text'>или</div>

				<Link to="/registration">
					<button className = 'button button_reg auth-utils-form__button'>Зарегистрироваться</button>
				</Link>

				<Link className = 'auth-utils-form_link' to="/recoveryPassword">
					Забыли пароль?	
				</Link>

				<Link className = 'auth-utils-form_link' to="/emailConfirm">
					Не пришло письмо?	
				</Link>

			</div>
		);
		
		const recoveryPasswordContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Восстановление пароля</div>

				
				<input 
					name = "email"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickRecoveryPasswordButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);

		const emailConfirmContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Повторная отправка письма</div>

				
				<input 
					name = "email"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickEmailConfirmButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);

		const resetPasswordContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Восстановление пароля</div>

				
				<input 
					name = "password"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.password}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<input 
					name = "duplicatePassword"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.duplicatePassword}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickResetPasswordButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);



		let formContent;

		switch (this.props.name) {

			case 'LoginPage':
				formContent = LoginFormContent;
				break;

			case 'RecoveryPasswordPage':
				formContent = recoveryPasswordContent;
				break;

			case 'EmailConfirmPage':
				formContent = emailConfirmContent;
				break;

			case 'ResetPasswordPage':
			formContent = resetPasswordContent;
			break;				

			default:  //??
				this.responseHandle('form error: no form name');
				break;
		}

		const contentClass = 'page__content content' + (this.state.messageIsShown ? ' content_transparent' : '');
		const messageFormClass = 'page__message-form ' + (this.state.messageIsShown ? 'message-form_shown' : 'message-form_hidden');

		return (

			<div ref = {elem => this.page = elem} className = 'page'>
			
				<div className = {contentClass}>
					{formContent}
				</div>

				<MessageForm
					className = {messageFormClass}
					message = {this.state.message}
				/>

			</div>
		)
	}
}