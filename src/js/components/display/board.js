
import React, { Component } from 'react';

export default class Board extends Component {

    render() {

        return (
	
					<table className="board">
						<tr>
							<td className="cell white"></td>
							<td className="cell black"></td>
							<td className="cell white"></td>
							<td className="cell black"></td>
							<td className="cell white"></td>
							<td className="cell black"></td>
							<td className="cell white"></td>
							<td className="cell black"></td>
						</tr>
					</table>
        )
    }
}
