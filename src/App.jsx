import React, { useEffect, useRef, useState } from 'react';
import JsSIP from 'jssip';

import SIPLogin from './SIPLogin';
import FontAwesome from './FontAwesome';
import VideosDisplay from './VideosDisplay';

import './App.css';

const App = () => {
  const [ua, setUa] = useState(null);
  const [isUAConnected, setIsUAConnected] = useState(false);
  const [session, setSession] = useState(null);

  const [uri, setUri] = useState('');
  const [password, setPassword] = useState('');
  const [calledId, setCalledId] = useState('');
  const [username, setUsername] = useState('');

  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callStatus, setCallStatus] = useState('none');

  const localVideo = useRef(null);
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const remoteVideo = useRef(null);

  // Event handlers when starting the call
  const eventHandlers = {
    failed() {
      resetUI();
    },
    ended() {
      resetUI();
    },
    progress() {
      setCallStatus('awaiting');
    },
    confirmed() {
      setCallStatus('ongoing');
    },
    accepted() {
      setCallStatus('accepted');
    }
  };
  // Basic JsSIP session parameters
  const sessionOptions = {
    pcConfig: {
      rtcpMuxPolicy: 'require',
      iceServers: []
    },
    eventHandlers,
    mediaConstraints: { audio: true, video: true }
  };

  useEffect(() => {
    if (ua && !isUAConnected) {
      ua.start();
      setIsUAConnected(true);

      ua.on('registrationFailed', (ev) => {
        setIsUAConnected(false);
        resetUI();
        console.log(`Registering on SIP server failed with error: ${ev.cause}`);
      });

      const regex = /:(.*?)@/gm;
      setUsername(regex.exec(uri)[1]);

      ua.on('newRTCSession', (data) => {
        const newSession = data.session;
        if (session) {
          session.terminate();
        }
        setSession(newSession);
        // When receiving a call
        if (newSession.direction === 'incoming') {
          setCallStatus('awaiting');
          setSession(newSession);
          setIsIncomingCall(true);
          setTempLocalVideo();
          // Event handlers when receiving the call
          newSession.on('peerconnection', () => {
            setCallStatus('ongoing');
            addStream(newSession);
          });
          newSession.on('failed', () => {
            resetUI();
          });
          newSession.on('ended', () => {
            resetUI();
          });
        }
      });
    }
  }, [ua]);

  // Connect to antisip SIP web socket service
  const connect = () => {
    const socket = new JsSIP.WebSocketInterface('wss://sip.antisip.com:4443');
    const configuration = {
      sockets: [socket],
      uri,
      password
    };
    setUa(new JsSIP.UA(configuration));
  };

  const startCall = () => {
    const s = ua.call(calledId, sessionOptions);
    setSession(s);
    setTempLocalVideo();
    addStream(s);
  };

  // Set a temporary local video (full screen, that's why it's assigned to remoteVideo)
  // It's easier to do it natively than with SIP session and stream handling
  const setTempLocalVideo = () => {
    const constraints = {
      audio: false,
      video: { facingMode: 'user' }
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      remoteVideo.current.srcObject = stream.clone();
      setHasLocalVideo(true);
    });
  };

  const addStream = (ses) => {
    // When the remote video stream is recieved, display both video
    ses.connection.addEventListener('addstream', (e) => {
      localVideo.current.srcObject = ses.connection.getLocalStreams()[0].clone();
      remoteVideo.current.srcObject = e.stream.clone();
      setCallStatus('ongoing');
    });
  };

  const endCall = () => {
    session.terminate();
    resetUI();
  };

  const answerCall = () => {
    session.answer(sessionOptions);
  };

  const resetUI = () => {
    remoteVideo.current.srcObject = null;
    localVideo.current.srcObject = null;
    setIsIncomingCall(false);
    setCallStatus('none');
    setHasLocalVideo(false);
  };

  return (
    <div className="App">
      <div className="title">
        MSN SIP revival <br />
        <img className="msn-logo" src="./msn_logo.png" alt="msn logo" />
      </div>
      <div className="username">
        {username}
      </div>
      {!isUAConnected && (
        <SIPLogin
          uri={uri}
          setUri={setUri}
          password={password}
          setPassword={setPassword}
          connect={connect}
        />
      )}
      {isUAConnected && callStatus === 'none' && (
        <>
          <div className="input-block">
            Who you gonna call? SIP address: <br />
            <input
              type="text"
              name="calledId"
              value={calledId}
              onChange={(e) => setCalledId(e.currentTarget.value)}
              placeholder="sip:username@sip_host.com"
            />
          </div>
          <button
            type="button"
            className="call-button"
            onClick={startCall}
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Call &nbsp;&nbsp;<FontAwesome icon="call" />
          </button>
        </>
      )}
      <VideosDisplay
        localVideo={localVideo}
        remoteVideo={remoteVideo}
        answerCall={answerCall}
        endCall={endCall}
        callStatus={callStatus}
        isIncomingCall={isIncomingCall}
        hasLocalVideo={hasLocalVideo}
      />
    </div>
  );
};

export default App;
