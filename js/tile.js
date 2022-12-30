export default class Tile{

    //constructor:
    constructor(parent, number, width, height, top, left, isLansTile){

        //add to parent:
        const dom = this.getDOM(number, width, height, top, left, isLansTile);
        parent.insertAdjacentHTML('beforeend', dom);

    }

    //getTileDOM:
    getDOM(number, width, height, top, left, isLansTile){
        return `
            <span
                class="Tile${(isLansTile ? ' blankTile' : '')}"
                data-index="${number}"
                data-number="${number}"
                data-top="${top}px"
                data-left="${left}px"
                style="width: ${width/10}rem; height: ${height/10}rem; top: ${top/10}rem; left: ${left/10}rem">
            </span>
        `;
    }

}