
import React, { Component } from 'react';

class Cell extends Component {

    constructor(props) {
		super(props);
		
		this.addUserFunctionality = this.addUserFunctionality.bind(this);
	}
	
	addUserFunctionality() {
		console.log('cell addUserFunctionality', this.ref);

		var chooseCellToMoveActor = function(event) {
			console.log('!!!chooseCellToMoveActor', this.props.positionX, this.props.positionY, this.ref);
			this.props.chooseCellToMoveActor(this.props.positionX, this.props.positionY);
		}.bind(this);

		if (this.ref) {
			this.ref.addEventListener('mouseup', chooseCellToMoveActor);
		}	
	}

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('cell shouldComponentUpdate');
		let getNewActor = false;

		//TODO
		if (!nextProps.actor && this.props.actor) getNewActor = true;

		if (nextProps.actor && this.props.actor) {

			if (nextProps.actor.props.className !== this.props.actor.props.className)
				getNewActor = true;
			else if (nextProps.actor.props.isUserColor && nextProps.actor.props.passive !== this.props.actor.props.passive)
				getNewActor = true;
		}
		return (nextProps.className !== this.props.className || getNewActor 
				|| nextProps.chooseCellToMoveActor);
		//return (nextProps.className !== this.props.className);
	}
	
	componentDidUpdate() {
		if (this.ref && this.props.chooseCellToMoveActor) {
			this.addUserFunctionality();
		}
	}

    render() {
		console.log('render cell', this.props.positionX, this.props.positionY, this.ref);
		const cellClass = 'cell ' + (this.props.className ? this.props.className : '');
        
		return (
			<td ref={elem => this.ref = elem} className={cellClass}>
				{this.props.actor ? this.props.actor : ''}
			</td>
		)
    }
}

class Actor extends Component {

    constructor(props) {
		super(props);
		
		this.state = {
			className: '',
		}

		this.select = this.select.bind(this);
		this.deselect = this.deselect.bind(this);
		this.chooseActorToMove = this.chooseActorToMove.bind(this);
		this.addUserFunctionality = this.addUserFunctionality.bind(this);
	}

	select(event) {
		console.log('select');
		this.props.drawSelectedCells(this.props.positionX, this.props.positionY);
		let newClassName = this.props.defaultClassName + ' highlight-actor';
		this.setState({className: newClassName});
	}

	deselect(event) {
		console.log('deselect');
		this.props.drawDeselectedCells(this.props.positionX, this.props.positionY);
		this.setState({className: this.props.defaultClassName});
	}

	chooseActorToMove(event) {
		//this.ref.removeEventListener('mouseover', this.select);
		//this.ref.removeEventListener("mouseout", this.deselect); 
		this.props.chooseActorToMove(this.props.positionX, this.props.positionY);
	}
	
