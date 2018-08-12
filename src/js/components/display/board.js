
import React, { Component } from 'react';

// клетка шахматной доски
class Cell extends Component {

    constructor(props) {
		super(props);
		
		this.addUserFunctionality = this.addUserFunctionality.bind(this);
		this.removeUserFunctionality = this.removeUserFunctionality.bind(this);
		this.chooseCellToMoveActor = this.chooseCellToMoveActor.bind(this);
	}

	// событие выбора клетки для хода на нее текущего актера
	chooseCellToMoveActor(event) {
		console.log('chooseCellToMoveActor', this.props.positionX, this.props.positionY, this.ref);
		// вызов одноименного метода у родителя - доски
		this.props.chooseCellToMoveActor(this.props.positionX, this.props.positionY);
	}

	addUserFunctionality() {
		console.log('cell addUserFunctionality', this.ref);

		if (this.ref) {
			this.ref.addEventListener('mouseup', this.chooseCellToMoveActor);
		}	
	}

	removeUserFunctionality() {
		console.log('cell removeUserFunctionality', this.ref);

		if (this.ref) {
			this.ref.removeEventListener('mouseup', this.chooseCellToMoveActor);
		}	
	}

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('cell shouldComponentUpdate');

		// перерисовка клетки:
		return (
					// если у клетки сменился стиль - выделена/не выделена
					(nextProps.className !== this.props.className) ||
					// или клетка стала пассивной/активной
					(nextProps.passive !== this.props.passive) ||
					// или на клетке появился актер 
					(nextProps.actor && !this.props.actor) ||
					// или с клетки исчез актер 
					(!nextProps.actor && this.props.actor) ||
					// или если на клетке есть актер и
					(nextProps.actor && this.props.actor && 
						// либо у него изменился стиль - выделен/не выделен
						(nextProps.actor.props.className !== this.props.actor.props.className ||
							// либо актер стал пассивным/активным
							nextProps.actor.props.passive !== this.props.actor.props.passive))
				);
	}
	
	componentDidUpdate(prevProps) {
		// если клетка перестала быть активной, удаляем пользовательский функционал
		if (!prevProps.passive && this.props.passive) {
			this.removeUserFunctionality();
		}
		// если клетка стала активной, добавляем пользовательский функционал
		else if (prevProps.passive && !this.props.passive) {
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

// актер - фигура на шахматной доске
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
		this.removeUserFunctionality = this.removeUserFunctionality.bind(this);
	}

	// событие выделения актера при наведении на него курсора
	select(event) {
		
		//вызов у родителя метода выделения клеток, на которые актер может совершить ход
		this.props.drawSelectedCells(this.props.positionX, this.props.positionY);
	}

	// событие отмены выделения актера при уходе курсора с него
	deselect(event) {
		
		//вызов у родителя метода отмены выделения клеток, на которые актер может совершить ход
		this.props.drawDeselectedCells(this.props.positionX, this.props.positionY);
	}

	// событие выбора актера для текущего хода
	chooseActorToMove(event) {
		this.props.chooseActorToMove(this.props.positionX, this.props.positionY);
	}
	
	addUserFunctionality() {
		console.log('actor addUserFunctionality', this.ref);

		if (this.ref) {
			this.ref.addEventListener('mouseover', this.select);
			this.ref.addEventListener("mouseout", this.deselect); 
			this.ref.addEventListener('mousedown', this.chooseActorToMove);
		}
	}

	removeUserFunctionality() {
		console.log('actor removeUserFunctionality', this.ref);

		if (this.ref) {
			this.ref.removeEventListener('mouseover', this.select);
			this.ref.removeEventListener("mouseout", this.deselect); 
			this.ref.removeEventListener('mousedown', this.chooseActorToMove);
		}
	}

    shouldComponentUpdate(nextProps, nextState) {
		//console.log('actor shouldComponentUpdate');

		// перерисовка, если:
		return (
					// изменился стиль актера - выделен/не выделен
					nextProps.className !== this.props.className || 
					nextState.className !== this.state.className || 
					// актер стал пассивным/активным
					nextProps.passive !== this.props.passive
				);		
	}

	componentWillMount() {
		this.state.className = this.props.className;
	}

	componentWillUpdate(nextProps) {
		if (nextProps.className !== this.props.className)
			this.state.className = nextProps.className;
	}

	componentDidUpdate(prevProps) {
		// если актер цвета юзера и
		if (!this.props.isUserColor) return;

		// стал пассивным, то удаляем пользовательский функционал
		if (!prevProps.passive && this.props.passive) {
			this.removeUserFunctionality();
		}
		// стал активным, добавляем пользовательский функционал
		else if (prevProps.passive && !this.props.passive) {
			this.addUserFunctionality();
		}
	}
	
	componentDidMount() {
		//console.log('actor componentDidMount', this.props.positionX, this.props.positionY, this.ref);
		// в самом начале добавляем пользовательский функционал, если актер активный
		if (this.props.isUserColor && !this.props.passive)
			this.addUserFunctionality();
	}
    
    render() {
		console.log('render actor', this.props.positionX, this.props.positionY, this.ref);
		const actorClass = 'actor ' + (this.state.className ? this.state.className : '');
        
        return <div ref={elem => this.ref = elem} className={actorClass}></div>;
    }
}

