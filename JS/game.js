
//Shapes in and around the board
const Shapes = ['none','arrow', 'straight', 'tpiece', 'bend'];

class Game{
    constructor(Num_players, Num_cards){
        this.panel = document.createElement('div')
        
        this.init_Game_Panel();
        this.init_Game(Num_players, Num_cards)
        this.init_Sidepanel();
        this.init_Listeners();
    }
//To change the Player turns 
    switch_Turn(){
        this.turn++;
        this.current_player = this.players[this.turn%this.Num_players];
        let overboard_elems = document.body.querySelectorAll('.show_overboard_box');
        overboard_elems[0].firstChild.innerHTML = `Current player:<br>${this.current_player.player}`;
        document.getElementById('treasure_amount').innerText = `${this.current_player.Prize.length} Treasure remaining!`; 
        overboard_elems[1].firstChild.style.backgroundColor = `rgb(${this.current_player.color.r},${this.current_player.color.g},${this.current_player.color.b})`;
        let player_can_move = this.board.getDirections(this.current_player);
        player_can_move.forEach(element => {
            this.Player_can_move(element.ui);
        });
    }
//starts the game
    init_Game(Num_players, Num_cards){
        this.Num_players = Num_players;
        this.Num_cards = Num_cards;
        this.players = []
        //players are represented by colors 
        let colors = [ {'r':184,'g':15,'b':10}, {'r':2,'g':105,'b':164}, {'r':236,'g':59,'b':131}, {'r':128,'g':0,'b':128} ]
        //corners to put bend pieces
        let corners = [{'i':1, 'j':1}, {'i':1, 'j':7}, {'i':7, 'j':1}, {'i':7, 'j':7}]
        corners.sort( () => .5 - Math.random() );
        let possible_treasure_positions = [];
        for(let i = 1; i< 8; i++){
            for(let j = 1;j < 8; j++){
                let is_corner = false;
                for(let k = 0; k < corners.length; k++){
                    if(corners[k].i == i && corners[k].j == j){
                        is_corner = true;
                        break;
                    }
                }
                if(!is_corner) possible_treasure_positions.push({'i':i,'j':j});
            }
        }
        possible_treasure_positions.sort( () => .5 - Math.random() );
        for(let i = 0; i < this.Num_players; i++){
            let position = corners.pop();
            let Prize = [];
            let color = colors[i];
            for(let j = 0; j < this.Num_cards; j++){
                let treasue_pos = possible_treasure_positions.pop();
                let treasure = new Treasure(color,treasue_pos,this.board.board[treasue_pos.i][treasue_pos.j].ui,false)
                Prize.push(treasure);
                this.board.board[treasue_pos.i][treasue_pos.j].treasure = treasure; 
            }
            this.players.push(new Player(`${i+1}.`, color, position, this.board.board[position.i][position.j].ui, Prize));
        }
        this.current_player = this.players[0];
        this.turn = 0;
        this.gameEnded = false;
        this.start_Turn()
    }

    start_Turn(){
        let player_can_move = this.board.getDirections(this.current_player);
        player_can_move.forEach(e => {
            this.Player_can_move(e.ui);
        });
    }
    //shows the possible path for a player to move
    Player_can_move(ui){
        ui.style.boxShadow = `inset 0px 0px 0px 2px rgb(${this.current_player.color.r},${this.current_player.color.g},${this.current_player.color.b})`
    }
//after the player has moved 
disable_move(ui){
        this.overboarded_cell.ui.boxShadow = null;
        ui.style.boxShadow = null;
    }
//dynamically creates game area (div) for the board
    init_Game_Panel(){
        document.body.removeChild(document.getElementById('menu_panel'));
        this.panel.classList.add('game_panel');
        this.panel.id = 'game_panel';
        
        this.init_Game_Board();
        document.body.appendChild(this.panel);
    }

//new Board class
    init_Game_Board(){
        this.board = new Board(this.panel);
    }

    init_Listeners(){
        let arrows = this.board.getCells(Shapes[1]);
        arrows.forEach(arrow =>{
            arrow.ui.addEventListener('click',(event) =>{
                if(!this.current_player.movedBoard){
                    arrow.ui.current_arrow = arrow;
                    arrow.ui.overboard_element = this.overboarded_cell;
                    arrow.ui.player = this.current_player;
                    arrow.ui.game = this;
                    this.overboarded_cell = this.board.shift(event);
                    this.updateUI();
                    this.overboarded_cell.canBeClicked = false;
                    let player_can_move = this.board.getDirections(this.current_player);
                    player_can_move.forEach(e => {
                        e.canBeClicked = true;
                        e.ui.game = this;
                        e.ui.wrapper = e;
                        e.ui.movable = player_can_move;
                        e.ui.moveFunction = this.move;
                        e.ui.addEventListener('click',this.move);
                        this.Player_can_move(e.ui);
                    });
                }
            });
        })
    }
    move(event){
        event.target.game.board.movePlayer(event.target.game.current_player,event.target.wrapper, event.target);
        event.target.movable.forEach(element =>{
            event.target.game.disable_move(element.ui);
            element.ui.removeEventListener('click',event.target.moveFunction);
            event.target.game.current_player.movedBoard = false;
        })
        if(event.target.game.current_player.Prize.length == 0 && event.target.game.current_player.isBack()) event.target.game.gameEnded = true;
        if(!event.target.game.gameEnded) event.target.game.switch_Turn();
        else{
            alert(`The player ${event.target.game.current_player.player} Wins`);
            
        }
    }
    updateUI(){
        this.board.updateUI();
        let overboard_old = this.overboard_panel;
        this.overboard_panel.remove();
        this.overboarded_cell.parent.appendChild(this.overboarded_cell.ui);
        this.panel.appendChild(overboard_old);
    }

