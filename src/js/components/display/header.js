
import React, { Component } from 'react';
import Quotebar from './quotebar';

export default class Header extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		
		return (nextProps.quotesSwitchedOff !== this.props.quotesSwitchedOff);
	}

    render() {
		console.log('render header');

        return (
			<div className = 'header'>
				<Quotebar quotesSwitchedOff = {this.props.quotesSwitchedOff}/>
			</div>
        )
    }
}
