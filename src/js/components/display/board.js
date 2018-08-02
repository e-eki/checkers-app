
import React, { Component } from 'react';

class Cell extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('cell shouldComponentUpdate', nextProps.className, this.props.className);
        return (nextProps.className !== this.props.className || nextProps.actor !== this.props.actor);
    }
    
    render() {
        console.log('render cell');
        
        return this.props.actor ? <td className={this.props.className}>{this.props.actor}</td> : <td className={this.props.className}/>;
    }
}

class Actor extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('actor shouldComponentUpdate');
        return (nextProps.className !== this.props.className);
    }
    
    render() {
        console.log('render actor');
        
        return <div className={this.props.className}></div>;
    }
}

export default class Board extends Component {

	constructor(props) {
		super(props);

		this.state = {
			cells: [],
			actors: [],
		};

		this.grid = [];

		this.fillGrid = this.fillGrid.bind(this);
	}

	fillGrid() {
		console.log('fillGrid');

		this.grid = [];
		this.state.cells = [];
		this.state.actors = [];

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

				let cellColor = (y + x) % 2 == 0 ? 'white' : 'black';
				let actor = null;

				if (cellColor == 'black') {

					let actorColor = null;

					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					if (actorColor) {
						let actorType = this.props.mode == 'classic' ? 'сhecker' : 'dam';
						actor = <Actor key={actorKey} className = {`actor ${actorColor + ' ' + actorType}`}/>;
						actor.position = {
							x: x,
							y: y,
						};
						this.state.actors.push(actor);
						actorKey++;
					}
				}
                
				let cell = <Cell key={cellKey} className = {`cell ${cellColor}`} actor = {actor}/>; 
							
				cell.position = {
					x: x,
					y: y,
				};
				this.state.cells.push(cell);
				cells.push(cell);
				cellKey++;
			}
			
			const row = <tr>{cells}</tr>;
            this.grid.push(row);
		}
	}

	drawUserFunctionality() {
		this.actors.forEach(function(actor){

		})
	}

	componentWillMount() {
		this.fillGrid();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.boardSize !== this.props.boardSize || nextProps.userColor !== this.props.userColor || nextProps.mode !== this.props.mode 
			|| nextState.cells !== this.state.cells || nextState.actors !== this.state.actors) {

				if (nextProps.boardSize !== this.props.boardSize) this.fillGrid();

				return true;
			}
	}

    render() {
		console.log('render board');

		//this.fillGrid();
		console.log(this.state.cells[0]);
		console.log(this.state.actors[1].position.x);

        return (
	
			<table className="board">
				{this.grid}
			</table>
        )
    }
}
