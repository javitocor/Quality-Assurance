'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coord = req.body.coordinate;
      const value = req.body.value;
      if(!puzzle || !coord || !value) {
        res.json({ error: 'Required field(s) missing' })
      }
      if (solver.validate(puzzle) === 'invalid') {
        res.json({ error: 'Invalid characters in puzzle' })
      } else if (solver.validate(puzzle) === 'size') {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      } 
      if(solver.validateValue(value) == false) {
        res.json({ error: 'Invalid value' })
      }
      if(solver.validateCoord(coord) == false) {
        res.json({ error: 'Invalid coordinate'})
      }
      let row = solver.rowsToNumbers(coord[0]);
      let column = coord[1];
      if(solver.checkRowPlacement(puzzle, row, column, value) && solver.checkColPlacement(puzzle, row, column, value) && solver.checkRegionPlacement(puzzle, row, column, value)) {res.json({valid: true})}
      let conflict = [];
      if(solver.checkRowPlacement(puzzle, row, column, value)==false) {conflict.push('row')}
      if(solver.checkColPlacement(puzzle, row, column, value)==false) {conflict.push('col')}
      if(solver.checkRegionPlacement(puzzle, row, column, value)==false) {conflict.push('region')}
      res.json({valid: false, conflict: conflict})
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        res.json({ error: 'Required field missing' });
      }
      if (solver.validate(puzzle) === 'invalid') {
        res.json({ error: 'Invalid characters in puzzle' })
      } else if (solver.validate(puzzle) === 'size') {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      const solution = solver.solve(puzzle);
      if(solution==false){
        res.json({ error: 'Puzzle cannot be solved' });
      } else {
        res.json({solution});
      }      
    });
};
