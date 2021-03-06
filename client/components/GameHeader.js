import React from 'react';

const GameHeader = (props) => {
const {gameId} = props
  return (
    <div style={{
      width: '100vw',
      backgroundImage: `url('/outline.jpg')`,
      backgroundPositionX: '85%',
      color: 'yellow',
      textAlign: 'center',
      margin: '0px 0px 5px 0px',
    }}>
      <div className="text-blockUI-container" >
        <span className="text-blockUI">
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        Welcome to Bananagrams!  {`Game ID: ${gameId}`}
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
        <img src="/banangrams-glamour.png" height="20"/>
      </span>
      </div>
    </div>
  )
}

export default GameHeader
