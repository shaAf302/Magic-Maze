class Player{
    constructor(player, color, position, parent, Prize){
        this.player = player;
        this.parent = parent;
        this.color = color;
        this.position = position;
        this.movedBoard = false;
        this.starting_position = position;
        this.Prize = []
        Prize.forEach((e)=> this.Prize.push(e));
        this.init_UI();
    }

    remove_Treasure(){
        this.Prize.forEach(t =>{
            if(t.position.i = this.position.i && t.position.j == this.position.j){
                this.Prize.splice(this.Prize.indexOf(t),1);
                t.ui.remove();
                return; 
            }
        })
    }

    init_UI(){
        this.ui = document.createElement('div');
        this.ui.classList.add('player');
        this.ui.name = 'player';
        this.ui.id = 'player';
        this.ui.style.backgroundColor = `rgb(${this.color.r},${this.color.g},${this.color.b})`;
        this.parent.appendChild(this.ui);
    }
    isBack(){
        return this.position.i == this.starting_position.i && this.position.j == this.starting_position.j;
    }
}

class Treasure{
    constructor(color, position, parent, isPickedUp){
        this.color = color;
        this.position = position;
        this.isPickedUp = isPickedUp;
        this.parent = parent;
        this.initUI();
    }
    initUI(){
        
        this.ui=document.createElement('img');
        this.ui.classList.add('treasure');
        
        this.ui.id = 'treasure';

        this.ui.src="././images/Treasure.png";
        this.ui.style.backgroundColor = `rgb(${this.color.r},${this.color.g},${this.color.b})`;

        this.parent.appendChild(this.ui);
    }
}
