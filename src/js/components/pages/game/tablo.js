'use strict';

import React, { Component } from 'react';
import gameConst from '../../../constants/gameConst';

// табло с результатами игры
export default class Tablo extends Component {

	shouldComponentUpdate(nextProps) {
		// отрисовка нужна, только если сменился стиль - табло стало видимым
		return (nextProps.className !== this.props.className);
	}

    render() {
		//console.log('render tablo');
		const tabloClass = 'tablo ' + (this.props.className ? this.props.className : '');
		const whoWins = 'Кто выиграл: ' + this.props.totalOfGame.value;
		const score = (this.props.userActorsColor == gameConst.userActorsColor.white) ? (this.props.blackActorsCount + ' : ' + this.props.whiteActorsCount)
														: (this.props.whiteActorsCount + ' : ' + this.props.blackActorsCount);

        return (
			<div className = {tabloClass}>
				<p>GAME OVER</p>
				<p>{whoWins}</p>
				<p>Со счетом {score}</p>
				<p>Количество ходов: {this.props.movesCount}</p>
			</div>
        )
    }
}
