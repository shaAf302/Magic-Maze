class Board{
    constructor(parent){
        this.parent = parent;
        this.board = [];
        this.init_Layout();
    }

    getDirections(player){
        let starting_at = this.board[player.position.i][player.position.j];
        let out = this.Find_Route(starting_at, [starting_at]);
        return out;
    }


    Find_Route(start, ind){
        let i = start.position.i;
        let j = start.position.j;
        let neighbours = [];
        neighbours['upper'] = this.board[i-1][j];
        neighbours['lower'] = this.board[i+1][j];
        neighbours['left'] = this.board[i][j-1];
        neighbours['right'] = this.board[i][j+1];
        if(start.doors['up'] && neighbours['upper'].doors['down'] && !ind.includes(neighbours['upper'])){
            ind.push(neighbours['upper'])
            this.Find_Route(neighbours['upper'], ind);
        }
        if(start.doors['right'] && neighbours['right'].doors['left'] && !ind.includes(neighbours['right'])){
            ind.push(neighbours['right']);
            this.Find_Route(neighbours['right'], ind);
        }
        if(start.doors['left'] && neighbours['left'].doors['right'] && !ind.includes(neighbours['left'])){
            ind.push(neighbours['left']);
            this.Find_Route(neighbours['left'], ind);
        }
        if(start.doors['down'] && neighbours['lower'].doors['up'] && !ind.includes(neighbours['lower'])){
            ind.push(neighbours['lower']);
            this.Find_Route(neighbours['lower'], ind);
        }
        return ind;
    }

    init_Layout(){
        this.ui = document.createElement('div');
        this.ui.id = 'game_main';
        this.ui.classList.add('game_main');
        this.initCells();
        this.parent.appendChild(this.ui);
    }
    //placing fixed elements in places and rest randomly on board

    initCells(){
        this.elements = [];
        for(let i = 0; i < 13; i++){
            this.elements.push(Shapes[2]);
        }
        for(let i = 0; i < 15; i++){
            this.elements.push(Shapes[4]);
        }
        for(let i = 0; i < 6; i++){
            this.elements.push(Shapes[3]);
        }
        this.elements.sort( () => .5 - Math.random() );
        for(let i = 0; i < 9; i++){
            let line = []
            let row = document.createElement('div');
            row.id = 'row';
            row.classList.add('row');
            for(let j = 0; j < 9; j++){
                let type = Shapes[0];
                let fixed = false;
                let direction = null;
                if(((i == 0 || i == 8) && (j!=0 && j!=8 && j%2 == 0)) || ((i!=0 && i!=8) && (j == 0 || j == 8) && (i%2==0))){
                    type = Shapes[1];
                    if(i == 0){ direction = 'down'; }
                    if(i == 8){ direction = 'up'; }
                    if(i > 0 && i < 8){
                        if(j == 0){ direction = 'right'; }
                        if(j == 8){ direction = 'left'; }
                    }
                }
                else if(i>0 && i<8 && j>0 && j<8){
                    if((i%2 == 1 && j%2 == 1)){
                        fixed = true;
                        if((j == 1 || j == 7) && (i == 1 || i == 7)){
                            type = Shapes[4];
                        }
                        else{
                            type = Shapes[3];
                        }
                    }
                    else{
                        type = this.elements.pop();
                    }
                }
                line.push(new Cell(row,type,{'i': i,'j': j},fixed,direction));
            }
            this.ui.appendChild(row);
            this.board.push(line);
        }
    }

    getOverboardedCell(){
        return this.elements.pop();
    }

    getCells(type){
        let cells = []
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                if(this.board[i][j].type == type){
                   cells.push(this.board[i][j]);
                }
            }
        }
        return cells;
    }

    shift(event){
        let last_move = event.target.game.last_move;
        let arrow = event.target.current_arrow;
        let new_overboard_element = null;
        let old_overboard_element = event.target.overboard_element;
        if(last_move){
            if((last_move.direction == 'up' && arrow.direction == 'down') || (last_move.direction == 'down' && arrow.direction == 'up')){
                if(last_move.position.j == arrow.position.j){
                    return old_overboard_element;
                }
            }
            if((last_move.direction == 'left' && arrow.direction == 'right') || (last_move.direction == 'right' && arrow.direction == 'left')){
                if(last_move.position.i == arrow.position.i){
                    return old_overboard_element;
                }
            }
        }
        event.target.game.current_player.movedBoard = true;
        if(arrow.direction == 'right'){
            let row = arrow.position.i;      
            new_overboard_element = this.board[row][7];
            if(new_overboard_element.ui.innerHTML){
                this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
                this.board[row].splice(1,0,new_overboard_element);
                for(let i = 1; i < 8; i++){
                    if(this.board[row][i].treasure) { this.board[row][i].treasure.position.i = row; this.board[row][i].treasure.position.j = i; }
                    this.board[row][i].position.j = i;
                    this.board[row][i].position.i = row;
                }
                event.target.game.last_move = arrow;
                return old_overboard_element;
            }
            Cell.switch(new_overboard_element,old_overboard_element);
            this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
            this.board[row].splice(1,0,old_overboard_element);
            for(let i = 1; i < 8; i++){
                if(this.board[row][i].treasure) { this.board[row][i].treasure.position.i = row; this.board[row][i].treasure.position.j = i; }
                this.board[row][i].position.j = i;
                this.board[row][i].position.i = row;
            }
        }
        if(arrow.direction == 'left'){
            let row = arrow.position.i;      
            new_overboard_element = this.board[row][1];
            if(new_overboard_element.ui.innerHTML){
                this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
                this.board[row].splice(7,0,new_overboard_element);
                for(let i = 1; i < 8; i++){
                    if(this.board[row][i].treasure) { this.board[row][i].treasure.position.i = row; this.board[row][i].treasure.position.j = i; }
                    this.board[row][i].position.j = i;
                    this.board[row][i].position.i = row;
                }
                event.target.game.last_move = arrow;
                return old_overboard_element;
            }
            Cell.switch(new_overboard_element,old_overboard_element);
            this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
            this.board[row].splice(7,0,old_overboard_element);
            for(let i = 1; i < 8; i++){
                if(this.board[row][i].treasure) { this.board[row][i].treasure.position.i = row; this.board[row][i].treasure.position.j = i; }
                this.board[row][i].position.j = i;
                this.board[row][i].position.i = row;
            }
        }
        if(arrow.direction == 'down'){
            let column = arrow.position.j;      
            new_overboard_element = this.board[7][column];
            if(new_overboard_element.ui.innerHTML) {
                for(let i = 7; i > 0; i--){
                    if(this.board[i][column].treasure) { this.board[i][column].treasure.position.i = i; this.board[i][column].treasure.position.j = column; }
                    if(i != 1) this.board[i][column] = this.board[i-1][column];
                    if(i == 1) this.board[i][column] = new_overboard_element;
                    this.board[i][column].position.j = column;
                    this.board[i][column].position.i = i;
                }
                event.target.game.last_move = arrow;
                return old_overboard_element;
            }
            Cell.switch(new_overboard_element,old_overboard_element);
            for(let i = 7; i > 0; i--){
                if(this.board[i][column].treasure) { this.board[i][column].treasure.position.i = i; this.board[i][column].treasure.position.j = column; }
                if(i != 1) this.board[i][column] = this.board[i-1][column];
                if(i == 1) this.board[i][column] = old_overboard_element;
                this.board[i][column].position.j = column;
                this.board[i][column].position.i = i;
            }
        }
        if(arrow.direction == 'up'){
            let column = arrow.position.j;      
            new_overboard_element = this.board[1][column];
            if(new_overboard_element.ui.innerHTML){ 
                for(let i = 1; i < 8; i++){
                    if(this.board[i][column].treasure) { this.board[i][column].treasure.position.i = i; this.board[i][column].treasure.position.j = column; }
                    if(i != 7) this.board[i][column] = this.board[i+1][column];
                    if(i == 7) this.board[i][column] = new_overboard_element;
                    this.board[i][column].position.j = column;
                    this.board[i][column].position.i = i;
                }
                event.target.game.last_move = arrow;
                return old_overboard_element;
            }
            Cell.switch(new_overboard_element,old_overboard_element);
            for(let i = 1; i < 8; i++){
                if(this.board[i][column].treasure) { this.board[i][column].treasure.position.i = i; this.board[i][column].treasure.position.j = column; }
                if(i != 7) this.board[i][column] = this.board[i+1][column];
                if(i == 7) this.board[i][column] = old_overboard_element;
                this.board[i][column].position.j = column;
                this.board[i][column].position.i = i;
            }
        }
        event.target.game.last_move = arrow;
        return new_overboard_element;
    }

    updateUI(){
        this.ui.remove();
        this.ui = document.createElement('div');
        this.ui.id = 'game_main';
        this.ui.classList.add('game_main');
        this.appendCells()
        this.parent.appendChild(this.ui);
    }

    appendCells(){
        for(let i = 0; i < this.board.length; i++){
            let row = document.createElement('div');
            row.id = 'row';
            row.classList.add('row');
            for(let j = 0; j < this.board.length; j++){
                this.board[i][j].ui.style.boxShadow = null;
                row.appendChild(this.board[i][j].ui);
            }
            this.ui.appendChild(row);
        }
    }

    movePlayer(player, cell, target){
        player.position = cell.position;
        target.appendChild(player.ui);
        player.ui.remove();
        player.parent = target;
        player.init_UI();
        if(cell.treasure && player.Prize.includes(cell.treasure)){
            player.remove_Treasure();
        }
    }
}

