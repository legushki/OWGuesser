import { useState } from 'react'
import GamemodeButton from '../components/GamemodeButton'
import '../styles/App.css?v=1.1'

function App() {

  return (
    <>
      <h1>SELECT GAMEMODE</h1>
      <div id='gamemode-list'>
        <GamemodeButton url = {"/sounds"} image={"soundwave.png"} title={'SOUND EFFECTS'} desc={'GUESS ABILITIES BY THE SOUND THEY MAKE'}/>
        <GamemodeButton url = {"/feet"} image={"swiftstep.png"} title={'FEET'} desc={'MATCH THE FEET TO THE CHARACTER'}/>
        <GamemodeButton url={"#"} image={"hybrid.webp"} title={'MAPS'} desc={''}/>
      </div>
    </>
  )
}

export default App;
