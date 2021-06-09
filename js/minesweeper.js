
var time = 0;
var difficulty;

var columns = 10;
var rows = 10;
var bombsNum = 10;
var gridXY = [];
var endGame = false;

function startGame() {
    buildGrid();
    startTimer();
    createBombs();
    getBombsAround();
    
}

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            gridXY[y] = new Array(x).fill(0);

            tile = createTile(x,y);
            grid.appendChild(tile);
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";


}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    tile.setAttribute('id', `${y+'-'+x}`);
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handvarileClick ); // All Clicks

    return tile;
}

function startTimer() {
    timeValue = 0;
    window.clearInterval(onTimerTick);
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() { 
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function createBombs(){
    for (var i = 0; i < bombsNum;) {
        var randRow = Math.floor((Math.random() * rows));
        var randColumn = Math.floor((Math.random() * columns));

        if(gridXY[randRow][randColumn] == 0){
            gridXY[randRow][randColumn] = -1;
            i++
        }
    }
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handvarileClick(event) {
    avoidClick(event);
    var row = event.target.id.split('-')[0]
    var col = event.target.id.split('-')[1] 
    
    var element = document.getElementById(`${row+'-'+col}`);
    
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
        if(validateStringClass(event, 'hidden')){
            revealSquare(row, col, element);
        }
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
    }
    // Right Click
    else if (event.which === 3) {
        //remove or add the flag
        if(validateStringClass(event, 'flag')){
            element.classList.remove("flag");
            element.classList.add("hidden");
        }else{
            element.classList.remove("hidden");
            element.classList.add("flag");
        }       
    }
}

function revealSquare(row, col, element){
    if(isBomSquare(row, col)){
        alert("game over");
        showAllBombs(row, col);
        return;
    }else{
        var bombNum = gridXY[row][col];
        
        element.classList.remove("hidden");
        if(bombNum !== 0){
            element.classList.add("tile_"+bombNum);
        }
    }
}

function showAllBombs(thisRow, thisCol){
    gridXY.forEach(function(r, row){
        r.forEach(function(c, col){
            if(c == -1){
                var elem = document.getElementById(`${row+'-'+col}`);
                elem.classList.add("mine");
            }            
        });
    });

    var elem = document.getElementById(`${thisRow+'-'+thisCol}`);
    elem.classList.remove("mine");
    elem.classList.add("mine_hit");

}

function getBombsAround(){
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            if(gridXY[r-1] !== undefined){
                if(gridXY[r-1][c-1] == -1) gridXY[r][c]++;  
                if(gridXY[r-1][ c ] == -1) gridXY[r][c]++;  
                if(gridXY[r-1][c+1] == -1) gridXY[r][c]++;  
            }

            if(gridXY[r][c-1] == -1) gridXY[r][c]++;
            if(gridXY[r][c+1] == -1) gridXY[r][c]++;

            if(gridXY[r+1] !== undefined){
                if(gridXY[r+1][c-1] == -1) gridXY[r][c]++;  
                if(gridXY[r+1][ c ] == -1) gridXY[r][c]++;  
                if(gridXY[r+1][c+1] == -1) gridXY[r][c]++;  
            }
        }        
    }
    

}

function isBomSquare(row, col){
    var result = false;
    if(gridXY[row][col] === -1){
        result = true;
    }

    return result;
}

function validateStringClass(event, string = "flag"){
    var result = false;
    if(event.target.className.includes(string)){
        result = true;
    }

    return result;
}

function avoidClick(event){
    if(validateStringClass(event, 'flag') && event.which != 3){
        return false;
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    difficulty = difficultySelector.selectedIndex;

    if(difficulty == 1){
        columns = rows = 16;
        bombsNum = 40;
    }else{
        columns = 30;
        rows = 10;
        bombsNum = 99; 
    }
}

function confirmBombNum(){
    i = 0;
    gridXY.forEach(e => {
        e.forEach(f => {
            if(f == -1){
                ++i
            }
            
        });      
        
    });
    console.log(i)
}