class Cell{
    constructor(parent, type, position,fixed,direction){
        this.treasure = null;
        this.fixed = fixed;
        this.direction = direction;
        this.position = position;
        this.parent = parent;
        this.doors = []
        this.type = type;
        this.rotatedBy = 0;
        this.canBeClicked = false;
        this.generateDoors();
        this.initUI()
        if(this.position.i == -1 && this.position.j == -1) return;
        if(this.fixed){
            this.rotate_properly();
            return;
        }
        if(this.type != Shapes[0] && this.type != Shapes[1]){
            let rng = Math.floor(Math.random()*4);
            if(rng == 1){
                this.rotate90();
            }
            if(rng == 2){
                this.rotate180();
            }
            if(rng == 3){
                this.rotate270();
            }
        }
    }

    generateDoors(){
        if(this.type == Shapes[0] || this.type == Shapes[1]){
            this.setDoors(false,false,false,false);  
        }
        else if(this.type == Shapes[2]){
            this.setDoors(false,false,true,true);
        }
        else if(this.type == Shapes[3]){
            this.setDoors(true,false,true,true)
        }
        else if(this.type ==Shapes[4]){
            this.setDoors(false,true,false,true)
        }
    }

    setDoors(up,down,left,right){
        this.doors['up'] = up
        this.doors['down'] = down
        this.doors['left'] = left
        this.doors['right'] = right  
    }

