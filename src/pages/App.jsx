import { useState } from 'react'
import GamemodeButton from '../components/GamemodeButton'
import '../styles/App.css'
import '../styles/SharedComponents.css'
function App() {

  return (
    <div className='landing'>
      <h1>SELECT GAMEMODE</h1>
      <div id='gamemode-list'>
        <GamemodeButton url = {"/sounds"} image={"soundwave.png"} title={'SOUND EFFECTS'} desc={'GUESS ABILITIES BY THE SOUND THEY MAKE'}/>
        <GamemodeButton url = {"/feet"} image={"swiftstep.png"} title={'FEET'} desc={'MATCH THE FEET TO THE CHARACTER'}/>
        <GamemodeButton url={"#"} image={"hybrid.webp"} title={'MAPS'} desc={''}/>
      </div>
    </div>
  )
}

export default App;
