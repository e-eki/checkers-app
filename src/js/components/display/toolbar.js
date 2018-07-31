
import React, { Component } from 'react';

export default class Toolbar extends Component {

	constructor(props){
		super(props);
                 
    	this.changeData = this.changeData.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.boardSize !== this.props.boardSize);
    }
	
	changeData(event) {
		console.log(event.target.name, event.target.value);
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
							</select>
						</div>
						<div>
							Выберите режим игры: 
							<select name="mode" onChange = {this.changeData}>
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