    initUI(){
        this.ui = document.createElement('div');
        if(this.position.i != -1 && this.position.j != -1){
            this.ui.classList.add('cell');
            this.ui.id = 'cell';
        }
        else if(this.position.i == -1 &&this.position.j == -1){
            this.ui.classList.add('overboard_cell');
            this.ui.id = 'overboard_cell'
        } 
        this.addImage();
        this.parent.appendChild(this.ui);
    }

    static switchUIComp(cell1, cell2){
        let tmp = cell1.ui;
        cell1.ui = cell2.ui;
        cell2.ui = tmp;
    }

    addImage(){
        if(this.type == Shapes[1]){
            this.ui.classList.add('arrow')
            if(this.position.i == 8){
                this.ui.classList.add('rotate_180');
            }
            if(this.position.i < 8 && this.position.i > 0 && this.position.j == 0){
                this.ui.classList.add('rotate_270');
            }
            if(this.position.i < 8 && this.position.i > 0 && this.position.j == 8){
                this.ui.classList.add('rotate_90');
            }
            return;
        }
        switch(this.type){
            case Shapes[2]:
                this.ui.classList.add('straight');
                break;
            case Shapes[3]:
                this.ui.classList.add('tpiece');
                break;
            case Shapes[4]:
                this.ui.classList.add('bend');
                break;       
        }

    }

