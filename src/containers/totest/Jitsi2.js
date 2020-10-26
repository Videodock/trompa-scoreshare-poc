import React, { useState } from "react";
import Jitsi from "react-jitsi";
// import Loader from './components/Loader'

const roomName = 'my-super-secret-meeting-123e4567-e89b-12d3-a456-426655440000'
const userFullName = 'Joseph Strawberry'

export default function Jitsi2(props) {
    const [displayName, setDisplayName] = useState('')
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')
    const [onCall, setOnCall] = useState(false)
   
    return onCall
      ? (
        <Jitsi
          roomName={roomName}
          displayName={displayName}
          password={password}
        //   loadingComponent={Loader}
          onAPILoad={JitsiMeetAPI => console.log('Good Morning everyone!')}
        />)
      : (
        <>
          <h1>Crate a Meeting</h1>
          <input type='text' placeholder='Room name' value={roomName} onChange={e => setRoomName(e.target.value)} />
          <input type='text' placeholder='Your name' value={displayName} onChange={e => setDisplayName(e.target.value)} />
          <button onClick={() => setOnCall(true)}> Let&apos;s start!</button>
        </>
      )
}