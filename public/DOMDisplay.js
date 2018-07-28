
const DOMDisplay = function(parent, game) {

    this.game = game;
    //this.chessboard = game.chessboard;
    this.wrap = null;
    this.panel = null;
    this.board = null; //??
    this.actorLayer = null;
    this.toolbar = null; //??
    this.infobar = null; //??
    this.tablo = null;

    this.wrap = document.createElement('div');
    this.wrap.className = 'wrap';
    parent.appendChild(this.wrap);

    this.toolbar = this.wrap.appendChild(this.drawToolbar());
    this.panel = this.wrap.appendChild(this.drawPanel());
    //this.toolbar.style.height = this.panel.style.width;   //??
    this.board = this.panel.appendChild(this.drawBoard());
    this.actorLayer = this.board.appendChild(this.drawActors());
    this.infobar = this.wrap.appendChild(this.drawInfobar());

    //---------------------------------------------------------------

    this.drawTool = function(note, type, attributes) {
        var toolNode = null;
        var node = null;

        if (note) {
            toolNode = document.createElement('div');
            toolNode.appendChild(document.createTextNode(note));
        } 

        if (type) {
            node = document.createElement(type);
            if (attributes) {
            for (var attr in attributes)
                if (attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
            }
            for (var i = 3; i < arguments.length; i++) {
                /*var child = arguments[i];
                var childNode = null;
                if (type == "select") {
                    childNode = document.createElement('option');
                    childNode.textContent = arguments[i];
                }
                else if (typeof child == "string")
                    childNode = document.createTextNode(child);
                else 
                    childNode = child;
                    node.appendChild(childNode);
                }*/

                var child = arguments[i];
                if (typeof child == "string")
                    child = document.createTextNode(child);
                node.appendChild(childNode);
            }
        }

        if (!toolNode) return node;
        else {
            if (node) toolNode.appendChild(node);
            return toolNode; 
        }
    };

    this.drawToolbar = function() {
        var toolbar = document.createElement('div');
        toolbar.className = 'bar';

        var form = toolbar.appendChild(document.createElement('form'));

        var whiteOption = this.drawTool(null, 'option', {value: 'white'}, 'белые');
        var blackOption = this.drawTool(null, 'option', {value: 'black'}, 'черные');
        form.appendChild(this.drawTool( 'Выберите цвет ваших фигур: ', 'select', {name: 'userColor'}, whiteOption, blackOption));

        form.appendChild(this.drawTool('Выберите размер доски: ', 'input', {name: 'boardSize', type: 'number', value: 8, min: 0, max: 20, step: 2}));

        var easyOption = this.drawTool(null, 'option', {value: 'easy'}, 'легкий');
        var mediumOption = this.drawTool(null, 'option', {value: 'medium'}, 'средний');
        var hardOption = this.drawTool(null, 'option', {value: 'hard'}, 'сложный');
        form.appendChild(this.drawTool('Выберите уровень сложности: ', 'select', {name: 'level'}, easyOption, mediumOption, hardOption));

        var classicOption = this.drawTool(null, 'option', {value: 'classic'}, 'классический');
        var damOption = this.drawTool(null, 'option', {value: 'dam'}, 'играть только дамками');
        form.appendChild(this.drawTool('Выберите режим игры: ', 'select', {name: 'mode'}, classicOption, damOption));
        
        form.appendChild(this.drawTool(null, 'button', {type: 'submit'}, 'Начать игру'));

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            for (var i = 0; i < form.elements.length; i++) {
                form.elements[i].disabled = true;

                if (form.elements[i].name) {
                    console.log(form.elements[i].name, form.elements[i].value);
                    this.game[form.elements[i].name] = form.elements[i].value;
                }
            }
        });

        return toolbar;
    }

    this.drawInfobar = function() {
        var infobar = document.createElement('div');
        infobar.className = 'bar';

        infobar.appendChild(this.drawTool('Сейчас ход: ' + (this.game.isUserTurn() ? 'ваш' : 'компьютера')));
        infobar.appendChild(this.drawTool('Прошло времени: ' + this.game.getGameTime()));
        infobar.appendChild(this.drawTool('Сделано ходов: ' + this.game.movesCount));  
        infobar.appendChild(this.drawTool('Белые фигуры на доске: ' + this.game.chessboard.whiteActorsCount)); 
        infobar.appendChild(this.drawTool('Черные фигуры на доске: ' + this.game.chessboard.blackActorsCount));  
        infobar.appendChild(this.drawTool('История ходов: ', 'textarea'));

        return infobar;
    }

    this.resetDisplay = function() {
        function getDefaultClassName(element) {
            var index = element.className.indexOf(' game-over');
            console.log(element.className.slice(0, index));
            return index !== -1 ? element.className.slice(0, index) : element.className;
        }

        console.log(this.panel.className);
        this.panel.className = getDefaultClassName(this.panel);
        console.log(this.panel.className);
        this.toolbar.className = getDefaultClassName(this.toolbar);
        this.infobar.className = getDefaultClassName(this.infobar);

        if (this.tablo)
            this.wrap.removeChild(this.tablo);

        var form = this.toolbar.querySelector('form'); //??
        for (var i = 0; i < form.elements.length; i++) {
            form.elements[i].disabled = false;
        }

        this.updateBoard();
    }

    this.drawGameOver = function() {
        this.panel.className += ' game-over';
        this.toolbar.className += ' game-over';
        this.infobar.className += ' game-over';

        var tablo = document.createElement('div');
        tablo.className = 'tablo';
        
        tablo.appendChild(this.drawTool('GAME OVER'));
        var isUserWin = this.game.userColor == 'white' ? (this.game.chessboard.whiteActorsCount !== 0 ? true : false) : (this.game.chessboard.blackActorsCount !== 0 ? true : false);
        tablo.appendChild(this.drawTool((isUserWin ? 'Вы выиграли!' : 'Вы проиграли!')));
        var score = this.game.userColor == 'white' ? (this.game.chessboard.whiteActorsCount + ' : ' + this.game.chessboard.blackActorsCount) : (this.game.chessboard.blackActorsCount + ' : ' + this.game.chessboard.whiteActorsCount);
        tablo.appendChild(this.drawTool('Со счетом ' + score));
        tablo.appendChild(this.drawTool('Количество ходов: ' + this.game.movesCount));
        tablo.appendChild(this.drawTool('Прошло времени: ' + this.game.getGameTime()));
        this.tablo = this.wrap.appendChild(tablo);

        var reset = function(event) {
            event.preventDefault();
            this.resetDisplay();
            removeEventListener('click', reset);
            removeEventListener('keydown', reset);
        }.bind(this);

        addEventListener('click', reset);
        addEventListener('keydown', reset); 
    }

    this.drawPanel = function() {
        var marks = {
            horizontal : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            vertical: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        };

        var panel = document.createElement('main');

        var drawMarks = function(marksMass, position) {
            for (var i = 0; i < this.game.chessboard.length; i++) {
                var mark = document.createElement("span");
                mark.className = 'mark';
                mark.textContent = marksMass[i];

                mark.className += ' ' + position;
                if (position == 'horizontal') {
                    mark.style.left = (9.5 * (i+1) - 1) + 'vmin';   //??
                }
                else if (position == 'vertical') {
                    mark.style.top = (9 * (this.game.chessboard.length - i) - 1.5) + 'vmin';   //??
                }
            
                panel.appendChild(mark);
            }
        }.bind(this);

        /*var drawBoard = function() {
            var board = document.createElement('table');
            board.className = 'board';        
            var y = 0;
            this.chessboard.grid.forEach(function(row) {
            var x = 0;
            var rowElt = document.createElement("tr");
            board.appendChild(rowElt);
            //rowElt.style.height = scale + "px";
            row.forEach(function(elt) {
                var cell = document.createElement('td');
                //cell.style.width = scale + "px";
                cell.className = 'cell ' + elt.color;
                cell.position = {
                    x: x,
                    y: y,
                }  
                rowElt.appendChild(cell);
                x++;
            });
            y++;
            });
        this.board = board;
        wrap.appendChild(this.board);
        }.bind(this);*/    

        drawMarks(marks.horizontal, 'horizontal');
        drawMarks(marks.vertical, 'vertical');   
        //drawBoard();        
        return panel;
    }

    this.drawBoard = function() {
        var board = document.createElement('table');
        board.className = 'board';

        var y = 0;
        this.game.chessboard.grid.forEach(function(row) {
            var x = 0;
            var rowElt = document.createElement("tr");
            board.appendChild(rowElt);
            //rowElt.style.height = scale + "px";
            row.forEach(function(elt) {
                var cell = document.createElement('td');
                //cell.style.width = scale + "px";
                cell.className = 'cell ' + elt.color;
                cell.position = {
                x: x,
                y: y,
                }  
                rowElt.appendChild(cell);
                x++;
            });
            y++;
        });

        return board;
    }

    this.drawActors = function() {   
        var wrap = document.createElement('div');

        this.game.chessboard.actors.forEach(function(actor) {
            var elt = document.createElement('div')
            elt.className = 'actor ' + actor.color;
            elt.actor = actor;
            if (actor instanceof Checker) elt.className += ' сhecker';
            else if (actor instanceof Dam) elt.className += ' dam';
        
            elt.style.left = (actor.position.x * 9.5) + "vmin";  //??
            elt.style.top = (actor.position.y * 9) + "vmin";   //??
            //console.log('actor.position for actor: ', actor);

            wrap.appendChild(elt);
        });

        return wrap;
    };

    this.updateBoard = function() {
        /*var cells = Array.prototype.slice.call(this.board.getElementsByClassName('cell'), 0);
        cells.forEach(function(cell) {
            cell.style.background = '';
        })*/

        //if (this.actorLayer)
        this.board.removeChild(this.actorLayer);  //нужно ли??
        this.panel.removeChild(this.board);  

        this.board = this.panel.appendChild(this.drawBoard());
        this.actorLayer = this.board.appendChild(this.drawActors());
    };

    this.drawUserFunctionality = function() {
        var cells = Array.prototype.slice.call(this.board.getElementsByClassName('cell'), 0);
        var actorElts = Array.prototype.slice.call(this.actorLayer.getElementsByClassName('actor'), 0);

        actorElts.forEach(function(elt) {

            if (elt.actor.color !== game.userColor) continue;
            var dirs = []; 

            var searchDirs = function(vector, dir) {
                var type = null;
                //var vector = elt.actor.position.plus(allDirections[dir]);
                var dirCell = cells.filter(function(cell) {
                return (cell.position.y == vector.y && cell.position.x == vector.x)  
                });

                if (dirCell.length) {
                var actorAtCell = actorElts.filter(function(actorElt) {
                    return (actorElt.actor.position.y == vector.y && actorElt.actor.position.x == vector.x);
                })
                //var color = actorAtCell.length ? actorAtCell[0].color : null;
                //console.log('actorAtCell: ', actorAtCell, vector, 'actorAtCell[0].color: ', color, 'elt.actor.color: ', elt.actor.color);
                if (!actorAtCell.length) {
                    type = 'move';
                    dirs.push({cell: dirCell[0], type: type, actorAtCell: null});
                    //console.log('vector: ', vector, 'allDirections[dir]: ', allDirections[dir]);
                    if (elt.actor instanceof Dam)
                    searchDirs(vector.plus(allDirections[dir]), dir);   // вторая рекурсия
                }
                else if (actorAtCell.length && actorAtCell[0].actor.color !== elt.actor.color) {
                    type = 'eat';
                    dirs.push({cell: dirCell[0], type: type, actorAtCell: actorAtCell[0]});
                }
                //console.log('dirCell: ', dirCell[0].position);
                }
            }

            elt.actor.directions.forEach(function(dir) {
                var vector = elt.actor.position.plus(allDirections[dir]);
                searchDirs(vector, dir);
            });

            function select(event) {
            //console.log('!!!-----select: ', elt.actor, 'dirs: ');
            elt.style.borderColor = 'orange';
            //console.log('event! ', dirCells);
            dirs.forEach(function(dir) {
                //console.log(dir.cell.position);
                dir.cell.style.background = 'orange';
            });
            }
        
            function deselect(event) {
            //console.log('!!!-----deselect: ', elt.actor, dirs);
            elt.style.borderColor = '';
            //console.log('event! ', dirCells);
            dirs.forEach(function(dir) {
                dir.cell.style.background = '';
            });
            }

            function chooseOrResetElt(event) {  
                if (event.which == 3) {
                    //console.log('!!!-----reset: ');
                    elt.removeEventListener('mousedown', chooseOrResetElt);
                    deselect();
                }
                else if (event.which == 1) {
                    console.log('!!!-----mousedown: ', elt.actor, dirs);
                    elt.removeEventListener("mouseout", deselect);
                    //addEventListener("mouseup", deselect); 

                    console.log("dirs: ", dirs, 'actor: ', elt.actor);
                    dirs.forEach(function(dir) {
                    //dir.cell.addEventListener('mouseup', deselect);

                    function turn(event) {
                        //console.log(event.target);
                        console.log('!!!-----mouseup: ', elt.actor, dir, dir.cell.position);
                        
                        //removeEventListener("mouseup", deselect); 
                        deselect();
                        console.log('!!!-----turn: ', elt.actor, dirs);
                        //console.log('mouseup dir: ', dir.cell.position, dir.type);  
                        console.log('game turn: ', 'actor: ', elt.actor, 'type: ', dir.type, 'vector: ', new Vector(dir.cell.position.x, dir.cell.position.y));       
                        game.turn({actor: elt.actor, type: dir.type, vector: new Vector(dir.cell.position.x, dir.cell.position.y)});  //??
                        //display.drawTurn();
                        display.animate();
                        
                        /*dirs.forEach(function(dir) {
                        console.log('dir.cell.removeEventListener: ', dir.cell, dir.cell.position);
                        if (!dir.actorAtCell)              
                            dir.cell.removeEventListener('mouseup', turn);   //??
                        else
                            dir.actorAtCell.removeEventListener('mouseup', turn);
                        })

                        actorElts.forEach(function(actElt) {
                        actElt.removeEventListener("mouseover", select);
                        actElt.removeEventListener("mouseout", deselect); 
                        actElt.removeEventListener('mousedown', chooseOrResetElt);
                        });*/
                    }

                    if (!dir.actorAtCell) {
                        dir.cell.addEventListener('mouseup', turn);
                        console.log('dir.cell.addEventListener: ', dir.cell, dir.cell.position);
                    }
                    else {
                        dir.actorAtCell.addEventListener('mouseup', turn);
                    console.log('dir.actorAtCell.addEventListener: ', dir.cell, dir.cell.position);
                    }
                    });
                }
            }

            elt.addEventListener("mouseover", select);

            elt.addEventListener("mouseout", deselect); 

            elt.addEventListener('mousedown', chooseOrResetElt);
        });      
    }

    this.animate = function() {
        this.updateBoard();

        setTimeout(function() {
            this.game.turn();
            this.updateBoard();

            if (this.game.endOfGame) { 
                this.drawGameOver();
            }
            else
                this.drawUserFunctionality();
        }, 1000);
    }
};

module.exports = DOMDisplay;