    rotate_properly(){
        if(this.type == Shapes[4]){
            if(this.position.i == 1 && this.position.j == 7){
                this.rotate90();
            }
            else if(this.position.i == 7 && this.position.j == 1){
                this.rotate270();
            }
            else if(this.position.i == 7 && this.position.j == 7){
                this.rotate180();
            }
        }
        if(this.type == Shapes[3]){
            if(this.position.i == 1){
                this.rotate180();
            }
            else if(this.position.i != 1 && this.position.i != 7){
                if(this.position.j == 1 || (this.position.i == 3 && this.position.j == 3)){
                    this.rotate90();
                }
                else if(this.position.j == 7 || (this.position.i == 5 && this.position.j == 5)){
                    this.rotate270();
                }
                else if((this.position.i == 3 && this.position.j == 5)){
                    this.rotate180();
                }
            }
        }
    }
    
    rotate90(){
        this.rotatedBy += 90;
        this.ui.classList.remove(`rotate_${(this.rotatedBy - 90)}`)
        if(this.rotatedBy >= 360) this.rotatedBy = this.rotatedBy%360
        this.ui.classList.add(`rotate_${(this.rotatedBy)}`)
        this.setDoors(this.doors['left'],this.doors['right'],this.doors['down'],this.doors['up']);
        
    }

    rotate180(){
        this.rotate90();
        this.rotate90();
    }

    rotate270(){
        this.rotate90();
        this.rotate90();
        this.rotate90();
    }

    setParent(parent){
        this.parent = parent;
    }

    setDoorsArray(doors){
        for(let i = 0; i < this.doors.length; i++){
            this.doors[i] = doors[i];
        }
    }

    setType(type){
        switch(type){
            case 'bend':
                this.type = Shapes[4];
                break;
            case 'tpiece':
                this.type = Shapes[3];
                break;
            case 'straight':
                this.type = Shapes[2];
                break;
        }
    }

    setRotatedBy(rb){
        this.rotatedBy = rb;
    }

    static switch(new_cell, old_cell){
        let old_parent = old_cell.parent;
        let new_parent = new_cell.parent;
        old_cell.setParent(new_parent);
        new_cell.setParent(old_parent);

        let old_doors = old_cell.doors;
        let new_doors = new_cell.doors;
        old_cell.setDoorsArray(new_doors);
        new_cell.setDoorsArray(old_doors);

        let new_type = new_cell.type;
        let old_type = old_cell.type;

        old_cell.ui.classList.add('cell');
        new_cell.ui.classList.remove('cell')
        old_cell.ui.classList.remove('overboard_cell');
        new_cell.ui.classList.add('overboard_cell');
        old_cell.ui.id = "cell";
        new_cell.ui.id = "overboard_cell";

        let new_rotatedBy = new_cell.rotatedBy;
        let old_rotatedBy = old_cell.rotatedBy;

        new_cell.ui.classList.remove(`rotate_${new_rotatedBy}`);
        new_cell.ui.classList.remove(`${new_type}`);
        old_cell.ui.classList.remove(`rotate_${old_rotatedBy}`);
        old_cell.ui.classList.remove(`${old_type}`);

        new_cell.ui.classList.add(`rotate_${new_cell.rotatedBy}`);
        new_cell.ui.classList.add(`${new_cell.type}`);
        old_cell.ui.classList.add(`rotate_${old_cell.rotatedBy}`);
        old_cell.ui.classList.add(`${old_cell.type}`);
        new_cell.ui.style = null;
        new_cell.position.i = -1;
        new_cell.position.j = -1;
    }
}