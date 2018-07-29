
import React, { Component } from 'react';

export default class Infobar extends Component {

    render() {

        return (
					<div class="bar">
						<div>Сейчас ход: <span class="turn">ваш</span></div>
						<div>Прошло времени: <p class="time">1 ч 5 мин</p></div>
						<div>Сделано ходов: <span class="moves-count">0</span></div>
						<div>Белые фигуры на доске: <span class="white-actors">12</span></div>
						<div>Черные фигуры на доске: <span class="black-actors">12</span></div>
						<div>История ходов: <textarea class="moves-history"></textarea></div>
					</div>
        )
    }
}
