import React from 'react';

function SIPLogin({
  uri, setUri, password, setPassword, connect
}) {
  return (
    <div className="login">
      <div className="input-block">
        SIP address: <br />
        <input
          type="text"
          name="uri"
          autoComplete="off"
          value={uri}
          placeholder="sip:username@sip_host.co"
          onChange={(e) => setUri(e.currentTarget.value)}
        />
      </div>
      <div className="input-block">
        Password: <br />
        <input
          type="password"
          name="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button type="button" onClick={connect}>Connect</button>
      </div>
    </div>
  );
}

export default SIPLogin;
