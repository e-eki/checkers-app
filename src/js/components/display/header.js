
import React, { Component } from 'react';
import Quotebar from './quotebar';

export default class Header extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		// перерисовка не нужна, внутри цитаты перерисовываются сами
		return false;
	}

    render() {
		console.log('render header');

        return (
			<Quotebar/>
        )
    }
}
