const simulation_time = 1000; //Max simulation time in ms

function main() {
    const gameElement = document.getElementById('game');
    const context = gameElement.getContext('2d');

    let board_size = 25;
    let tile_size = 10;
    let speed = 1;

    let board = createArray([]);
    let status = 'paused';
    let iteration = 0;

    (function () {
        let heldDown = false;
        gameElement.onmousedown = () => heldDown = true;
        gameElement.onmouseup = () => heldDown = false;
        gameElement.onmousemove = (e) => {
            heldDown && processClick(context, e.layerX, e.layerY)
        };
        gameElement.onclick = (e) => {
            processClick(context, e.layerX, e.layerY)
        }
    })();

    document.getElementById('pause').onclick = () => {
        status = 'paused';
        document.getElementById('pause').disabled = true;
        document.getElementById('start').disabled = false;
    };
    document.getElementById('start').onclick = () => {
        status = 'playing';
        document.getElementById('pause').disabled = false;
        document.getElementById('start').disabled = true;
    };
    document.getElementById('speed').oninput = () => {
        let val = document.getElementById('speed').value;
        speed = val;
        document.getElementById('speedValue').innerHTML = val;
        simulation_speed = simulation_time / speed;
    };
    document.getElementById('size').oninput = () => {
        let val = document.getElementById('size').value;
        board = createArray(board, val);
        board_size = val;
        document.getElementById('sizeValue').innerHTML = val;
    };

    document.getElementById('size').onchange = handleSizing;

    function processClick(context, x, y) {
        let boardX = Math.floor(x / tile_size);
        let boardY = Math.floor(y / tile_size);

        console.log(board);
        console.log(boardX);
        console.log(boardY);
        board[boardX][boardY] = true;
    }

    function createArray(previous, size) {
        let bSize = size || board_size;
        let array = [];
        for (let i = 0; i < bSize; i++) {
            let inner = [];
            for (let j = 0; j < bSize; j++) {
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

    function requestDraw(timestamp) {
        handleSizing();
        draw(board, context);
        requestAnimationFrame(requestDraw);

        if (status === 'playing') {
            if (lastSimulate + simulation_speed <= timestamp) {
                lastSimulate = timestamp;
                simulate()
            }
            nextFrame.value = (timestamp - lastSimulate) / simulation_speed * 100;
        }
    }

    let lastSimulate = 0;
    let simulation_speed = simulation_time / speed;
    let nextFrame = document.getElementById("nextFrame");

    function handleSizing() {
        gameElement.width = board_size * tile_size;
        gameElement.height = board_size * tile_size;
    }

    function draw() {
        context.clearRect(0, 0, board_size * tile_size, board_size * tile_size);
        for (let i = 0; i < board_size; i++) {
            for (let j = 0; j < board_size; j++) {
                if (board[i][j]) {
                    context.fillStyle = 'black';
                    context.fillRect(i * tile_size, j * tile_size, tile_size, tile_size);
                }
                context.strokeStyle = '#D6D8D8';
                context.strokeRect(i * tile_size, j * tile_size, tile_size, tile_size);
            }
        }
        document.getElementById('iteration').innerHTML = iteration.toLocaleString();
    }

    function simulate() {
        iteration++;
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