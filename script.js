let moveDirection = ['ArrowRight', true];
let snakePositions = []; // positions 0 will be always the head of snake
let foodPositions = new Array();
let playing, score = 0;
let headMovement = {ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1]};

// called when the page is loaded and generates the grid
window.addEventListener('load', function() {
    for (let i = 0; i < 20; i++) {
        var currentLine = '<div class="row d-flex justify-content-center">';
        for (let j = 0; j < 30; j++) {
            let backgroundColor = 'background-color: #f8f8f8';
            if ((i + j) % 2 == 0) {
                backgroundColor = 'background-color: #eaeaea';
            }
            currentLine += '<div class="cell p-0" style="' + backgroundColor + '"id="' + i + '-' + j + '"></div>';
        }
        $('#wallsGrid').append(currentLine + '<div>');
    }
    generateBorders();

    snakePositions.push([10, 10]);
    $('#10-10').addClass('bg-dark');
    generateFood();
});

// add coresponding borders
function generateBorders() {
    for (let j = 0; j < 30; j++) {
        $('#0-' + j).addClass('border-top border-secondary border-3');
        $('#19-' + j).addClass('border-bottom border-secondary border-3');
    }
    for (let i = 0; i < 20; i++) {
        $('#' + i + '-0').addClass('border-start border-secondary border-3');
        $('#' + i + '-29').addClass('border-end border-secondary border-3');
    }
}

// call setInterval function(to start the game)
function startGame() {
    playing = setInterval(moveHead, 200);
    $('#gameController').prop('disabled', true);
}

// called when a key is down, I use it to change direction for snake
window.addEventListener('keydown', function(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        moveDirection = [event.key, false];
    }
});

// check if a cell is part or not of the snake. This check starts from startPosition and check the rest of the tail
function isOnSnake(checkPosition, startPosition) {
    for (let i = startPosition; i < snakePositions.length; i++) {
        if (snakePositions[i][0] == checkPosition[0] && snakePositions[i][1] == checkPosition[1]) {
            return true;
        }
    }
    return false;
}

// place food for snake in random and valid positions on the grid
function generateFood() {
    do {
        foodPositions[0] = Math.floor(Math.random() * 20);
        foodPositions[1] = Math.floor(Math.random() * 30);
    } while (isOnSnake(foodPositions, 0));
    $('#' + foodPositions[0] + '-' + foodPositions[1]).addClass('bg-danger');
    $('#textInformation').text('Score: ' + score);
}

// check if the game is over, out of the grid or hot himself
function gameOver(nextHead) {
    return (nextHead[0] < 0 || nextHead[1] < 0 || nextHead[0] >= 20 || nextHead[1] >= 30 || isOnSnake(nextHead, 1));
}

// check the head of the snake
function checkHead(nextHead) {
    if (gameOver(nextHead)) { // the head is out of the grid or is on his tail
        clearInterval(playing);
        $('#textInformation').text('Game Over!');
        $('#gameController').prop('disabled', false);
        $('#gameController').text('Replay!');
        $('#gameController').attr('onclick', 'window.location.reload();');
        return false;
    }
    else if (foodPositions[0] === nextHead[0] && foodPositions[1] === nextHead[1]) { // the head ate the food
        $('#' + foodPositions[0] + '-' + foodPositions[1]).removeClass('bg-danger');
        score += 5;
        generateFood();
        snakePositions.push([]);
    }
    snakePositions[0] = nextHead;
    return true;
}

// move the tail of the snake
function moveTail() {
    let snakeSize = snakePositions.length;
    $('#' + snakePositions[snakeSize - 1][0] + '-' + snakePositions[snakeSize - 1][1]).removeClass('bg-dark');
    for (let i = snakeSize - 1; i > 0; i--) {
        snakePositions[i][0] = snakePositions[i - 1][0];
        snakePositions[i][1] = snakePositions[i - 1][1];
    }
}

// move the head of the snake coresponding to it moveDirection
function moveHead() {
    moveTail();
    let nextHead = snakePositions[0];
    nextHead[0] += headMovement[moveDirection[0]][0];
    nextHead[1] += headMovement[moveDirection[0]][1];
    moveDirection[1] = true;
    if (checkHead(nextHead)) {
        $('#' + nextHead[0] + '-' + nextHead[1]).addClass('bg-dark');
    }
}
