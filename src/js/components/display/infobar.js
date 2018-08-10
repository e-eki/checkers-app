
import React, { Component } from 'react';

// панель с инфой
export default class Infobar extends Component {

	constructor(props) {
		super(props);
		
		this.startTime = new Date();
		this.timer = null;

		this.defaultSettings = {
			currentHours: 0,
			currentMinutes: 0,
			startGameDefinition: 'Game start',
			separatingString: '\n' + '\n',
			endGameDefinition: 'End of Game',
		}

		this.state = {
			currentHours: this.defaultSettings.currentHours,
			currentMinutes: this.defaultSettings.currentMinutes,
			currentActionDefinition: ''
		};

		this.tick = this.tick.bind(this);
	}

	tick() {

		let newDate = new Date();
		let newCurrentHours = newDate.getHours() - this.startTime.getHours() + this.state.currentHours;
		let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes() + this.state.currentMinutes;
		
		this.startTime = newDate;

		this.setState({
			currentHours: newCurrentHours,
			currentMinutes: newCurrentMinutes,
		})
	}

	shouldComponentUpdate(nextProps, nextState) {
		// TODO ??
		// перерисовывается каждую минуту для отображения текущего времени и при каждом ходе
		return (
				nextState.currentHours!== this.state.currentHours ||
				nextState.currentMinutes!== this.state.currentMinutes ||
				nextProps.currentActionDefinition !== this.state.currentActionDefinition ||
				nextProps.startOfGame !== this.props.startOfGame	
			);
	}
	
	componentWillUpdate(nextProps, nextState) {

		if (nextProps.startOfGame && !this.props.startOfGame) {
			this.timer = setInterval(this.tick, 60000);

			this.state.currentActionDefinition = this.defaultSettings.startGameDefinition;
		}
		else if (!nextProps.startOfGame && this.props.startOfGame) {
			clearInterval(this.timer);

			this.state.currentActionDefinition += this.defaultSettings.separatingString + this.defaultSettings.endGameDefinition;
		}
		else if (!nextProps.endOfGame && this.props.endOfGame) {

			this.state.currentHours = this.defaultSettings.currentHours;
			this.state.currentMinutes = this.defaultSettings.currentMinutes;
			this.state.currentActionDefinition = '';
		}

		if (nextProps.currentActionDefinition !== this.props.currentActionDefinition) {
			this.state.currentActionDefinition += this.defaultSettings.separatingString + nextProps.currentActionDefinition;
		}
	}

    render() {
		//console.log('render infobar');

		let currentTime = this.state.currentHours + ' ч ' + this.state.currentMinutes + ' мин ';

        return (
			<div className ="bar">
				<div>Сейчас ход: <span>ваш</span></div>
				<div>Прошло времени: <p ref={elem => this.time = elem}>{currentTime}</p></div>
				<div>Сделано ходов: <span>0</span></div>
				<div>Белые фигуры на доске: <span>12</span></div>
				<div>Черные фигуры на доске: <span>12</span></div>
				<div>История ходов: 
					<textarea value = {this.state.currentActionDefinition}></textarea>
				</div>				
			</div>
        )
    }
}
