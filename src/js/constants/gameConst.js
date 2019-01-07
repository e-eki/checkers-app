'use strict';

module.exports = {

	// результат игры - кто выиграл
	totalOfGame: {
		AI: {
			name: 'AI',
			value: 'ИИ',
		},
		user: {
			name: 'user',
			value: 'вы',
		},
		standoff: {
			name: 'standoff',
			value: 'ничья',
		}
	},
	
	// символы для разметки шахматной доски
	marksSymbols: {
		horizontal : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
		vertical: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
	},

	// цвет фигур
	userActorsColor: {
		white: {
			name: 'white',
			value:'белые', 
		},
		black: {
			name: 'black',
			value:'черные',
		},
	},

	// размер доски
	boardSize: {
		default: 8,
		min: 4,
		max: 14,
		step: 2,
	},

	// уровень сложности игры
	level: {
		easy: {
			name: 'easy',
			value: 'легкий',
		},
		medium: {
			name: 'medium',
			value: 'средний',
		},
		hard: {
			name: 'hard',
			value: 'сложный',
		},
		randomize: {
			name: 'randomize',
			value: 'randomize'
		}
	},

	// режим игры
	mode: {
		classic: {
			name: 'classic',
			value: 'классический',
		},
		dam: {
			name: 'dam',
			value: 'играть только дамками',
		}
	},
}