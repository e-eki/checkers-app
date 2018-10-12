
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import apiConst from '../../apiConst';
import MessageForm from '../../forms/messageForm';

// страница входа на сайт
export default class LoginPage extends Component {

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
		}

		this.defaultData = {
			emailData: 'Введите e-mail',
			passwordData: 'Введите пароль',
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
		this.socialLogin = this.socialLogin.bind(this);
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
		else if (event.target.name == 'password') {
			this.setState({
				passwordData: ''
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
	}

	clickLoginButton(event) {
		debugger;

		//check user data
		if (this.state.emailData == this.defaultData.emailData || this.state.emailData == '') {
			this.setState({
				emailData: 'Введите корректный e-mail'
			});

			return;
		}
		else if (this.state.passwordData == this.defaultData.passwordData || this.state.passwordData == '') {
			this.setState({
				passwordData: 'Введите корректный пароль'
			});

			return;
		}

		
		return axios.post(this.apiUrl.loginApiLink, {
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

	socialLogin(event) {

		const service = event.target.name;
		let socialLink;

		switch (service) {
			case 'vkontakte':
				socialLink = this.apiUrl.vkApiLink;
				break;
			case 'google':
				socialLink = this.apiUrl.googleApiLink;
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

		console.log('--------render loginPage--------------');

		const contentClass = 'page__content content' + (this.state.messageIsShown ? ' content_transparent' : '');
		const messageFormClass = 'page__message-form ' + (this.state.messageIsShown ? 'message-form_shown' : 'message-form_hidden');

		return (

			<div ref = {elem => this.page = elem} className = 'page'>
			
				<div className = {contentClass}>
				
					<div className = 'content__login-form login-form'>				
						<div className = 'login-form_title'>Вход</div>

						<div className = 'login-form_social'>

							<img 
								name = "vkontakte"
								className = 'social-icon' 
								src = '/icons/vkontakte-icon_blue.png' 
								alt = {this.titles.vkTitle} 
								title = {this.titles.vkTitle}
								onClick = {this.socialLogin}>
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
								onClick = {this.socialLogin}>
							</img>
						</div>

						<input 
							name = "email"
							type="text" 
							className = 'login-form_input' 
							maxLength = '40'
							value = {this.state.emailData}
							onChange = {this.changeData}
							onClick = {this.clearData}
						/>
						<input 
							name = 'password'
							type = "text" 
							className = 'login-form_input' 
							maxLength = '40'
							value = {this.state.passwordData}
							onChange = {this.changeData}
							onClick = {this.clearData}
						/>

						<button className = 'button button_login login-form__button' onClick = {this.clickLoginButton}>Войти</button>

						<div className = 'login-form_text'>или</div>

						<Link to="/registration">
							<button className = 'button button_reg login-form__button' onClick = {this.clickLoginButton}>Зарегистрироваться</button>
						</Link>

						<Link className = 'login-form_link' to="/recoveryPassword">
							Забыли пароль?	
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