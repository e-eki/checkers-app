
import React, { Component } from 'react';

export default class Toolbar extends Component {

    render() {

        return (
			<div className = "bar">
				<form>
					<div>
						Выберите цвет ваших фигур: 
						<select name="userColor">
							<option value="white">белые</option>
							<option value="black">черные</option>
						</select>
					</div>
					<div>
						Выберите размер доски: 
						<input name="boardSize" type="number" min="2" max="14" step="2"/>
					</div>
					<div>
						Выберите уровень сложности: 
						<select name="level">
							<option value="easy">легкий</option>
							<option value="medium">средний</option>
							<option value="hard">сложный</option>
						</select>
					</div>
					<div>
						Выберите режим игры: 
						<select name="mode">
							<option value="classic">классический</option>
							<option value="dam">играть только дамками</option>
						</select>
					</div>
					<button type="submit">Начать игру</button>
				</form>
			</div>
        )
    }
}
