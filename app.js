import Board from './js/board.js'

//add board:
document.getElementById('addBoardButton').addEventListener('click', () => {
    addBoard();
});
function addBoard(){
    const row        = parseInt(document.getElementById('rowInput'       ).value);
    const column     = parseInt(document.getElementById('columnInput'    ).value);
    const width      = parseInt(document.getElementById('widthInput'     ).value);
    const height     = parseInt(document.getElementById('heightInput'    ).value);
    const difficulty = parseInt(document.getElementById('difficultyInput').value);

    if(row > 0 && column > 0 && width > 0 && height > 0){
        const playground = document.getElementById('playground');
        new Board(playground, row, column, width, height, difficulty);
    }
}
addBoard();

//form visibility in mobile:
document.getElementById('showFormButton').addEventListener('click', () => {
    const header = document.getElementById('Header');
    if(header.className === 'showForm')
        header.classList.remove('showForm');
    else
        header.classList.add('showForm');
});