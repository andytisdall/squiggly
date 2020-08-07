class Squig {

  constructor(gridSize) {
    this.position = 0
    this.gridSize = gridSize;
    this.moveList = [];
    this.move = this.move.bind(this);
    this.blackout = this.blackout.bind(this);
  }

  move() {
//    console.log(this);
    //render starting position
    const ID = this.position.join('-');
    if (this.moveList.length > 0) {
      const lastPosition = this.moveList[this.moveList.length-1];
//      console.log(lastPosition);
      const lastID = lastPosition.join('-');
      switchColor(lastID);
    }
    leadColor(ID);
    this.moveList.push(this.position);
//    console.log(position);
    //find surrounding spaces
    const [x, y] = this.position;
    let spaces = [
      [x, y+1],
      [x+1, y],
      [x, y-1],
      [x-1, y]
    ];
    //evaluate how many of the four surrounding spaces are open
    spaces = spaces.filter(space => {
      let taken = 0;
      this.moveList.forEach(move => {
        if (space[0] === move[0] && space[1] === move[1]) taken++;
      });
      return taken === 0;
    });
//    console.log(spaces);
    spaces = spaces.filter(coor => !(coor[0] > this.gridSize-1) && !(coor[1] > this.gridSize-1) && coor[0] >= 0 && coor[1] >= 0);
//    console.log(spaces);
    if (spaces.length > 0) {
      const choice = this.rand(spaces.length);
      this.position = spaces[choice];
    } else {
//      clearInterval(this.repeater);
//      ending(this);
      if (this.moveList.length === (this.gridSize * this.gridSize)) {
        clearInterval(this.repeater);
        console.log('function ended')
        return -1;
      }
      let taken = -1;
      while (taken === -1) {
        taken = this.startingPosition();
      }
      this.position = taken;
    }
  }

  rand(choice) {
    return Math.floor(Math.random() * choice);
  }

  startingPosition() {
    const xCoor = this.rand(this.gridSize);
    const yCoor = this.rand(this.gridSize);
    let newList = this.moveList.filter(space => space[0] === xCoor && space[1] === yCoor);
    if (newList.length === 0) {
      return [xCoor, yCoor];
    } else {
      return -1;
    }
  }

  go() {
    this.position = this.startingPosition()
    this.repeater = setInterval(this.move, this.speed);
  }

  test() {
    console.log('wtf');
    console.log(this.position);
  }

//  blackoutGrid() {
//    let spaces = [];
//    for (i=0; i<this.gridSize; i++) {
//      for (a=0; a<this.gridSize; a++) {
//        spaces.push([i,a]);
//     }
//    }
//    return spaces;
//  }

  taken(x, y) {
    let newList = this.moveList.filter(space => space[0] === x && space[1] === y);
    return newList.length > 0;
  }

  blackout() {
    const xCoor = this.rand(this.gridSize);
    const yCoor = this.rand(this.gridSize);
    if (!this.taken(xCoor, yCoor)) {
      this.position = [xCoor, yCoor];
      const ID = this.position.join('-');
      switchColor(ID);
      this.moveList.push(this.position);
      if (this.moveList.length === (this.gridSize * this.gridSize)) {
        clearInterval(this.repeater);
        console.log('end');
      }
    }
  }
};

const games = [['snake', 'Squiggly Snake'], ['blackout', 'Gradual Blackout'], ['bubble', 'Pop the Bubble Wrap']];

const makeGrid = (gridSize) => {
  let dashes = '';
  for (i = 0; i < (gridSize * 6.5); i++) {
    dashes += '-';
  }
  document.querySelector('.grid').insertAdjacentHTML('afterbegin', dashes);
  for (i=0; i<gridSize; i++) {
    const row =
      `
      <div class="row gridrow${i}">
      </div>
      `;
    document.querySelector('.grid').insertAdjacentHTML('beforeend', row);
    for (a=0; a<gridSize; a++) {
      const square =
        `
        <div class="column">
          <img src='green.png' id="${a}-${i}">
          </img>
        </div>
        `;
      document.querySelector(`.gridrow${i}`).insertAdjacentHTML('beforeend', square);
    };
  };
  document.querySelector('.grid').insertAdjacentHTML('beforeend', dashes);
  let selections =''
  games.forEach(game => {
  selections += ` - - - - - - - - - <a href='#${game[0]}' id='${game[0]}'>${game[1]}</id='${game[0]}'></a> - - - - - - - - -`;
  });
  document.querySelector('.selection').insertAdjacentHTML('afterbegin', selections);
};

const switchColor = (id) => {
  document.getElementById(id).setAttribute('src', 'purple.png');
};

const leadColor = (id) => {
  document.getElementById(id).setAttribute('src', 'black.png');
};

const clickMe = () => {
  document.querySelector('.grid').addEventListener('click', e => {
    if (e.target.id) {
      switchColor(e.target.id);
    }
  });
};

const ending = (squig) => {
  document.querySelector('.information').textContent +=
    `
    Number of moves: ${squig.moveList.length-1}
    `;

};
const blackoutSquig = () => {
  const squig = new Squig(numberOfSquares);
  squig.speed = document.querySelector('.speed').value;
  window.addEventListener('keypress', c => clearInterval(squig.repeater));
  squig.repeater = setInterval(squig.blackout, squig.speed);
};

const snakeSquig = () => {
  const squig = new Squig(numberOfSquares);
  squig.speed = document.querySelector('.speed').value;
  window.addEventListener('keypress', c => clearInterval(squig.repeater));
  squig.go();
};

window.addEventListener('load', () => {
  window.location.hash='';
});

numberOfSquares = 25;
makeGrid(numberOfSquares);
document.querySelector('.speed').value = 100;
document.getElementById('bubble').addEventListener('click', clickMe);
document.getElementById('blackout').addEventListener('click', blackoutSquig);
document.getElementById('snake').addEventListener('click', snakeSquig);
