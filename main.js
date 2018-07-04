const board_size = 25;

let tile_size = 10;

function main() {
    const gameElement = document.getElementById('game');
    const context = gameElement.getContext('2d');
    let board = createArray([]);

    gameElement.onclick = function (event) {
        processClick(context, event.layerX, event.layerY);
    };

    function processClick(context, x, y) {
        let boardX = Math.floor(x / tile_size);
        let boardY = Math.floor(y / tile_size);

        board[boardX][boardY] = true;
        context.fillRect(boardX * tile_size, boardY * tile_size, tile_size, tile_size);
    }

    function createArray(previous) {
        let array = [];
        for (let i = 0; i < board_size; i++) {
            let inner = [];
            for (let j = 0; j < board_size; j++) {
                if (i in previous && j in previous[i]) {
                    inner.push(previous[i][j]);
                } else {
                    inner.push(false);
                }
            }
            array.push(inner);
        }
        return array;
    }

    function requestDraw() {
        simulate();
        draw(board, context);
        setTimeout(requestDraw, 1500);
    }


    function draw() {
        context.clearRect(0, 0, board_size * tile_size, board_size * tile_size);
        for (let i = 0; i < board_size; i++) {
            for (let j = 0; j < board_size; j++) {
                if (board[i][j]) {
                    context.fillStyle = 'black';
                    context.fillRect(i * tile_size, j * tile_size, tile_size, tile_size);
                }
            }
        }
    }

    function simulate() {
        const prevBoard = createArray(board);

        function countNeighbors(x, y) {
            const neighbors =
                [
                    x - 1, y - 1, x, y - 1, x + 1, y - 1,
                    x - 1, y, x + 1, y,
                    x - 1, y + 1, x, y + 1, x + 1, y + 1
                ];

            let count = 0;

            for (let i = 0; i < neighbors.length; i += 2) {
                if (neighbors[i] >= 0 && neighbors[i] < board_size && neighbors[i + 1] >= 0 && neighbors[i + 1] < board_size) {
                    if (prevBoard[neighbors[i]][neighbors[i + 1]] === true) {
                        count++;
                    }
                }
            }

            return count;
        }

        for (let i = 0; i < board_size; i++) {
            for (let j = 0; j < board_size; j++) {
                let neighbors = countNeighbors(i, j);

                if (board[i][j] === true) {
                    //Under population
                    if (neighbors < 2) {
                        board[i][j] = false;
                    }
                    //Over population
                    if (neighbors > 3) {
                        board[i][j] = false;
                    }
                } else {
                    //Reproduction
                    if (neighbors === 3) {
                        board[i][j] = true;
                    }
                }
            }
        }
    }

    requestDraw();
}

main();