	addUserFunctionality() {

		if (this.ref) {
			this.ref.addEventListener('mouseover', this.select);
			this.ref.addEventListener("mouseout", this.deselect); 
			this.ref.addEventListener('mousedown', this.chooseActorToMove);
		}
	}

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('actor shouldComponentUpdate');
		return (nextProps.className !== this.props.className || nextState.className !== this.state.className
				|| (this.props.isUserColor && nextProps.passive !== this.props.passive));		
	}

	componentWillMount() {
		this.state.className = this.props.className;
	}

	componentWillUpdate(nextProps) {
		if (nextProps.className !== this.props.className)
			this.state.className = nextProps.className;
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.passive && this.props.passive) {
			this.ref.removeEventListener('mouseover', this.select);
			this.ref.removeEventListener("mouseout", this.deselect); 
			this.ref.removeEventListener('mousedown', this.chooseActorToMove);
		}
		else if (prevProps.passive && !this.props.passive) {
			this.ref.addEventListener('mouseover', this.select);
			this.ref.addEventListener("mouseout", this.deselect); 
			this.ref.addEventListener('mousedown', this.chooseActorToMove);
		}
	}
	
	componentDidMount() {
		if (this.props.isUserColor)
			this.addUserFunctionality();
	}
    
    render() {
		console.log('render actor', this.props.positionX, this.props.positionY, this.ref);
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
			activeActorPosition: null,
		};

		this.fillGrid = this.fillGrid.bind(this);
		this.fillGridData = this.fillGridData.bind(this);
		this.drawSelectedCells = this.drawSelectedCells.bind(this);
		this.drawDeselectedCells = this.drawDeselectedCells.bind(this);
		this.chooseActorToMove = this.chooseActorToMove.bind(this);
		this.chooseCellToMoveActor = this.chooseCellToMoveActor.bind(this);
		this.turnIsDone = this.turnIsDone.bind(this);
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
				this.state.cellsDataContainer[x].push({
					//positionX: x, 
					//positionY: y, 
					defaultClassName: cellClass, 
					className: cellClass,
					chooseCellToMoveActor: null,
				});

				if (cellClass == 'black') {

					let actorColor = null;

					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					if (actorColor) {

						let actorType = (mode == 'classic') ? 'сhecker' : 'dam';
						let actorClass = actorColor + ' ' + actorType;
						let isUserColor = (userColor == actorColor);
						this.state.actorsDataContainer[x].push({
							//positionX: x, 
							//positionY: y, 
							defaultClassName: actorClass, 
							className: actorClass, 
							isUserColor: isUserColor,
							passive: false,
						});
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
					actor = <Actor 
								key={actorKey} 
								className = {this.state.actorsDataContainer[x][y].className} 
								defaultClassName = {this.state.actorsDataContainer[x][y].defaultClassName} 
								isUserColor = {this.state.actorsDataContainer[x][y].isUserColor} 
								positionX = {x} 
								positionY = {y} 
								drawSelectedCells = {this.drawSelectedCells}
								drawDeselectedCells = {this.drawDeselectedCells}
								chooseActorToMove = {this.chooseActorToMove}
								passive = {this.state.actorsDataContainer[x][y].passive}
							/>;
					actorKey++;

					this.state.cellsDataContainer[x][y].actor = {isUserColor: this.state.actorsDataContainer[x][y].isUserColor};
				}

				let cell = <Cell 
								key={cellKey} 
								className = {this.state.cellsDataContainer[x][y].className} 
								defaultClassName = {this.state.cellsDataContainer[x][y].defaultClassName} 
								positionX = {x} 
								positionY = {y} 
								actor = {actor}
								chooseCellToMoveActor = {this.state.cellsDataContainer[x][y].chooseCellToMoveActor}
							/>; 
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

		var assignSelectedClassname = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				&& (!this.state.cellsDataContainer[x][y].actor 
					|| (this.state.cellsDataContainer[x][y].actor && !this.state.cellsDataContainer[x][y].actor.isUserColor))) {
					
						this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName + ' highlight-cell';
			}	
		}.bind(this);

		//!!! TODO - заглушка
		if (this.props.userColor == 'black') {
			assignSelectedClassname(positionX - 1, positionY + 1);
			assignSelectedClassname(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignSelectedClassname(positionX - 1, positionY - 1);
			assignSelectedClassname(positionX + 1, positionY - 1);
		}
		
		this.setState({});
	}

	drawDeselectedCells(positionX, positionY) {
		console.log('drawDeselectedCells');

		var assignDeselectedClassname = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]) {
				this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName
			}	
		}.bind(this);

		//!!! TODO - заглушка
		if (this.props.userColor == 'black') {
			assignDeselectedClassname(positionX - 1, positionY + 1);
			assignDeselectedClassname(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignDeselectedClassname(positionX - 1, positionY - 1);
			assignDeselectedClassname(positionX + 1, positionY - 1);
		}
		
		this.setState({});
	}

	chooseActorToMove(positionX, positionY) {
		console.log('chooseActorToMove');

		var assignCellMethod = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				&& this.state.cellsDataContainer[x][y].className !== this.state.cellsDataContainer[x][y].defaultClassName) {
	
					this.state.cellsDataContainer[x][y].chooseCellToMoveActor = this.chooseCellToMoveActor;	
			}
		}.bind(this);

		//!!! TODO - заглушка
		if (this.props.userColor == 'black') {
			assignCellMethod(positionX - 1, positionY + 1);
			assignCellMethod(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignCellMethod(positionX - 1, positionY - 1);
			assignCellMethod(positionX + 1, positionY - 1);
		}

		for (let y = 0; y < this.props.boardSize; y++) {
			for (let x = 0; x < this.props.boardSize; x++) {
				if (this.state.actorsDataContainer[x][y])
					this.state.actorsDataContainer[x][y].passive = true;
			}
		}

		this.state.activeActorPosition = {
			positionX: positionX,
			positionY: positionY
		};

		this.setState({});
	}

	chooseCellToMoveActor(positionX, positionY) {

		console.log('chooseCellToMoveActor');

		let newPosition = {
			x: positionX,
			y: positionY
		};

		let currentPosition = {
			x: this.state.activeActorPosition.positionX,
			y: this.state.activeActorPosition.positionY
		};

		let movedActor = this.state.activeActorPosition; //TODO
		let eatenActor = this.state.actorsDataContainer[positionX][positionY];

		for (let y = 0; y < this.props.boardSize; y++) {
			for (let x = 0; x < this.props.boardSize; x++) {
				this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName;
				this.state.cellsDataContainer[x][y].chooseCellToMoveActor = null;

				if (this.state.actorsDataContainer[x][y]) {	
					this.state.actorsDataContainer[x][y].className = this.state.actorsDataContainer[x][y].defaultClassName;
					this.state.actorsDataContainer[x][y].passive = true;
				}
			}
		}

		this.state.actorsDataContainer[positionX][positionY] = this.state.actorsDataContainer[movedActor.positionX][movedActor.positionY];
		this.state.actorsDataContainer[movedActor.positionX][movedActor.positionY] = null;
		this.state.activeActorPosition = null;

		//this.setState({});  //из дисплея

		this.turnIsDone(currentPosition, newPosition, movedActor, eatenActor);
	}

	turnIsDone(currentPosition, newPosition, movedActor, eatenActor) {
		console.log('turnIsDone');
		this.props.userTurn(currentPosition, newPosition, movedActor, eatenActor);		
	}

	componentWillMount() {
		this.fillGridData();
	}

	shouldComponentUpdate(nextProps, nextState) {

		//TODO???????????
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
		}	
	}

	componentDidMount(){
		//addEventListener('click', function(event) {this.console.log('click', event, event.target)});
		//addEventListener('mouseup', function(event) {this.console.log('mouseup', event, event.target)});
		//addEventListener('mousedown', function(event) {this.console.log('mousedown', event, event.target)});
	}

    render() {
		console.log('------------------render board--------------------');

		const grid = this.fillGrid();
		//console.log('grid', grid);

        return (
	
			<table className="board">
				{grid}
			</table>
        )
    }
}
