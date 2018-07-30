
import React, { Component } from 'react';
import Slider from 'react-rangeslider';

export default class Toolbar extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			defaultBoardSize: 8
		};
                 
        this.changeBoardSize = this.changeBoardSize.bind(this);
	}
	
	changeBoardSize(event) {

		this.setState({defaultBoardSize: this.boardSizeTool.value});
	}

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
						<span ref={elem => this.boardSize = elem}>
							{this.state.defaultBoardSize}
						</span>
						<input ref = {elem => this.boardSizeTool = elem} type = "range" min = "2" max = "14" step = "2" value = {this.state.defaultBoardSize} onChange = {this.changeBoardSize}/>
						
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
