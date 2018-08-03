
import React, { Component } from 'react';

class Cell extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('cell shouldComponentUpdate');
		//return (nextProps.className !== this.props.className || nextProps.actor !== this.props.actor);

		return (nextProps.className !== this.props.className);
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
	}

	componentWillMount() {
		this.defaultClassName = 'actor ' + this.props.className;
		this.state.className = this.defaultClassName;
	}
	
	componentDidMount() {
		this.addUserFunctionality();
	}
    
    render() {
		console.log('render actor');
		//const actorClass = 'actor ' + (this.state.className ? this.state.className : '');
        
        return <div ref={elem => this.ref = elem} className={this.state.className}></div>;
    }
}

export default class Board extends Component {

	constructor(props) {
		super(props);

		this.grid = [];
		
		this.state = {
			mode: 'checker',
			cellsDataContainer: [],
		};

		this.fillGrid = this.fillGrid.bind(this);
		this.drawSelectedCells = this.drawSelectedCells.bind(this);
		this.fillGridData = this.fillGridData.bind(this);
	}

	fillGridData(boardSize = this.props.boardSize) {

		console.log('fillGridData');
		this.state.cellsDataContainer = [];

		for (let y = 0; y < boardSize; y++) {
			
			this.state.cellsDataContainer[y] = []; 

            for (let x = 0; x < boardSize; x++) {

				let cellClass = (y + x) % 2 == 0 ? 'white' : 'black';
				
				this.state.cellsDataContainer[y].push({positionX: x, positionY: y, className: cellClass});
			}
		}

		console.log(this.state.cellsDataContainer);
	}

	fillGrid() {
		console.log('fillGrid');

		this.grid = [];

		const firstRowWhite = this.props.boardSize/2 + 1;
		const lastRowWhite = this.props.boardSize;
		const firstRowBlack = 0;
		const lastRowBlack = this.props.boardSize/2 - 2;

		// уникальный ключ для каждой клетки
		let cellKey = 0;
		// уникальный ключ для каждой фигуры
		let actorKey = 0;	

		for (let y = 0; y < this.props.boardSize; y++) {
			
			const cells = [];

            for (let x = 0; x < this.props.boardSize; x++) {

				let cellClass = (y + x) % 2 == 0 ? 'white' : 'black';
				let actor = null;

				if (cellClass == 'black') {

					let actorColor = null;

					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					if (actorColor) {

						let actorType = this.props.mode == 'classic' ? 'сhecker' : 'dam';
						let actorClass = actorColor + ' ' + actorType;
						actor = <Actor key={actorKey} className = {actorClass} positionX = {x} positionY = {y} drawSelectedCells = {this.drawSelectedCells} userColor = {this.props.userColor}/>;
						
						actorKey++;
					}
				}

				let cell = <Cell key={cellKey} className = {this.state.cellsDataContainer[y][x].className} actor = {actor}/>; 
				cells.push(cell);
				cellKey++;
			}
			
			const row = <tr>{cells}</tr>;
            this.grid.push(row);
		}
	}

	drawSelectedCells(positionX, positionY) {
		console.log('draw-------');

		var addSelectedClassname = function(x, y) {
			const prevClassName = this.state.cellsDataContainer[y][x].className;

			this.state.cellsDataContainer[y][x].className = prevClassName + ' highlight-cell';
		}.bind(this);

		console.log(positionX, positionY);
		addSelectedClassname(positionX, positionY);
		addSelectedClassname(positionX, positionY);
		addSelectedClassname(positionX, positionY);
		
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
		//console.log(nextProps);

		if (nextProps.boardSize !== this.props.boardSize) {
			this.fillGridData(nextProps.boardSize);
		}	

		//else if (nexr)
	}

    render() {
		console.log('render board');

		this.fillGrid();
		//console.log(this.grid);

        return (
	
			<table className="board">
				{this.grid}
			</table>
        )
    }
}