// шахматная доска - визуальное представление
export default class Board extends Component {

	constructor(props) {
		super(props);

		this.marksSymbols = {
			horizontal : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
			vertical: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
		};

		this.marks = {
			horizontal: [],
			vertical: [],
		};
		
		this.state = {
			// массив данных о клетках
			cellsDataContainer: [],
			// массив данных о фигурах
			actorsDataContainer: [],
			// данные о фигуре, которой юзер делает текущий ход
			activeActorPosition: null,
		};

		this.drawGrid = this.drawGrid.bind(this);
		this.fillGridData = this.fillGridData.bind(this);
		this.drawSelectedCells = this.drawSelectedCells.bind(this);
		this.drawDeselectedCells = this.drawDeselectedCells.bind(this);
		this.chooseActorToMove = this.chooseActorToMove.bind(this);
		this.chooseCellToMoveActor = this.chooseCellToMoveActor.bind(this);
		this.doTurn = this.doTurn.bind(this);
		this.resetAllElements = this.resetAllElements.bind(this);
	}

	// заполнение массивов с данными о клетках поля и актерах (фигурах) на поле
	// (начальное положение актеров)
	fillGridData(boardSize = this.props.boardSize, mode = this.props.mode, userColor = this.props.userColor, isUserTurn = this.props.isUserTurn) {
		console.log('fillGridData', boardSize, mode, userColor, isUserTurn);

		// для расстановки белых и черных актеров на доске
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

				// клетка
				let cellColor = (x + y) % 2 == 0 ? 'white' : 'black';			
				this.state.cellsDataContainer[x].push({
					//defaultClassName: cellClass, // для сброса выделения юзером
					//className: cellClass,
					color: cellColor,
					defaultColor: cellColor,
					// флаг, есть ли пользовательский функционал у клетки - вначале у всех клеток его нет
					passive: true, 
				});

				// актеры могут быть только на черных клетках
				if (cellColor == 'black') {

					let actorColor = null;
					// определяем цвет актера
					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					// если есть цвет, есть актер на данной клетке
					if (actorColor) {

						// актер
						let actorType = (mode == 'classic') ? 'сhecker' : 'dam';
						//let actorClass = actorColor + ' ' + actorType;
						let isUserColor = (userColor == actorColor);
						this.state.actorsDataContainer[x].push({
							//defaultClassName: actorClass, // для сброса выделения юзером
							//className: actorClass, 
							color: actorColor,
							defaultColor: actorColor,
							type: actorType,
							isUserColor: isUserColor,   // является ли данный актер фигурой юзера
							// флаг, есть ли пользовательский функционал - вначале у всех актеров его нет
							// (passive = true, функционал отсутствует, passive = false, функционал есть)
							passive: true,    
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

	drawMarks(boardSize = this.props.boardSize) {

		this.marks.horizontal = [];
		this.marks.vertical = [];
		
		for (var i = 0; i < boardSize; i++) {

			this.marks.horizontal.push(<span>{this.marksSymbols.horizontal[i]}</span>);
			this.marks.vertical.push(<span>{this.marksSymbols.vertical[i]}</span>);
		}
	}

	// отрисовка шахматной доски на основе данных из this.state.cellsDataContainer и this.state.actorssDataContainer
	// (позиции клеток и актеров соответствуют их положению в массиве)
	drawGrid() {
		console.log('fillGrid');
		const grid = [];

		// уникальный ключ для каждой клетки
		let cellKey = 0;
		// уникальный ключ для каждой фигуры
		let actorKey = 0;	

		for (let y = 0; y < this.props.boardSize; y++) {		
			const cells = [];

            for (let x = 0; x < this.props.boardSize; x++) {
				// смотрим, есть ли актер на данной клетке
				let actor = null;

				if (this.state.actorsDataContainer[x][y]) {
					const actorClassName = this.state.actorsDataContainer[x][y].color + ' ' + this.state.actorsDataContainer[x][y].type;
					const defaultActorClassName = this.state.actorsDataContainer[x][y].defaultColor + ' ' + this.state.actorsDataContainer[x][y].type;

					actor = <Actor 
								key={actorKey} 
								//className = {this.state.actorsDataContainer[x][y].className} 
								//defaultClassName = {this.state.actorsDataContainer[x][y].defaultClassName} 
								className = {actorClassName} 
								defaultClassName = {defaultActorClassName} 
								isUserColor = {this.state.actorsDataContainer[x][y].isUserColor} 
								positionX = {x} 
								positionY = {y} 
								drawSelectedCells = {this.drawSelectedCells}
								drawDeselectedCells = {this.drawDeselectedCells}
								chooseActorToMove = {this.chooseActorToMove}
								passive = {this.state.actorsDataContainer[x][y].passive}
							/>;
					actorKey++;

					//TODO ??
					//this.state.cellsDataContainer[x][y].actor = {isUserColor: this.state.actorsDataContainer[x][y].isUserColor};
				}

				// кладем актера в клетку
				let cell = <Cell 
								key={cellKey} 
								className = {this.state.cellsDataContainer[x][y].color} 
								defaultClassName = {this.state.cellsDataContainer[x][y].defaultColor} 
								positionX = {x} 
								positionY = {y} 
								actor = {actor}
								chooseCellToMoveActor = {this.chooseCellToMoveActor}
								passive = {this.state.cellsDataContainer[x][y].passive}
							/>; 
				cells.push(cell);
				cellKey++;
			}			
			const row = <tr>{cells}</tr>;
            grid.push(row);
		}

		return grid;
	}

	// отрисовка выделенных клеток, куда актер на позиции (positionX, positionY) может сделать ход
	// (вызывается из актера при наведении мыши на него)
	drawSelectedCells(positionX, positionY) {
		console.log('drawSelectedCells');

		// добавление клетке стиля выделения
		var assignSelectedColor = function(x, y) {

			// если есть такая клетка
			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				// если на клетке есть актер, то он должен быть другого цвета
				&& (!this.state.actorsDataContainer[x][y]
					|| (this.state.actorsDataContainer[x][y] && !this.state.actorsDataContainer[x][y].isUserColor))) {
					
						// то выделяем клетку
						this.state.cellsDataContainer[x][y].color = this.state.cellsDataContainer[x][y].defaultColor + ' highlight-cell';
			}	
		}.bind(this);

		this.state.actorsDataContainer[positionX][positionY].color = this.state.actorsDataContainer[positionX][positionY].defaultColor + ' highlight-actor';

		//!!! TODO - заглушка
		// выбор клеток, соответствующих возможным направлениям актера
		if (this.props.userColor == 'black') {
			assignSelectedColor(positionX - 1, positionY + 1);
			assignSelectedColor(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignSelectedColor(positionX - 1, positionY - 1);
			assignSelectedColor(positionX + 1, positionY - 1);
		}

		// перерисовка шахматной доски
		this.setState({});
	}

	// отрисовка отмены выделения клеток для актера на позиции (positionX, positionY)
	// (вызывается из актера при уходе курсора с него)
	drawDeselectedCells(positionX, positionY) {
		console.log('drawDeselectedCells');

		// сброс стиля клетки к стилю по умолчанию
		var assignDeselectedColor = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]) {
				this.state.cellsDataContainer[x][y].color = this.state.cellsDataContainer[x][y].defaultColor
			}	
		}.bind(this);

		this.state.actorsDataContainer[positionX][positionY].color = this.state.actorsDataContainer[positionX][positionY].defaultColor;

		//!!! TODO - заглушка
		// выбор клеток, соответствующих возможным направлениям актера
		if (this.props.userColor == 'black') {
			assignDeselectedColor(positionX - 1, positionY + 1);
			assignDeselectedColor(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignDeselectedColor(positionX - 1, positionY - 1);
			assignDeselectedColor(positionX + 1, positionY - 1);
		}
		
		// перерисовка шахматной доски
		this.setState({});
	}

	// отрисовка выбора актера для текущего хода
	// (вызывается из актера при клике по нему)
	chooseActorToMove(positionX, positionY) {
		console.log('chooseActorToMove', positionX, positionY);

		let actorCanMove = false;

		// добавление клетке пользовательского функционала
		// (чтобы при клике по клетке на нее делал ход выбранный актер)
		var assignCellMethod = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				// если стиль клетки не по умолчанию, она выделена и на нее можно сходить актером
				&& this.state.cellsDataContainer[x][y].color !== this.state.cellsDataContainer[x][y].defaultColor) {
	
					// проставляем флаг, что клетка активна
					this.state.cellsDataContainer[x][y].passive = false;	
					actorCanMove = true;
			}
		}.bind(this);

		//!!! TODO - заглушка
		// выбор клеток, соответствующих возможным направлениям актера
		if (this.props.userColor == 'black') {
			assignCellMethod(positionX - 1, positionY + 1);
			assignCellMethod(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignCellMethod(positionX - 1, positionY - 1);
			assignCellMethod(positionX + 1, positionY - 1);
		}

		if (!actorCanMove) return;

		// после того, как на одном из актеров сделан клик, сходить можно только им,
		// и возможность выбора (пользовательский функционал) всех актеров удаляется
		for (let y = 0; y < this.props.boardSize; y++) {
			for (let x = 0; x < this.props.boardSize; x++) {
				if (this.state.actorsDataContainer[x][y])
					this.state.actorsDataContainer[x][y].passive = true;
			}
		}

		// добавляем данные о текущем актере
		this.state.activeActorPosition = {
			positionX: positionX,
			positionY: positionY
		};

		// перерисовка доски
		this.setState({});
	}

	resetAllElements() {

		for (let y = 0; y < this.props.boardSize; y++) {
			for (let x = 0; x < this.props.boardSize; x++) {
				// сбрасываем выделение всех клеток
				this.state.cellsDataContainer[x][y].color = this.state.cellsDataContainer[x][y].defaultColor;
				// удаляем пользовательский функционал у всех клеток
				this.state.cellsDataContainer[x][y].passive = true;

				if (this.state.actorsDataContainer[x][y]) {
					this.state.actorsDataContainer[x][y].passive = true;
					this.state.actorsDataContainer[x][y].color = this.state.actorsDataContainer[x][y].defaultColor;
				}	
			}
		}
	}

	// отрисовка хода текущего выбранного актера на клетку (newPositionX, newPositionY)
	chooseCellToMoveActor(newPositionX, newPositionY) {
		console.log('chooseCellToMoveActor');

		this.resetAllElements();

		const currentPosition = {
			positionX: this.state.activeActorPosition.positionX,
			positionY: this.state.activeActorPosition.positionY
		};

		const newPosition = {
			positionX: newPositionX,
			positionY: newPositionY
		};

		this.doTurn(currentPosition, newPosition);
	}

	doTurn(currentPosition, newPosition) {
		console.log('doTurn');

		let currentActorData = this.state.actorsDataContainer[currentPosition.positionX][currentPosition.positionY];

		let actor = {
			isUserColor: currentActorData.isUserColor,
			type: currentActorData.type,
		};

		let newActorData = this.state.actorsDataContainer[newPosition.positionX][newPosition.positionY];

		let eatenActor = null;
		if (newActorData) {
			eatenActor = {
				isUserColor: newActorData.isUserColor,
				type: newActorData.type,
			}
		}

		let turnedToDam = false;

		// перемещаем данные актера в массиве данных на новую позицию
		this.state.actorsDataContainer[newPosition.positionX][newPosition.positionY] = this.state.actorsDataContainer[currentPosition.positionX][currentPosition.positionY];
		this.state.actorsDataContainer[currentPosition.positionX][currentPosition.positionY] = null;

		// сбрасываем данные о текущем актере
		this.state.activeActorPosition = null;

		if (this.props.isUserTurn) {
			this.props.userTurnIsDone(currentPosition, newPosition, actor, eatenActor, turnedToDam);	
		}
		else {
			this.props.AITurnIsDone();
		}
	}

	// заполнение начальных данных перед первым рендерингом
	componentWillMount() {
		this.fillGridData();
		this.drawMarks();
	}

	// и заполнение начальных данных после смены настроек
	componentWillUpdate(nextProps) {
		//console.log('componentWillUpdate');

		// если изменились настройки или после завершения игры - обновление данных по умолчанию
		if (nextProps.boardSize !== this.props.boardSize || 
			nextProps.mode !== this.props.mode || 
			nextProps.userColor !== this.props.userColor ||
			(!nextProps.endOfGame && this.props.endOfGame)) {
				this.fillGridData(nextProps.boardSize, nextProps.mode, nextProps.userColor, nextProps.isUserTurn);
				this.drawMarks(nextProps.boardSize);
		}
			
		if (nextProps.startOfGame && nextProps.isUserTurn && !this.props.isUserTurn) {

			for (let y = 0; y < this.props.boardSize; y++) {
				for (let x = 0; x < this.props.boardSize; x++) {
	
					if (this.state.actorsDataContainer[x][y] && this.state.actorsDataContainer[x][y].isUserColor) {
						this.state.actorsDataContainer[x][y].passive = false;
					}
				}
			}
		}

		if (nextProps.endOfGame && !this.props.endOfGame) {

			this.resetAllElements();
		}

		// TODO ??? !nextProps.isUserTurn
		if (!nextProps.isUserTurn && this.props.isUserTurn && nextProps.currentAITurn) {

			//TODO!
			setTimeout(function() {
				console.log('AI turn!');
				this.doTurn(nextProps.currentAITurn.currentPosition, nextProps.currentAITurn.newPosition);
			}.bind(this), 2000);
		}
	}

    render() {
		console.log('------------------render board--------------------');

		const grid = this.drawGrid();

        return (
	
			<div className = 'main'>
				<div className = 'marks-container'>
					<div className = 'marks marks_horizontal marks_top'>
						{this.marks.horizontal}
					</div>

					<div className = 'marks marks_horizontal marks_bottom'>
						{this.marks.horizontal}
					</div>

					<div className = 'marks marks_vertical marks_left'>
						{this.marks.vertical}
					</div>

					<div className = 'marks marks_vertical marks_right'>
						{this.marks.vertical}
					</div>
					
				</div>
				<table className ="board">
					{grid}
				</table>
			</div>
        )
    }
}
