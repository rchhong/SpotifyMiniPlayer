import React, { Component } from 'react';
import logo from '../logo.svg';
import '../css/App.css';

import Background from './Background'
import ProgressBar from './ProgressBar'
import Text from './Text'

import isElectron from 'is-electron';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// const { shell } = window.require('electron').remote;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const params = {};
    window.location.pathname.substring(1).split("&").forEach((entry) => {
      const foo = entry.split("=");
      params[foo[0]] = foo[1];
    });
    console.log(params);
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.setState(
      {
        view: false,
        opacity: 1.0,
        loggedIn: token ? true : false,
        dataReceived: false,
      }
    );
  }

  componentDidMount() {
    this.getNowPlaying();
    let timerFunction = () => {this.getNowPlaying();}
    this.timer = setInterval(timerFunction, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      console.log(res);
      this.setState({
        dataReceived: true,
        isPlaying : res.is_playing,
        repeatState : res.repeat_state,
        shuffleState : res.shuffle_state,
        nowPlaying: {
          title: { name: res.item.name, url: res.item.external_urls.spotify },
          albumArt: res.item.album.images[0].url,
          artists: res.item.artists,
          progress : res.progress_ms,
          length : res.item.duration_ms
        }
      });
    });
  }

  handleMouseOverInfo() {
    this.setState({
      view: true,
      opacity: .5
    });
  }

  handleMouseOutInfo() {
    this.setState({
      view: false,
      opacity: 1.0
    });
  }

  handlePlayback(action) {
      switch(action) {
        case "shuffle":
          spotifyApi.setShuffle(!this.state.shuffleState);
          break;
        case "back":
          spotifyApi.skipToPrevious();
          break;
        case "playPause":
          if(this.state.isPlaying) {
            spotifyApi.pause();
          }
          else {
            spotifyApi.play();
          }
          break;
        case "forward":
          spotifyApi.skipToNext();
          break;
        case "repeat":
          let possibleRepeatStates = ['off', 'context', 'track'];
          let res = "";
          for(let i = 0; i < possibleRepeatStates.length; i++)
          {
            if(possibleRepeatStates[i] === this.state.repeatState) {
              res = possibleRepeatStates[(i + 1) % possibleRepeatStates.length];
            }
          }
          spotifyApi.setRepeat(res);
          break;
      }
  }

  render() {
    if(!isElectron()) {
      return(
        <div>nice try</div>
      );
    }
    return (
      <div>
        <div className="wrapper" onMouseEnter={this.handleMouseOverInfo.bind(this)} onMouseLeave={this.handleMouseOutInfo.bind(this)}>
          {!this.state.loggedIn && <a href="http://localhost:8888/login"> Login to Spotify</a>}
          {this.state.dataReceived &&
            <Background albumArt={this.state.nowPlaying.albumArt} opacity={this.state.opacity}/>
          }

          {this.state.dataReceived && this.state.view &&
            <div className="info-wrapper">
              <Text type="title" text={this.state.nowPlaying.title.name} url={this.state.nowPlaying.title.url} />
              <div style={{marginBottom: '15px'}}>
                {this.state.nowPlaying.artists.map((item, index, arr) => {
                  let text = index === arr.length - 1 ? item.name : item.name + ", ";
                  
                  return (<Text key={index} type="artist" text={text} url={item.external_urls.spotify} />);
                })
                }
              </div>
              {/* <div className="progressbar-wrapper">
                <div style={{color: "white", marginRight: "5px"}}>{`${Math.floor(this.state.nowPlaying.progress/1000/60)}:${('00'+Math.round((this.state.nowPlaying.progress % 60000)/1000)).slice(-2)}`}</div>
                  <div className="progressbar-bg">
                    <div style={{ width: `${(this.state.nowPlaying.progress / this.state.nowPlaying.length) * 100}%`}} className="progressbar"></div>
                  </div>
                <div style={{color: "white", marginLeft : "5px"}}>{`${Math.floor(this.state.nowPlaying.length/1000/60)}:${('00'+Math.round((this.state.nowPlaying.length % 60000)/1000)).slice(-2)}`}</div>
              </div> */}
              <ProgressBar progress={this.state.nowPlaying.progress} length={this.state.nowPlaying.length} />
              <div className="playback-wrapper">
                  <button onClick={this.handlePlayback.bind(this, "shuffle")}>s</button>
                  <button onClick={this.handlePlayback.bind(this, "back")}>b</button>
                  <button onClick={this.handlePlayback.bind(this, "playPause")}>p</button>
                  <button onClick={this.handlePlayback.bind(this, "forward")}>f</button>
                  <button onClick={this.handlePlayback.bind(this, "repeat")}>r</button>
              </div>
            </div>
          }

        </div>
        {/* <div>
          {this.state.loggedIn &&
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
              </button>
          }
        </div> */}
      </div>
    );
  }
}