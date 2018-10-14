
import axios from 'axios';
const Promise = require('bluebird');

import apiConst from '../apiConst';

export function loginAction(email, password) {
	debugger;

	return axios.post(`${apiConst.login}`, {
		email: email,
		password: password,
	})
		.then((response) => {

			_setAuthData(response.data);

			delete response.data;
			return(response);
		})
};

export function registrationAction(email, login, password) {
	debugger;

	return axios.post(`${apiConst.registration}`, {
		email: email,
		login: login,
		password: password,
	})
};

export function socialLoginAction(service) {
	debugger;

	switch (service) {
		case 'vkontakte':
			//socialLink = `https://oauth.vk.com/authorize?client_id=${apiConst.vk_client_id}&display=page&scope=email&redirect_uri=${apiConst.api_url}/login&response_type=code&v=5.85&state=vk`;
			socialLink = `${apiConst.vkApi}`;
			break;
		case 'google':
			//socialLink = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${apiConst.api_url}/login&response_type=code&client_id=${apiConst.google_client_id}&scope=https://www.googleapis.com/auth/userinfo.email`;
			socialLink = `${apiConst.googleApi}`;
			break;
		default:  //??
			throw new Error('login error: no service name');
			break;
	}
	debugger;

	// TODO!!! vkontakte api не отвечает localhost (нет 'Access-Control-Allow-Origin' в заголовке)
	return axios.get(socialLink)
		.then((response) => {

			_setAuthData(response.data);

			delete response.data;
			return(response);
		})
};

export function getActualAccessToken() {
	debugger;

	const accessToken = getAccessToken();
	const refreshToken = _getRefreshToken();
	const isAccessTokenExpired = _isAccessTokenExpired();

	return Promise.resolve(true)
		.then(() => {

			if (!isAccessTokenExpired) return true;

			/*if (isAccessTokenExpired && refreshToken) {

				return axios.post(`${apiConst.api_url}/refreshtokens/`, {	
					refreshToken: refreshToken,
				})
			}
			else throw new Error('no refresh token');*/

			return axios.post(`${apiConst.refreshTokens}`, {	
				refreshToken: refreshToken,
			})
		})
		.then((tokensData) => {

			if (tokensData === true) return accessToken;

			_setAuthData(tokensData);
			return tokensData.accessToken;
		})
};


// ----------------------------------------------------

export function getAccessToken() {

	return localStorage.getItem('accessToken');
};

function _getRefreshToken() {

	return localStorage.getItem('refreshToken');
};

function _isAccessTokenExpired () {

	const accessTokenExpTime = localStorage.getItem('expires_in');
	const nowTime = new Date().getTime();

	return accessTokenExpTime <= nowTime;
};

function _setAuthData(tokensData) {

	if (!tokensData.refreshToken || !tokensData.accessToken || !tokensData.expires_in) {
		throw new Error('invalid tokens data');
	}

	localStorage.setItem('refreshToken', tokensData.refreshToken);
	localStorage.setItem('accessToken', tokensData.accessToken);
	localStorage.setItem('expires_in', tokensData.expires_in);
};
    
function _removeAuthData () {

	localStorage.removeItem("refreshToken");
	localStorage.removeItem("accessToken");
	localStorage.removeItem("expires_in");
};
  
  