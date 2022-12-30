import Tile from './tile.js'

export default class Board{

    //constructor:
    constructor(parent, row, column, tileWidth, tileHeight, difficulty){

        //init attributes:
        this.row = row;
        this.column = column;
        this.totalTiles = row * column;
        this.difficulty = difficulty;
        this.id = this.calcID();

        //add to the dom:
        const dom = this.getDOM();
        parent.insertAdjacentHTML('beforeend', dom);

        //init elements:
        this.view = document.getElementById(this.id + '');
        this.tileContainer = this.view.querySelectorAll('#tileContainer')[0];
        this.touchSurface  = this.view.querySelectorAll('#touchSurface' )[0];
        this.closeButton   = this.view.querySelectorAll('#closeButton'  )[0];

        //set size:
        this.setTileContainerSize(tileWidth, tileHeight);

        //add tiles:
        this.addTiles(tileWidth, tileHeight);

        //mixTheBoard:
        this.mixTheBoard();

        //add listeners:
        this.addEvents();

        //focus:
        this.touchSurface.focus();

    }

    //calcID:
    calcID = () => {
        const id = Math.floor(1000 + Math.random() * 9000);
        if(document.getElementById(id + '') !== undefined)
            return id;
        return this.calcID();
    }

    //getDOM:
    getDOM = () => {
        return `
            <div class="Board" id="${this.id}">
                <header id="header">
                    <a id="title">Board ${this.row} x ${this.column}</a>
                    <input type="button" id="closeButton">
                </header>
                <div id="content">
                    <div id="tileWrapper">
                        <div id="tileContainer"></div>
                    </div>
                    <input type="button" id="touchSurface"/>
                </div>
            </div>
        `
    }

    //setTileContainerSize:
    setTileContainerSize = (tileWidth, tileHeight) => {
        const tileContainerWidth = this.column * tileWidth;
        const tileContainerHeight = this.row * tileHeight;
        this.tileContainer.style.width = (tileContainerWidth / 10) + 'rem';
        this.tileContainer.style.height = (tileContainerHeight / 10) + 'rem';
    }

    //addTiles:
    addTiles = (tileWidth, tileHeight) => {

        for(let i = 1; i <= this.totalTiles; i++){

            //find current row and column:
            const currentRow    = parseInt((i - 1) / this.column);
            const currentColumn = (i - 1) - (currentRow * this.column);

            //calculate position of tile:
            const tileLeft = currentColumn * tileWidth;
            const tileTop  = currentRow    * tileHeight;
            
            //add tile:
            const isLansTile = i === this.totalTiles;
            new Tile(this.tileContainer, i, tileWidth, tileHeight, tileTop, tileLeft, isLansTile);

        }
    }

    //mixTheBoard:
    mixTheBoard = () => {
        const directions = ['Up', 'Down', 'Left', 'Right'];
        for(let i = 0; i < (this.totalTiles * this.difficulty); i++){
            const rand = Math.floor(1 + Math.random() * 4);
            this.move(directions[rand-1]);
        }
    }

    //addEvents:
    addEvents = () => {
        this.touchSurface.addEventListener('keydown', e => {
            e.preventDefault();
            this.move(e.key.replace('Arrow', ''));
            this.checkForWining();
        });
        this.addEventToSwipe(this.touchSurface, direction => {
            this.move(direction);
            this.checkForWining();
        });
        this.closeButton.addEventListener('click', () => {
            this.view.style.display = 'none';
        });
    }

