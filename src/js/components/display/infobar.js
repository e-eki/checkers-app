
import React, { Component } from 'react';

export default class Infobar extends Component {

	constructor(props) {
		super(props);
		
		this.startTime = new Date();

		this.state = {
			currentHours: 0,
			currentMinutes: 0,
			currentActionDefinition: this.props.currentActionDefinition
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.currentHours!== this.state.currentHours || nextState.currentMinutes!== this.state.currentMinutes ||
				 nextProps.currentActionDefinition !== this.state.currentActionDefinition);
	}
	
	componentWillUpdate(nextProps, nextState) {
		if (nextProps.currentActionDefinition !== this.state.currentActionDefinition) {

			let newDefinition = this.state.currentActionDefinition + nextProps.currentActionDefinition;
			this.state.currentActionDefinition += nextProps.currentActionDefinition;
		}
	}
	
	componentDidMount() {

		var tick = function() {

			let newDate = new Date();
			let newCurrentHours = newDate.getHours() - this.startTime.getHours() + this.state.currentHours;
			let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes() + this.state.currentMinutes;
			
			this.startTime = newDate;
	
			this.setState({
				currentHours: newCurrentHours,
				currentMinutes: newCurrentMinutes,
			})
		}.bind(this);

		setInterval(tick, 60000);
	}

    render() {
		console.log('render infobar');

		let currentTime = this.state.currentHours + ' ч ' + this.state.currentMinutes + ' мин ';

        return (
			<div class="bar">
				<div>Сейчас ход: <span class="turn">ваш</span></div>
				<div>Прошло времени: <p ref={elem => this.time = elem} class="time">{currentTime}</p></div>
				<div>Сделано ходов: <span class="moves-count">0</span></div>
				<div>Белые фигуры на доске: <span class="white-actors">12</span></div>
				<div>Черные фигуры на доске: <span class="black-actors">12</span></div>
				<div>История ходов: <textarea class="moves-history">{this.state.currentActionDefinition}</textarea></div>
			</div>
        )
    }
}
