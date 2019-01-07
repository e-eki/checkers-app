'use strict';

import axios from 'axios';
import Promise from 'bluebird';
import apiConst from '../../constants/apiConst';

export function startGameAction(accessToken, userActorsColor, boardSize, level, mode) {
	debugger;
	const params = {
		userActorsColor: userActorsColor,
		boardSize: boardSize,
		level: level,
		mode: mode,
	};

	const options = {
		method: 'POST',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameApi}`
	};
	
	return axios(options);
};

export function finishGameAction(accessToken, movesCount, totalOfGame) {
	debugger;

	const params = {
		movesCount: movesCount,
		totalOfGame: totalOfGame,
	};

	const options = {
		method: 'PUT',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameApi}`
	};
	
	return axios(options);
};

export function getAIturn(accessToken) {
	debugger;
	const options = {
		method: 'GET',
		headers: { 'Authorization': `Token ${accessToken}` },
		url: `${apiConst.gameTurnApi}`
	};
	
	return axios(options);
};

export function setUserTurn(accessToken, userTurn) {
	debugger;

	const params = {
		userTurn: userTurn,
	};

	const options = {
		method: 'POST',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameTurnApi}`
	};
	
	return axios(options);
};


  
  