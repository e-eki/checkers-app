
import React, { Component } from 'react';

// панель настроек
export default class Toolbar extends Component {

	constructor(props){
		super(props);
		   
		this.switchStartHandle = this.switchStartHandle.bind(this);
    	this.changeData = this.changeData.bind(this);
	}

	switchStartHandle(event) {
		event.preventDefault();

		// вызывает событие в родителе - дисплее
		this.props.switchStartGame();	
	}
	
	// событие изменения настроек
	changeData(event) {
		
		console.log(event.target.name, event.target.value);
		// вызывает событие в родителе - дисплее
		this.props.updateData(event.target.name, event.target.value);		
	}

	shouldComponentUpdate(nextProps, nextState) {
		// перерисовка тулбара нужна, когда изменяется размер доски 
		// (чтобы менялось value в инпуте при настройке/дефолтное при ресете)
		// TODO???
		return (nextProps.boardSize !== this.props.boardSize || 
				// или когда изменяется состояние игры: старт/завершение
				nextProps.startOfGame !== this.props.startOfGame);
    }

	render() {
		console.log('render toolbar', this.props.startOfGame);

		const disabled = this.props.startOfGame;
		const disabledClass = this.props.startOfGame ? 'disabled-cursor' : '';
		const switchStartBtnText = this.props.startOfGame ? 'Завершить игру' : 'Начать игру';
		//const switchStartBtnClass = this.

			return (
				<div className = "bar">
					<form>
						<div>
							Выберите цвет ваших фигур: 
							<select 
								name="userColor" 
								className = {disabledClass}
								disabled = {disabled} 
								onChange = {this.changeData}>
									<option value="white">белые</option>
									<option value="black">черные</option>
							</select>
						</div>
						<div>
							Выберите размер доски: 
							<span>{this.props.boardSize}</span>
							<input 
								name = "boardSize" 
								type = "range" 
								min = "2" 
								max = "14" 
								step = "2" 
								value = {this.props.boardSize} 
								className = {disabledClass}
								disabled = {disabled} 
								onChange = {this.changeData}
							/>
							
						</div>
						<div>
							Выберите уровень сложности: 
							<select
								name="level" 
								className = {disabledClass}
								disabled = {disabled} 
								onChange = {this.changeData}>
									<option value="easy">легкий</option>
									<option value="medium">средний</option>
									<option value="hard">сложный</option>
									<option value="hard">randomize</option>
							</select>
						</div>
						<div>
							Выберите режим игры: 
							<select 
								name="mode" 
								className = {disabledClass}
								disabled = {disabled} 
								onChange = {this.changeData}>
									<option value="classic">классический</option>
									<option value="dam">играть только дамками</option>
							</select>
						</div>
						<button 
							className = {disabledClass}
							disabled = {disabled}>
								Настройки по умолчанию
						</button>
						<button 
							name = "switchStartBtn" 
							onClick = {this.switchStartHandle}>
								{switchStartBtnText}
						</button>
					</form>
				</div>
		)
	}
}
