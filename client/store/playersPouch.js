import firebase from '../firebase';

// Action Type
const GET_ALL_PLAYER_TILES = "GET_ALL_PLAYER_TILES";
const REMOVE_TILE_FROM_POUCH = "REMOVE_TILE_FROM_POUCH";
const ADD_TILE_TO_POUCH = "ADD_TILE_TO_POUCH";
const ADD_COORDS_TO_TILE = "ADD_COORDS_TO_TILE";

// Action
export const getAllPlayerTiles = tiles => {
  return {
    type: GET_ALL_PLAYER_TILES,
    tiles
  };
};

export const removeTileFromPouch = id => {
  return {
    type: REMOVE_TILE_FROM_POUCH,
    id
  };
};

export const addTileToPouch = tile => {
  return {
    type: ADD_TILE_TO_POUCH,
    tile
  };
};

export const addCoordsToTile = coords => {
  return {
    type: ADD_COORDS_TO_TILE,
    coords
  }
}

export const assignPlayerTilesToFirebasePotThunk = (indivPot, gameId, playerNumber ) =>
  dispatch => {
    let player = `Player ${playerNumber}`;
    firebase.database().ref(`games/${gameId}/players/${player}`).child('playerPot')
    .set(indivPot)
    //dispatch(getAllPlayerTiles(indivPot))
}

export const getPlayerTilesThunk = (gameId, playerNumber) =>
  dispatch => {
    let player = `Player ${playerNumber}`;
    firebase.database().ref(`games/${gameId}/players/${player}/playerPot`).once('value', snapshot => {
      dispatch(getAllPlayerTiles(snapshot.val()))
    })
  }

export const updateTilePositionOnFirebase = (updatedPot, player, gameId) =>
  dispatch => {
    console.log('hi')
    // firebase.database().ref(`games/${gameId}/players/`).once('value', snapshot => {
    //   .set(pot: updatedPot)
    //     }
    //   })

    //   console.log('player', playerNumber)
      // for (let i in allPlayers){
      //   if (allPlayers[i].id === playerId && isPlayer === false) {
      //     isPlayer = true
      //     firebase.database().ref(`/game/${gameId}/players/${allPlayers[i]}`).child('playerPot').once('value', snapshot => {
      //       console.log(snapshot.val())
      //     })
      //   }
      //}
    // })
  }

// Reducer
function playersPouch(state = [], action) {
  switch (action.type) {
    case GET_ALL_PLAYER_TILES:
      return action.tiles;
    case REMOVE_TILE_FROM_POUCH:
      return state.filter(tile => tile.id !== action.id);
    case ADD_TILE_TO_POUCH:
      if (action.tile !== {}) {
        return [action.tile, ...state]
      } else {
        return null
      }
    // case: ADD_COORDS_TO_TILE:
    //   return coords
    default:
      return state;
  }
}

export default playersPouch;
