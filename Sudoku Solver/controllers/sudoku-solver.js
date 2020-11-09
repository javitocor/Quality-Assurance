class SudokuSolver {
  generateBoard(values) {
    let board = [[], [], [], [], [], [], [], [], []]

    let boardRow = -1
    let i
    for (i = 0; i < values.length; i++) {
      if (i % 9 === 0) {
        boardRow = boardRow + 1
      }
      board[boardRow].push(values[i])
    }
    
    return board
  }

  rowsToNumbers(row) {
    let row2 = row.toLowerCase();
    if (row2 === "a") {
      return '1'
    }
    if (row2 === "b") {
      return '2'
    }
    if (row2 === "c") {
      return '3'
    }
    if (row2 === "d") {
      return '4'
    }
    if (row2 === "e") {
      return '5'
    }
    if (row2 === "f") {
      return '6'
    }
    if (row2 === "g") {
      return '7'
    }
    if (row2 === "h") {
      return '8'
    }
    if (row2 === "i") {
      return '9'
    }
  }

  validate(puzzleString) {
    let arr = puzzleString.split('')
    if (arr.length != 81) { return 'size' }
    if (/^[0-9.]*$/.test(puzzleString) == false) { return 'invalid' }
  }

  validateValue(value) {
    let number = parseInt(value, 10);
    if (number > 0 && number < 10) {
      return true
    }
    return false
  }

  validateCoord(coord) {
    let array = coord.split('');
    if (array.length != 2) { return false }
    if (/[A-Ia-i]/.test(array[0]) == false) { return false }
    if (/[1-9]/.test(array[1]) == false) { return false }
    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let board = this.generateBoard(puzzleString)
    for (let j = 0; j < 9; j++) {
      if (board[parseInt(row)-1][j] == value) {
        return false
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let board = this.generateBoard(puzzleString)
    for (let i = 0; i < 9; i++) {
      if (board[i][parseInt(column)-1] == value) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let board = this.generateBoard(puzzleString)
    let boxTopRow = parseInt(row / 3) * 3
    let boxLeftColumn = parseInt(column / 3) * 3
    
    let k
    let l
    for (k = boxTopRow; k < boxTopRow + 3; k++) {
      for (l = boxLeftColumn; l < boxLeftColumn + 3; l++) {
        if (board[k][l] == value) {
          return false
        }
      }
    }
    return true;
  }

  solveFromCell(board, row, col) {

    console.log('Attempting to solve row ' + (row + 1) + ', column ' + (col + 1))

    if (col === 9) {
      col = 0
      row++
    }
    if (row === 9) {
      return board
    }

    if (board[row][col] != '.') {
      return this.solveFromCell(board, row, col + 1)
    }

    let i
    for (i = 1; i < 10; i++) {
      let valueToPlace = i.toString()
      console.log('Trying with ' + valueToPlace)
      if (this.checkRegionPlacement(board, row, col, valueToPlace) && this.checkRowPlacement(board, row, col, valueToPlace) && this.checkColPlacement(board, row, col, valueToPlace)) {
        board[row][col] = valueToPlace
        if (this.solveFromCell(board, row, col + 1) != false) {
          return board
        } else {
          board[row][col] = '.'
        }
      }
    }

    return false
  }

  solve(puzzleString) {
    let board = this.generateBoard(puzzleString)
    let solution = this.solveFromCell(board, 0, 0)

    if (solution === false) {
      return false
    }

    let i
    let j
    let solutionString = ''
    for (i = 0; i < solution.length; i++) {
      for (j = 0; j < solution[i].length; j++) {
        solutionString += solution[i][j].toString()
      }
    }
    return solutionString;
  }
}

module.exports = SudokuSolver;

