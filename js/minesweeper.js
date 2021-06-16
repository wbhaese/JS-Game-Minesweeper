
var time = 0;
var difficulty;

var columns = rows = 9;
// var rows = 9;
var bombsNum = 10;
var gridXY = [];
var endGame = false;
var flagsPlanted = selectedTiles = 0;
var fistClick = false;
var loaded;

// start LOAD section
function startGame() {
    buildGrid();
    createBombs();
    setBombsAround();  
    showTotBombs();  
}

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        gridXY[y] = new Array();

        for (var x = 0; x < columns; x++) {
            
            gridXY[y][x] = 0;
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
    tile.addEventListener("mouseup", handleClick); // All Clicks
    tile.addEventListener("mouseup", smileyUp); // All Clicks
    tile.addEventListener("mousedown", smileyLimbo ); // All Clicks

    return tile;
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

const around = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
];

function setBombsAround(){
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            if(gridXY[r][c] != -1){
                for(let [key, v] of around){
                    var x = r + key;
                    var y = c + v;
                    if(gridXY[x] !== undefined && gridXY[x][y] === -1){
                        gridXY[r][c]++
                    }       
                }
            }
        }
    }
}

function showTotBombs(){
    document.getElementById('totBombs').innerHTML = 'Remaining Mines: ' + bombsNum;
}
//------------------
// End LOAD section
//------------------


// start TIME handle section
function startTimer() {
    timeValue = 0;
    clearInterval(loaded);

    loaded = setInterval(function(){
        onTimerTick();
    }, 1000);
}

function onTimerTick() { 
    if(endGame == true){
        return;
    }
    timeValue++;
    updateTimer();
}

function stopTimer(){
    document.getElementById('timer').innerHTML = '';
    fistClick = false;
    clearInterval(loaded);
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}
//------------------
// end TIME handle section
//------------------

//start click events
function handleClick(event) {
    analizeFirstClick();

    if(avoidClickEvent(event)){
        return;
    }

    var row = event.target.id.split('-')[0]
    var col = event.target.id.split('-')[1] 
    
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
        if(validateStringClass(event, 'hidden')){
            revealSquare(row, col, event);
        }
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
        if(validateStringClass(event, 'tile_')){
            showTilesAround(row, col, event);
        }
    }
    // Right Click
    else if (event.which === 3) {
        //remove or add the flag      
        if(validateStringClass(event, 'flag')){
            event.target.classList.remove("flag");
            event.target.classList.add("hidden");

            showFakeBombNum("remove");
        }else if(!validateStringClass(event, 'empty')){
            if((flagsPlanted + 1) > bombsNum){
                return;
            }

            event.target.classList.remove("hidden");
            event.target.classList.add("flag");
            
            showFakeBombNum("add");
        }       
    }
}

function analizeFirstClick(){
    if(!fistClick){
        fistClick = true;

        startTimer();
    }    
}

function revealSquare(row, col, event){
    if(isBomSquare(row, col)){
        gameOver(row, col);
        return;
    }else{
        countElements();

        var bombNum = gridXY[row][col];        
        event.target.classList.remove("hidden");
        
        if(bombNum !== 0){
            event.target.classList.add("tile_"+bombNum);
        }else{
            event.target.classList.add("empty");
            getAroundSquares(row, col);
        }
    }
}

//------------------
// end CLICK handle section
//------------------

function validateStringClass(event, string = "flag"){
    var result = false;
    if(event.target.className.includes(string)){
        result = true;
    }
    return result;
}

function countElements(){
    ++selectedTiles;

    var totTile = document.getElementsByClassName("tile").length;
    var totSelected = selectedTiles + bombsNum;

    if(totSelected >= totTile){
        showAllBombs();
        stopTimer();
        smileyLikeBoss();
        alert("You win!");
    }
}

function gameOver(row, col){
    // endGame = true; *************************!!!!!!!!!!!!!!!
    var lastSecond = document.getElementById("timer").textContent;
    smileyLoose();
    showAllBombs(row, col);
    stopTimer();
    alert("Game over! Your score: " + lastSecond);
    
}