    init_Sidepanel(){
        this.overboard_panel = document.createElement('div');
        this.overboard_panel.name = 'Side panel';
        this.overboard_panel.id = 'Side_panel';
        this.overboard_panel.classList.add('Side_panel');
        
        let top_part = document.createElement('div');
        top_part.id = 'overboard_Top';
        top_part.name = 'overboard_Top';
        top_part.classList.add('overboard_Top');

        let box = document.createElement('div');
        box.id = 'show_overboard_box';
        box.name = 'show_overboard_box';
        box.classList.add('show_overboard_box');
        this.overboarded_cell = new Cell(box,this.board.getOverboardedCell(),{'i': -1, 'j': -1},false,null);
        this.overboarded_cell.rotatedBy = 0;

        let overboard_subscript_box = document.createElement('div');
        overboard_subscript_box.id = 'show_overboard_box';
        overboard_subscript_box.name = 'show_overboard_box';
        overboard_subscript_box.classList.add('show_overboard_box');
        let overboard_subscript = document.createElement('h3');
        overboard_subscript.innerText = "Extra room"
        overboard_subscript.classList.add('overboard_subscript');
        overboard_subscript_box.appendChild(overboard_subscript);

        let overboard_current_player_box = document.createElement('div');
        overboard_current_player_box.id = 'show_overboard_box';
        overboard_current_player_box.name = 'show_overboard_box';
        overboard_current_player_box.classList.add('show_overboard_box');
        let overboard_show_player = document.createElement('div'); 
        overboard_show_player.classList.add('show_player');
        overboard_show_player.style.backgroundColor = `rgb(${this.current_player.color.r},${this.current_player.color.g},${this.current_player.color.b})`;
        overboard_current_player_box.appendChild(overboard_show_player)

        let show_player_subscript_box = document.createElement('div');
        show_player_subscript_box.id = 'show_overboard_box';
        show_player_subscript_box.name = 'show_overboard_box';
        show_player_subscript_box.classList.add('show_overboard_box');
        let show_player_subscript = document.createElement('h3');
        show_player_subscript.innerHTML = `Current player:<br>${this.current_player.player}`
        let treasure_amount_text = document.createElement('h6');
        show_player_subscript.classList.add('overboard_subscript');
        show_player_subscript_box.appendChild(show_player_subscript);
        treasure_amount_text.innerText = `${this.current_player.Prize.length} Treasure remaining!`;
        treasure_amount_text.classList.add('treasure_text');
        treasure_amount_text.id = 'treasure_amount';
        show_player_subscript_box.style.height = 'fit-content';
        show_player_subscript_box.appendChild(treasure_amount_text);
        top_part.appendChild(show_player_subscript_box);
        top_part.appendChild(overboard_current_player_box);
        top_part.appendChild(overboard_subscript_box);
        top_part.appendChild(box);
        this.overboard_panel.appendChild(top_part);
        
        let bottom_part = document.createElement('div');
        bottom_part.id = 'overboard_bottom';
        bottom_part.name = 'overboard_bottom';
        bottom_part.classList.add('overboard_bottom');
        let rotate_button = document.createElement('button'); 
        rotate_button.classList.add('btn')
        rotate_button.id = 'rotate_button';
        rotate_button.name = 'rotate_button';
        rotate_button.innerText = 'Rotate';
        this.restart_button = document.createElement('button'); 
        this.restart_button.classList.add('btn')
        this.restart_button.id = 'new_game_button';
        this.restart_button.name = 'new_game_button';
        this.restart_button.innerText = 'New Game';
        rotate_button.addEventListener('click', ()=> this.overboarded_cell.rotate90());
        this.restart_button.addEventListener('click', this.restart);
        bottom_part.appendChild(rotate_button);
        bottom_part.appendChild(this.restart_button);
        this.overboard_panel.appendChild(bottom_part);
        
        this.panel.appendChild(this.overboard_panel);
    }
//to restart and take back to Start page
    restart(){
        location.reload();
    }
}

