'use strict';

export function getErrorResponseMessage(error) {
	debugger;
	if (error.response) error = error.response;

	if (!error.status) {
		error.status = 500;
	}

	let message;

	switch (error.status) {
		/*case 200:
		case 201:
		case 204:
			break;*/

		case 400: 
			message = 'Некорректные данные: ';
			break;

		case 401: 
			message = 'Ошибка авторизации: ';
			break;

		case 403: 
			message = 'Ошибка доступа: ';
			break;	

		case 404: 
			message = 'Ресурс не найден: ';
			break;	

		case 500: 
			message = 'Internal server error: ';
			break;	

		default:
			message = 'Internal server error: ';  //??
			break;	
	};

	if (error.data && error.data.message) {
		message += error.data.message;
	}
	else if (error.message) {
		message += error.message;
	}
	if (error.data && error.data.data && error.data.data.length) {
		const errorData = error.data.data;
		message += ': ';
		errorData.forEach(element => {
			if (typeof(element) === 'string') {
				message += element + ',';
			}
		});
	}

	return message;
}