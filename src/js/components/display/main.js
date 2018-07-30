
import React, { Component } from 'react';

export default class Main extends Component {

    render() {

        return (
          <div className = 'main'>
						
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
					</div>
        )
    }
}
