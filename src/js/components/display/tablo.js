
import React, { Component } from 'react';

export default class Tablo extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.className !== this.props.className);
	}

    render() {
		console.log('render tablo');
		const tabloClass = 'tablo ' + (this.props.className ? this.props.className : '');

        return (
			<div className = {tabloClass}>
				<p>GAME OVER</p>
				<p>Вы выиграли!</p>
				<p>Со счетом </p>
				<p>Количество ходов: </p>
				<p>Прошло времени: </p>
			</div>
        )
    }
}
