class Puissance4 {
    constructor(rows = 6, cols = 7) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array.from({ length: rows }, () => Array(cols).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.moves = [];
        this.init();
    }

    init() {
        this.renderBoard();
        this.addEventListeners();
        this.updateStatus();
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                if (this.board[row][col] !== 0) {
                    cell.dataset.player = this.board[row][col];
                }
                boardElement.appendChild(cell);
            }
        }
    }

    addEventListeners() {
        document.getElementById('board').addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('undo').addEventListener('click', () => this.undoMove());
        document.getElementById('reset').addEventListener('click', () => this.resetGame());
    }

    handleClick(event) {
        if (this.gameOver) return;
        const col = event.target.dataset.col;
        if (col !== undefined) {
            this.dropPiece(parseInt(col));
        }
    }

    dropPiece(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) {
                this.board[row][col] = this.currentPlayer;
                this.moves.push({ row, col });
                this.renderBoard();
                if (this.checkWin(row, col)) {
                    this.gameOver = true;
                    this.updateStatus(`Le joueur ${this.currentPlayer} a gagné !`);
                    return;
                }
                if (this.checkDraw()) {
                    this.gameOver = true;
                    this.updateStatus("Match nul !");
                    return;
                }
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                this.updateStatus();
                return;
            }
        }
    }

    checkWin(row, col) {
        const directions = [
            [1, 0], 
            [0, 1], 
            [1, 1], 
            [1, -1] 
        ];
        for (const [dx, dy] of directions) {
            let count = 1;
            for (let direction of [-1, 1]) {
                let x = row + dx * direction;
                let y = col + dy * direction;
                while (x >= 0 && x < this.rows && y >= 0 && y < this.cols && this.board[x][y] === this.currentPlayer) {
                    count++;
                    x += dx * direction;
                    y += dy * direction;
                }
            }
            if (count >= 4) return true;
        }
        return false;
    }

    checkDraw() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }

    undoMove() {
        if (this.moves.length === 0) return;
        const lastMove = this.moves.pop();
        this.board[lastMove.row][lastMove.col] = 0;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.renderBoard();
        this.updateStatus();
    }

    resetGame() {
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.moves = [];
        this.renderBoard();
        this.updateStatus();
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (message) {
            statusElement.textContent = message;
        } else {
            statusElement.textContent = `Tour du joueur ${this.currentPlayer}`;
        }
    }
}


const game = new Puissance4();