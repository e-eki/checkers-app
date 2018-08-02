
import React, { Component } from 'react';

export default class Board extends Component {

	constructor(props) {
		super(props);

		this.grid = [];
		this.fillGrid = this.fillGrid.bind(this);
	}

	fillGrid() {
		const grid = [];

		const firstRowWhite = this.props.boardSize/2 + 1;
		const lastRowWhite = this.props.boardSize;
		const firstRowBlack = 0;
		const lastRowBlack = this.props.boardSize/2 - 1;

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
						actor = <div className = {`actor ${actorColor + ' ' + actorType}`}></div>;
					}
				}
                
				let cell = actor ? <td className = {`cell ${cellColor}`}>{actor}</td> 
								: <td className = {`cell ${cellColor}`}></td>;
				cells.push(cell);
			}
			
			const row = <tr>{cells}</tr>;
            grid.push(row);
		}
		
		return grid;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps.boardSize !== this.props.boardSize || nextProps.userColor !== this.props.userColor ||
				nextProps.mode !== this.props.mode);
	}

    render() {
		console.log('render board');

		const grid = this.fillGrid();
		//console.log(grid);

        return (
	
			<table className="board">
				{grid}
			</table>
        )
    }
}