function showAllBombs(thisRow = null, thisCol = null){
    gridXY.forEach(function(r, row){
        r.forEach(function(c, col){
            if(c == -1){
                var elem = document.getElementById(`${row+'-'+col}`);
                elem.classList.remove("hidden");
                elem.classList.add("mine");
            }            
        });
    });

    if(thisRow){
        var elem = document.getElementById(`${thisRow+'-'+thisCol}`);
        elem.classList.remove("mine");
        elem.classList.add("mine_hit");
    }

}

function showFakeBombNum(action){
    fakeTotBomb = 0;

    if(action == 'add'){
        ++flagsPlanted;
    }else{
        --flagsPlanted;
    }
    
    fakeTotBomb = bombsNum - flagsPlanted;
    document.getElementById('totBombs').innerHTML = 'Remaining Mines: ' + fakeTotBomb;

}

function showTilesAround(r, c){
    if(getTotFlagsAround(r, c) != gridXY[r][c]){
        return;
    }

    for(let [key, v] of around){
        var x = parseInt(r) + key;
        var y = parseInt(c) + v;

        if(gridXY[x] !== undefined && gridXY[x][y] !== undefined){
            var elem = document.getElementById(`${x+'-'+y}`);
            if(!elem.className.includes('flag')){
                elem.classList.remove("hidden");
                switch (gridXY[x][y]) {
                    case 0:
                        elem.classList.add("empty");
                        break;
                    case -1:
                        elem.classList.add("mine_hit");
                        gameOver(r, c);
                        break;
                    default:
                        elem.classList.add("tile_"+gridXY[x][y]);
                        break;
                }
            }
        }
    }
}

function getTotFlagsAround(r, c){
    var totFlagsAround = 0
    for(let [key, v] of around){
        var x = parseInt(r) + key;
        var y = parseInt(c) + v;

        if(gridXY[x] !== undefined && gridXY[x][y] !== undefined){
            var elem = document.getElementById(`${x+'-'+y}`);
            if(elem.className.includes('flag')){
                ++totFlagsAround;
            }
        }
    }  
    
    return totFlagsAround;
}

function getAroundSquares(row, col){
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            //  && (i != row || j != col)
            if (i >= 0 && i < rows && j >= 0 && j < columns) {
                var elem = document.getElementById(`${i+'-'+j}`);
                if(elem.className.includes('hidden')){
                    elem.classList.remove("hidden");
                    switch (gridXY[i][j]) {
                        case 0:
                            elem.classList.add("empty");
                            getAroundSquares(i,j)
                            break;
                        case -1:
                            break;
                        default:
                            elem.classList.add("tile_"+gridXY[i][j]);
                            break;
                    }
                }
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

function avoidClickEvent(event){
    if(
        validateStringClass(event, 'flag') 
        && event.which != 3
        || endGame
    ){
        return true;
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    difficulty = difficultySelector.selectedIndex;

    if(difficulty == 0){
        columns = 9;
        rows = 9;
        bombsNum = 10;
    }else if(difficulty == 1){
        rows = 16;
        columns = 16;
        bombsNum = 40;
    }else{
        rows = 30;
        columns = 16;
        bombsNum = 99; 
    }
}

//"change SMILEY" section
function getSmileyElement(){
    var smileyElement = document.getElementById("smiley");
    return smileyElement;
}

function setSmileyClass(classStr){
    var smiley = getSmileyElement();
    smiley.classList.add(classStr);    
}

function smileyDown() {
    var smiley = getSmileyElement();
    smiley.classList.remove("face_lose");
    setSmileyClass("face_down");
    stopTimer();

    endGame = false;
}

function smileyLoose() {
    setSmileyClass("face_lose");
}

function smileyUp() {
    var smiley = getSmileyElement();
    smiley.classList.remove("face_down");
    smiley.classList.remove("face_limbo");
    smiley.classList.remove("face_win");
}

function smileyLimbo() {
    setSmileyClass("face_limbo");
}

function smileyLikeBoss() {
    setSmileyClass("face_win");
}