
import React, { Component } from 'react';

class Cell extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('cell shouldComponentUpdate');
		let getNewActor = false;

		if (nextProps.actor && this.props.actor) {
			
			getNewActor = nextProps.actor.props.className !== this.props.actor.props.className;
		}
		return (nextProps.className !== this.props.className || getNewActor);

		//return (nextProps.className !== this.props.className);
    }
    
    render() {
		console.log('render cell');
		const cellClass = 'cell ' + (this.props.className ? this.props.className : '');
        
		return (
			<td className={cellClass}>
				{this.props.actor ? this.props.actor : ''}
			</td>
		)
    }
}

class Actor extends Component {

    constructor(props) {
		super(props);

		this.defaultClassName = '';
		
		this.state = {
			className: '',
		}

		this.addUserFunctionality = this.addUserFunctionality.bind(this);
	}
	
	addUserFunctionality() {

		var select = function(event) {
			console.log('select');
			let newClassName = this.state.className + ' highlight-actor';
			this.props.drawSelectedCells(this.props.positionX, this.props.positionY);
			this.setState({className: newClassName});
		}.bind(this);

		var deselect = function(event) {
			console.log('deselect');
			this.setState({className: this.defaultClassName});
		}.bind(this);

		if (this.ref) {
			this.ref.addEventListener('mouseover', select);
			this.ref.addEventListener("mouseout", deselect); 

		}
	}

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('actor shouldComponentUpdate');
		return (nextProps.className !== this.props.className || nextState.className !== this.state.className);
		//return true;
	}

	componentWillMount() {
		this.defaultClassName = this.state.className = this.props.className;
	}

	componentWillUpdate(nextProps) {
		if (nextProps.className !== this.props.className)
			this.defaultClassName = this.state.className = nextProps.className;
	}
	
	componentDidMount() {
		if (this.props.isUserColor)
			this.addUserFunctionality();
	}
    
    render() {
		console.log('render actor');
		const actorClass = 'actor ' + (this.state.className ? this.state.className : '');
        
        return <div ref={elem => this.ref = elem} className={actorClass}></div>;
    }
}

export default class Board extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			cellsDataContainer: [],
			actorsDataContainer: [],
		};

		this.fillGrid = this.fillGrid.bind(this);
		this.drawSelectedCells = this.drawSelectedCells.bind(this);
		this.fillGridData = this.fillGridData.bind(this);
	}

	fillGridData(boardSize = this.props.boardSize, mode = this.props.mode, userColor = this.props.userColor) {

		console.log('fillGridData', boardSize, mode, userColor);
		//debugger;

		const firstRowWhite = boardSize/2 + 1;
		const lastRowWhite = boardSize - 1;
		const firstRowBlack = 0;
		const lastRowBlack = boardSize/2 - 2;

		this.state.cellsDataContainer = [];
		this.state.actorsDataContainer = [];

		for (let x = 0; x < boardSize; x++) {
			
			this.state.cellsDataContainer[x] = []; 
			this.state.actorsDataContainer[x] = [];

            for (let y = 0; y < boardSize; y++) {

				let cellClass = (x + y) % 2 == 0 ? 'white' : 'black';			
				this.state.cellsDataContainer[x].push({positionX: x, positionY: y, className: cellClass});

				//let actor = null;

				if (cellClass == 'black') {

					let actorColor = null;

					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					if (actorColor) {

						let actorType = (mode == 'classic') ? 'сhecker' : 'dam';
						let actorClass = actorColor + ' ' + actorType;
						let isUserColor = (userColor == actorColor);
						this.state.actorsDataContainer[x].push({positionX: x, positionY: y, className: actorClass, isUserColor: isUserColor});
					}
					else {
						this.state.actorsDataContainer[x].push(null);
					}
				}
				else {
					this.state.actorsDataContainer[x].push(null);
				}
			}
		}
	}

	fillGrid() {
		console.log('fillGrid');
		//console.log(this.state.cellsDataContainer, this.state.actorsDataContainer);

		const grid = [];

		// уникальный ключ для каждой клетки
		let cellKey = 0;
		// уникальный ключ для каждой фигуры
		let actorKey = 0;	

		for (let y = 0; y < this.props.boardSize; y++) {
			
			const cells = [];

            for (let x = 0; x < this.props.boardSize; x++) {

				let actor = null;

				if (this.state.actorsDataContainer[x][y]) {
					actor = <Actor key={actorKey} className = {this.state.actorsDataContainer[x][y].className} isUserColor = {this.state.actorsDataContainer[x][y].isUserColor} positionX = {x} positionY = {y} drawSelectedCells = {this.drawSelectedCells}/>;
					actorKey++;
				}

				let cell = <Cell key={cellKey} className = {this.state.cellsDataContainer[x][y].className} actor = {actor}/>; 
				cells.push(cell);
				cellKey++;
			}
			
			const row = <tr>{cells}</tr>;
            grid.push(row);
		}

		return grid;
	}

	drawSelectedCells(positionX, positionY) {
		console.log('drawSelectedCells');

		var addSelectedClassname = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]) {
				const prevClassName = this.state.cellsDataContainer[x][y].className;
				this.state.cellsDataContainer[x][y].className = prevClassName + ' highlight-cell';
			}	
		}.bind(this);

		//!!! TODO - заглушка
		if (this.props.userColor == 'black') {
			addSelectedClassname(positionX - 1, positionY + 1);
			addSelectedClassname(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			addSelectedClassname(positionX - 1, positionY - 1);
			addSelectedClassname(positionX + 1, positionY - 1);
		}
		
		this.setState({});
	}

	componentWillMount() {
		this.fillGridData();
	}

	shouldComponentUpdate(nextProps, nextState) {

		//???????????
		if (nextProps.boardSize !== this.props.boardSize || nextProps.mode !== this.props.mode
			|| nextProps.userColor !== this.props.userColor
			|| nextState.cellsDataContainer !== this.state.cellsDataContainer) {

			return true;
		}
		else return true;
	}

	componentWillUpdate(nextProps) {
		//console.log('componentWillUpdate');

		if (nextProps.boardSize !== this.props.boardSize || nextProps.mode !== this.props.mode || nextProps.userColor !== this.props.userColor) {
			this.fillGridData(nextProps.boardSize, nextProps.mode, nextProps.userColor);
			//this.setState({});
		}	
	}

    render() {
		console.log('render board');

		const grid = this.fillGrid();
		console.log('grid', grid);

        return (
	
			<table className="board">
				{grid}
			</table>
        )
    }
}
