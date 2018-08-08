
import React, { Component } from 'react';

// панель настроек
export default class Toolbar extends Component {

	constructor(props){
		super(props);
                 
    	this.changeData = this.changeData.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		// перерисовка тулбара нужна только когда изменяется размер доски (чтобы менялось value в инпуте)
        return (nextProps.boardSize !== this.props.boardSize);
    }
	
	// событие изменения настроек
	changeData(event) {
		console.log(event.target.name, event.target.value);
		// вызывает событие в родителе - дисплее
		this.props.updateData(event.target.name, event.target.value);		
	}

	render() {
		console.log('render toolbar');

			return (
				<div className = "bar">
					<form>
						<div>
							Выберите цвет ваших фигур: 
							<select name="userColor" onChange = {this.changeData}>
								<option value="white">белые</option>
								<option value="black">черные</option>
							</select>
						</div>
						<div>
							Выберите размер доски: 
							<span>{this.props.boardSize}</span>
							<input name = "boardSize" type = "range" min = "2" max = "14" step = "2" value = {this.props.boardSize} onChange = {this.changeData}/>
							
						</div>
						<div>
							Выберите уровень сложности: 
							<select name="level" onChange = {this.changeData}>
								<option value="easy">легкий</option>
								<option value="medium">средний</option>
								<option value="hard">сложный</option>
								<option value="hard">randomize</option>
							</select>
						</div>
						<div>
							Выберите режим игры: 
							<select name="mode" onChange = {this.changeData}>
								<option value="classic">классический</option>
								<option value="dam">играть только дамками</option>
							</select>
						</div>
						<button >Настройки по умолчанию</button>
						<button name="startOfGame" onclick = {this.changeData}>Начать игру</button>
					</form>
				</div>
		)
	}
}
