
import React, { Component } from 'react';

export default class Main extends Component {

    render() {

        return (
          <div className = 'main'>

						<span class="mark horizontal" style="left: 8.5vmin;">A</span>
						<span class="mark horizontal" style="left: 18vmin;">B</span>
						<span class="mark horizontal" style="left: 27.5vmin;">C</span>
						<span class="mark horizontal" style="left: 37vmin;">D</span>
						<span class="mark horizontal" style="left: 46.5vmin;">E</span>
						<span class="mark horizontal" style="left: 56vmin;">F</span>
						<span class="mark horizontal" style="left: 65.5vmin;">G</span>
						<span class="mark horizontal" style="left: 75vmin;">H</span>
						<span class="mark vertical" style="top: 74.5vmin;">1</span>
						<span class="mark vertical" style="top: 65vmin;">2</span>
						<span class="mark vertical" style="top: 55.5vmin;">3</span>
						<span class="mark vertical" style="top: 46vmin;">4</span>
						<span class="mark vertical" style="top: 36.5vmin;">5</span>
						<span class="mark vertical" style="top: 27vmin;">6</span>
						<span class="mark vertical" style="top: 17.5vmin;">7</span>
						<span class="mark vertical" style="top: 8vmin;">8</span>
						
						<table class="board">
							<tr>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
							</tr>
							<tr>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
							</tr>
							<tr>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
							</tr>
							<tr>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
								<td class="cell black"></td>
								<td class="cell white"></td>
							</tr>
						</table>
					</div>
        )
    }
}
