
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
		let newClassName = this.props.defaultClassName + ' highlight-actor';
		this.setState({className: newClassName});
	}

	// событие отмены выделения актера при уходе курсора с него
	deselect(event) {
		
		//вызов у родителя метода отмены выделения клеток, на которые актер может совершить ход
		this.props.drawDeselectedCells(this.props.positionX, this.props.positionY);
		this.setState({className: this.props.defaultClassName});
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
		this.turnIsDone = this.turnIsDone.bind(this);
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
				let cellClass = (x + y) % 2 == 0 ? 'white' : 'black';			
				this.state.cellsDataContainer[x].push({
					//positionX: x, 
					//positionY: y, 
					defaultClassName: cellClass, // для сброса выделения юзером
					className: cellClass,
					// флаг, есть ли пользовательский функционал у клетки - вначале у всех клеток его нет
					passive: true, 
				});

				// актеры могут быть только на черных клетках
				if (cellClass == 'black') {

					let actorColor = null;
					// определяем цвет актера
					if (y >= firstRowWhite && y <= lastRowWhite) actorColor = 'white';
					else if (y >= firstRowBlack && y <= lastRowBlack) actorColor = 'black';

					// если есть цвет, есть актер на данной клетке
					if (actorColor) {

						// актер
						let actorType = (mode == 'classic') ? 'сhecker' : 'dam';
						let actorClass = actorColor + ' ' + actorType;
						let isUserColor = (userColor == actorColor);
						this.state.actorsDataContainer[x].push({
							//positionX: x, 
							//positionY: y, 
							defaultClassName: actorClass, // для сброса выделения юзером
							className: actorClass, 
							isUserColor: isUserColor,   // является ли данный актер фигурой юзера
							// флаг, есть ли пользовательский функционал у актера - у всех актеров юзера он есть, есть сейчас ход юзера
							// (passive = true, функционал отсутствует, passive = false, функционал есть)
							passive: !(isUserColor && isUserTurn),     
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

				// кладем актера в клетку
				let cell = <Cell 
								key={cellKey} 
								className = {this.state.cellsDataContainer[x][y].className} 
								defaultClassName = {this.state.cellsDataContainer[x][y].defaultClassName} 
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
		var assignSelectedClassname = function(x, y) {

			// если есть такая клетка
			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				// если на клетке есть актер, то он должен быть другого цвета
				&& (!this.state.cellsDataContainer[x][y].actor 
					|| (this.state.cellsDataContainer[x][y].actor && !this.state.cellsDataContainer[x][y].actor.isUserColor))) {
					
						// то выделяем клетку
						this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName + ' highlight-cell';
			}	
		}.bind(this);

		//!!! TODO - заглушка
		// выбор клеток, соответствующих возможным направлениям актера
		if (this.props.userColor == 'black') {
			assignSelectedClassname(positionX - 1, positionY + 1);
			assignSelectedClassname(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignSelectedClassname(positionX - 1, positionY - 1);
			assignSelectedClassname(positionX + 1, positionY - 1);
		}
		
		// перерисовка шахматной доски
		this.setState({});
	}

	// отрисовка отмены выделения клеток для актера на позиции (positionX, positionY)
	// (вызывается из актера при уходе курсора с него)
	drawDeselectedCells(positionX, positionY) {
		console.log('drawDeselectedCells');

		// сброс стиля клетки к стилю по умолчанию
		var assignDeselectedClassname = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]) {
				this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName
			}	
		}.bind(this);

		//!!! TODO - заглушка
		// выбор клеток, соответствующих возможным направлениям актера
		if (this.props.userColor == 'black') {
			assignDeselectedClassname(positionX - 1, positionY + 1);
			assignDeselectedClassname(positionX + 1, positionY + 1);
		}
		else if (this.props.userColor == 'white') {
			assignDeselectedClassname(positionX - 1, positionY - 1);
			assignDeselectedClassname(positionX + 1, positionY - 1);
		}
		
		// перерисовка шахматной доски
		this.setState({});
	}

	// отрисовка выбора актера для текущего хода
	// (вызывается из актера при клике по нему)
	chooseActorToMove(positionX, positionY) {
		console.log('chooseActorToMove');

		// добавление клетке пользовательского функционала
		// (чтобы при клике по клетке на нее делал ход выбранный актер)
		var assignCellMethod = function(x, y) {

			if (this.state.cellsDataContainer[x] && this.state.cellsDataContainer[x][y]
				// если стиль клетки не по умолчанию, она выделена и на нее можно сходить актером
				&& this.state.cellsDataContainer[x][y].className !== this.state.cellsDataContainer[x][y].defaultClassName) {
	
					// проставляем флаг, что клетка активна
					this.state.cellsDataContainer[x][y].passive = false;	
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

	// отрисовка хода текущего выбранного актера на клетку на позиции (newPositionX, newPositionY)
	chooseCellToMoveActor(newPositionX, newPositionY) {
		console.log('chooseCellToMoveActor');

		for (let y = 0; y < this.props.boardSize; y++) {
			for (let x = 0; x < this.props.boardSize; x++) {
				// сбрасываем выделение всех клеток
				this.state.cellsDataContainer[x][y].className = this.state.cellsDataContainer[x][y].defaultClassName;
				// удаляем пользовательский функционал у всех клеток
				this.state.cellsDataContainer[x][y].passive = true;

				/*if (this.state.actorsDataContainer[x][y]) {	
					this.state.actorsDataContainer[x][y].className = this.state.actorsDataContainer[x][y].defaultClassName;
				}*/
			}
		}

		// координаты текущего выбранного актера
		const currentPositionX = this.state.activeActorPosition.positionX;
		const currentPositionY = this.state.activeActorPosition.positionY;

		// сбрасываем выделение текущего актера
		this.state.actorsDataContainer[currentPositionX][currentPositionY].className = this.state.actorsDataContainer[currentPositionX][currentPositionY].defaultClassName;  
		//this.state.actorsDataContainer[currentPositionX][currentPositionY].passive = true;  
		// перемещаем данные актера в массиве данных на новую позицию
		this.state.actorsDataContainer[newPositionX][newPositionY] = this.state.actorsDataContainer[currentPositionX][currentPositionY];
		this.state.actorsDataContainer[currentPositionX][currentPositionY] = null;

		//this.setState({});  //из дисплея??

		this.turnIsDone(newPositionX, newPositionY);
	}

	// обработка и отправка данных о совершенном ходе пользователя в Display
	turnIsDone(newPositionX, newPositionY) {
		console.log('turnIsDone');

		let newPosition = {
			positionX: newPositionX,
			positionY: newPositionY
		};

		let currentPosition = {
			positionX: this.state.activeActorPosition.positionX,
			positionX: this.state.activeActorPosition.positionY
		};

		let movedActor = this.state.activeActorPosition; //TODO???
		let eatenActor = this.state.actorsDataContainer[newPositionX][newPositionY];

		// сбрасываем данные о текущем актере
		this.state.activeActorPosition = null;

		this.props.analyzeUserTurn(currentPosition, newPosition, movedActor, eatenActor);	
	}

	// заполнение начальных данных перед первым рендерингом
	componentWillMount() {
		this.fillGridData();
	}

	shouldComponentUpdate(nextProps, nextState) {

		//TODO???????????
		if (nextProps.boardSize !== this.props.boardSize || nextProps.mode !== this.props.mode
			|| nextProps.userColor !== this.props.userColor || nextProps.isUserTurn !== this.props.isUserTurn
			|| nextState.cellsDataContainer !== this.state.cellsDataContainer) {

			return true;
		}
		else return true;
	}

	// и заполнение начальных данных после смены настроек
	componentWillUpdate(nextProps) {
		//console.log('componentWillUpdate');

		if (nextProps.boardSize !== this.props.boardSize || nextProps.mode !== this.props.mode || nextProps.userColor !== this.props.userColor) {
			this.fillGridData(nextProps.boardSize, nextProps.mode, nextProps.userColor, nextProps.isUserTurn);
		}	
	}

    render() {
		console.log('------------------render board--------------------');

		const grid = this.drawGrid();

        return (
	
			<table className="board">
				{grid}
			</table>
        )
    }
}
