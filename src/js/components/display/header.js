
import React, { Component } from 'react';
import Quotebar from './quotebar';

export default class Header extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

    render() {
		console.log('render header');

        return (
			<Quotebar/>
        )
    }
}