    //move
    move = direction => {

        //find blank tile:
        const blankTile = this.tileContainer.querySelectorAll(`[data-number='${this.totalTiles}']`)[0];
        const blankTileIndex = parseInt(blankTile.dataset.index);
        const blankTileCurrentRow = parseInt((blankTileIndex - 1 ) / this.column);
        const blankTileCurrentColumn = (blankTileIndex - 1) - (blankTileCurrentRow * this.column);

        //find destination tile:
        const destTileIndex = this.findDestinationTile(direction, blankTileIndex, blankTileCurrentRow, blankTileCurrentColumn);
        if(destTileIndex === -1) return;
        const destTile = this.tileContainer.querySelectorAll(`[data-index='${destTileIndex}']`)[0];

        // get tiles top and left:
        blankTile.setAttribute('data-index', destTileIndex);
        const blankTileTop  = blankTile.dataset.top;
        const blankTileLeft = blankTile.dataset.left;
        
        destTile.setAttribute('data-index', blankTileIndex);
        const destTileTop   = destTile.dataset.top;
        const destTileLeft  = destTile.dataset.left;

        //swap tiles:
        blankTile.style.top  = destTileTop;
        blankTile.style.left = destTileLeft;
        blankTile.setAttribute("data-top", destTileTop);
        blankTile.setAttribute("data-left", destTileLeft);
        
        destTile.style.top   = blankTileTop;
        destTile.style.left  = blankTileLeft;
        destTile.setAttribute("data-top", blankTileTop);
        destTile.setAttribute("data-left", blankTileLeft);

    }

    //findDestinationTile:
    findDestinationTile = (direction, blankTileIndex, blankTileCurrentRow, blankTileCurrentColumn) => {
        switch(direction){
            case 'Up':
                if(blankTileCurrentRow === this.row - 1) return -1;
                return (blankTileCurrentRow + 1 ) * this.column + (blankTileCurrentColumn + 1);
            case 'Down':
                if(blankTileCurrentRow === 0) return -1;
                return (blankTileCurrentRow - 1 ) * this.column + (blankTileCurrentColumn + 1);
            case 'Left':
                if(blankTileCurrentColumn === this.column - 1) return -1;
                return blankTileIndex + 1;
            case 'Right':
                if(blankTileCurrentColumn === 0) return -1;
                return blankTileIndex - 1;
        }
        return -1;
    }

    //checkForWining
    checkForWining = () => {
        const tilesList = this.tileContainer.querySelectorAll('.Tile');
        for(let tile of tilesList){
            const index = tile.dataset.index;
            const number = tile.dataset.number;
            if(number !== index)
                return;
        }
        setTimeout(() => {
            alert(`Congratulations!! You Win The Board ${this.row} x ${this.column} !!`);
        }, 400);
    }

    //addEventToSwipe:
    addEventToSwipe = (touchSurface, onSwipe) => {
        
        let swipeDetection = { startX: 0, startY: 0, endX: 0, endY: 0 };
        let minX = 30; //min x swipe for horizontal swipe
        let maxX = 30; //max x difference for vertical swipe
        let minY = 50; //min y swipe for vertical swipe
        let maxY = 60; //max y difference for horizontal swipe
        let direction = '';
        
        //events:
        touchSurface.addEventListener('touchstart', e => {
            let touch = e.touches[0];
            swipeDetection.startX = touch.screenX;
            swipeDetection.startY = touch.screenY;
        });
        touchSurface.addEventListener('touchmove', e => {
            e.preventDefault();
            let touch = e.touches[0];
            swipeDetection.endX = touch.screenX;
            swipeDetection.endY = touch.screenY;
        });
        touchSurface.addEventListener('touchend', e => {
            //horizontal detection:
            if(
                (((swipeDetection.endX - minX > swipeDetection.startX) || (swipeDetection.endX + minX < swipeDetection.startX)) &&
                 ((swipeDetection.endY < swipeDetection.startY + maxY) && (swipeDetection.startY > swipeDetection.endY - maxY)  &&
                  (swipeDetection.endX > 0)))){
                if(swipeDetection.endX > swipeDetection.startX)
                    direction = 'Right'; else direction = 'Left';
            }
            //vertical detection:
            else if(
                (((swipeDetection.endY - minY > swipeDetection.startY) || (swipeDetection.endY + minY < swipeDetection.startY)) &&
                 ((swipeDetection.endX < swipeDetection.startX + maxX) && (swipeDetection.startX > swipeDetection.endX - maxX)  &&
                  (swipeDetection.endY > 0)))){
                if(swipeDetection.endY > swipeDetection.startY)
                    direction = 'Down'; else direction = 'Up';
            }

            //run the callback:
            if(direction !== '')
                onSwipe(direction);
            swipeDetection = { startX: 0, startY: 0, endX: 0, endY: 0 };
            direction = '';;
        });
    }

}