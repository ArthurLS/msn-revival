import React from 'react';

import FontAwesome from './FontAwesome';

function VideosDisplay({
  localVideo, remoteVideo, answerCall, endCall, callStatus, isIncomingCall, hasLocalVideo
}) {
  return (
    <>
      <div className="video-block">
        <video
          ref={localVideo}
          className="local-video"
          autoPlay
          muted
          style={{ visibility: callStatus === 'ongoing' ? 'visible' : 'hidden' }}
        />
        <video
          ref={remoteVideo}
          className="remote-video"
          autoPlay
          style={{ visibility: callStatus === 'ongoing' || hasLocalVideo ? 'visible' : 'hidden' }}
        />
      </div>
      <div className="call-controls">
        {callStatus !== 'none' && (
          <button
            type="button"
            onClick={endCall}
            style={{ backgroundColor: 'red' }}
          >
            <FontAwesome icon="hangUp" />
          </button>
        )}
        {isIncomingCall && callStatus === 'awaiting' && (
          <button
            type="button"
            onClick={answerCall}
            style={{ backgroundColor: 'green', marginLeft: '15px' }}
          >
            <FontAwesome icon="call" />
          </button>
        )}
      </div>
    </>
  );
}

export default VideosDisplay;
