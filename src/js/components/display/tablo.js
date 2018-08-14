
import React, { Component } from 'react';

// табло с результатами игры
export default class Tablo extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		// отрисовка нужна, только если сменился стиль - табло стало видимым
		return (nextProps.className !== this.props.className);
	}

    render() {
		console.log('render tablo');
		const tabloClass = 'tablo ' + (this.props.className ? this.props.className : '');
		const whoWins = this.props.standoff ? 'Ничья!' : (this.props.isUserTurn ? 'Вы выиграли!' : 'Вы проиграли!');
		const score = (this.props.userColor == 'white') ? (this.props.whiteActorsCount + ' : ' + this.props.blackActorsCount)
														: (this.props.blackActorsCount + ' : ' + this.props.whiteActorsCount);

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
