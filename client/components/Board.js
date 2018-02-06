// Connected to the redux store, owns Squares and Tiles
// Knows all the tiles, their values, and their coordinates

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import Tile from './Tile';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BoardSquare from './BoardSquare';
import { setTilePosition } from '../store/squareToSquareMove';
import { getAllPlayerTiles } from '../store/playersPouch';
import PlayerTilePouch from './PlayerTilePouch';
import GlobalPotDisplay from './GlobalPotDisplay';
import OtherPlayersBoardView from './OtherPlayersBoardView';
import SelectedTileDisplay from './SelectedTileDisplay';
import GameHeader from './GameHeader';
import Square from './Square';
import GameFooter from './GameFooter';
import store, { updatePot, submitWordsForChallengeThunk, addTileToPouch, peelTile, dumpTile, removeTileFromPouch, removeSelectedTile, getPlayerTilesThunk, globalPotListenerThunk, updatePlayerPotThunk, playerPotListenerThunk } from '../store';

export class Board extends Component {
  constructor() {
    super();
    this.state = {
      gameId: "",
      disabled: false
    };

    this.dumpTiles = this.dumpTiles.bind(this);
    this.peel = this.peel.bind(this);
    this.handleSubmitGame = this.handleSubmitGame.bind(this);
  }

  async componentDidMount() {
    if (this.props.createGame) {
      const playerNumber = this.props.user.playerNumber
      const gameId = this.props.createGame.currentGame
      this.props.getPlayerTilesThunk(gameId, playerNumber)
      this.setState({ gameId })
      const globalPot = this.props.globalPotListenerThunk(gameId)
      const playerPouch = this.props.playerPotListenerThunk(gameId, playerNumber)
      await globalPot
      await playerPouch
    }
  }

  movePiece = (x, y) => {
    this.props.setTilePosition(x, y);
  };

  renderSquare(i, j) {
    const x = i;
    const y = j;
    return (

      <div key={i + "" + j}
      style={{
        width: '10%',
        height: '10%',
        border: '1px dotted rgba(0, 0, 0, .2)'
      }}>
        <Square position={{ x, y }} />
      </div>
    );
  }

  movePiece = (x, y) => {
    this.props.setTilePosition(x, y);
  };

  handleSubmitGame(evt) {
    evt.preventDefault();
    const gameId = this.props.createGame.currentGame;
    const playerNumber = this.props.user.playerNumber;
    this.props.submitWordsForChallengeThunk(gameId, playerNumber);
  }

  renderPiece(x, y) {
    const { tileX, tileY } = this.props.squareToSquareMove.position;
    if (x === tileX && y === tileY) {
      return <Tile />;
    }
  }

  async peel(evt) {
    evt.preventDefault()
    var globalPot = this.props.createGame.pot;
    let playersArr = Object.keys(this.props.createGame.players)
    let letterArray = []
    for (var i = 0; i < playersArr.length; i++) {
      var randomLetter = await globalPot[0];
      letterArray.push(randomLetter)
      // console.log("RANDOM LETTER ARRAY: ", letterArray)
      var pos = await globalPot.indexOf(randomLetter);
      globalPot.splice(pos, 1)
    }

    let gameId = this.props.createGame.currentGame
    // let playerNumber = this.props.user.playerNumber
    // let playerPouch = this.props.playersPouch
    // let updatedPlayerPouch = updatePlayerPotThunk(gameId, playerNumber, playerPouch)
    let getPeeledPot = peelTile(gameId, globalPot, playersArr, letterArray)
    store.dispatch(getPeeledPot)
    // store.dispatch(updatedPlayerPouch)
  }



  async dumpTiles(evt) {
    evt.preventDefault()
    var selectedTile = this.props.selectedTile;
    var globalPot = this.props.createGame.pot;
    globalPot.push(selectedTile);
    this.props.removeTileFromPouch(selectedTile.id)
    this.props.removeSelectedTile()
    var count = 0
    while (count < 3) {
      var randomLetter = await globalPot[Math.floor(Math.random() * globalPot.length)];
      var pos = await globalPot.indexOf(randomLetter);
      this.props.addTileToPouch(randomLetter)
      globalPot.splice(pos, 1);
      count++;
    }
    let gameId = this.state.gameId
    let playerNumber = this.props.user.playerNumber
    let playerPouch = this.props.playersPouch
    let updatedPlayerPouch = updatePlayerPotThunk(gameId, playerNumber, playerPouch)
    let swapTile = dumpTile(gameId, globalPot, playerNumber)
    store.dispatch(updatedPlayerPouch)
    store.dispatch(swapTile)
  }

  render() {
    const squares = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        squares.push(this.renderSquare(i, j));
      }
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <GameHeader gameId={this.state.gameId} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between"
          }}
        >
          <div>
            <GlobalPotDisplay />
            <OtherPlayersBoardView />
          </div>
          <div
            style={{
              backgroundImage: `url(${`https://i.pinimg.com/originals/96/57/ba/9657ba4fb7abde9935786a66ccc894ba.jpg`})`,
              width: "620px",
              height: "500px",
              margin: "0 auto",
              border: "1px solid black",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {squares}
          </div>
          <div>
            <PlayerTilePouch />
            <SelectedTileDisplay />
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              margin: '0px 0px 0px 5px'
            }}>
              {/* <button className="btn" id="grab-tiles" refs="btn" onClick={(evt) => this.grabTiles(evt)} disabled={this.state.disabled === true}>Grab Tiles</button> */}
              <button className="btn" id="dump-tiles" refs="btn" onClick={(evt) => this.dumpTiles(evt)} disabled={this.props.selectedTile ? false : true}>Dump Tile</button>
              <button className="btn" id="grab-tiles" refs="btn" onClick={(evt) => this.peel(evt)}>PEEL</button>
              <Link to={`/game/${this.state.gameId}/winner`}>
                <button
                  className="btn"
                  id="submit-tiles"
                  refs="btn"
                  disabled={
                    this.props.createGame.pot.length > 0 &&
                    this.props.playersPouch.length > 0
                  }
                  onClick={evt => this.handleSubmitGame(evt)}
                >
                  Submit Game
                </button>
              </Link>
            </div>
          </div>
        </div>
        <GameFooter />
      </div>
    );
  }
}

/******** CONTAINER **********/


const mapDispatchToProps = {
  updatePot,
  setTilePosition,
  getAllPlayerTiles,
  submitWordsForChallengeThunk,
  addTileToPouch,
  peelTile,
  removeTileFromPouch,
  removeSelectedTile,
  getPlayerTilesThunk,
  globalPotListenerThunk
};


const mapStateToProps = ({
  squareToSquareMove,
  createGame,
  selectedTile,
  playersPouch,
  user
}) => ({
  squareToSquareMove,
  createGame,
  selectedTile,
  dumpTile,
  playersPouch,
  user,
  updatePlayerPotThunk
});

Board = DragDropContext(HTML5Backend)(Board);
Board = connect(mapStateToProps, mapDispatchToProps)(Board);

export default Board;
