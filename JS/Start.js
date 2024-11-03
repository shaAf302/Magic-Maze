

class Start{
    constructor(){
        
        this.panel=document.getElementById('menu_panel');
        
       
        this.new_game=document.getElementById('new_game');
        this.new_game.addEventListener('click', this.start_new_game);
        this.show_Inst=document.getElementById('show_Inst');
        this.show_Inst.addEventListener('click', this.show_Instructions);
        
  
        
    }
//Starting new game
    start_new_game(){
        let Num_players = document.getElementById('noP');
       
        let Num_cards = document.getElementById('noC');
        if(Num_players.value < 1 || Num_players.value > 4){
            alert(` players should be between (1-4)`);
            return;
        }

        if(Num_cards.value < 1 || Num_cards.value > (24/Num_players.value)){
            alert(` for ${Num_players.value} players cards should be between (1-${Math.floor(24/Num_players.value)})`)
            return;
        }
        this.game = new Game(Num_players.value, Num_cards.value);
    }
     
//shows instruction
        
       
     
     

    show_Instructions(){
       
        let inst=document.getElementById('inst').style.display="block";
        document.getElementById('menu_panel').style.display="none";
        

        

    }
}



let application = new Start();