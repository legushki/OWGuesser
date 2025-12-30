import { useState } from 'react'
import GamemodeButton from '../components/GamemodeButton'
import '../styles/App.css'
import '../styles/SharedComponents.css'
function App() {

  return (
    <div className='landing'>
      <h1>SELECT GAMEMODE</h1>
      <div id='gamemode-list'>
        <GamemodeButton url = {"/sounds"} image={"soundwave.webp"} title={'SOUND EFFECTS'} desc={'GUESS ABILITIES BY THE SOUND THEY MAKE'}/>
        <GamemodeButton url = {"/feet"} image={"swiftstep.webp"} title={'FEET'} desc={'GUESS THE CHARACTER FROM A PICTURE OF THEIR FEET'}/>
        <GamemodeButton url={"/maps"} image={"hybrid.webp"} title={'MAPS'} desc={'GUESS THE MAP FROM A SCREENSHOT'}/>
      </div>
    </div>
  )
}

export default App;
