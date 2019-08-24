import React, { Component } from 'react';
import logo from '../logo.svg';
import '../css/App.css';

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

  // componentDidMount() {
  //   this.getNowPlaying();
  //   var self = this;
  //   this.timer = setInterval(function() {
  //     self.getNowPlaying();
  //   }, 1000)
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timer);
  // }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      console.log(res);
      this.setState({
        dataReceived: true,
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

  render() {
    return (
      <div>
        <div className="wrapper">
          {!this.state.loggedIn && <a href="http://localhost:8888/login"> Login to Spotify</a>}
          {this.state.dataReceived &&
            <div className="bg">
              <div>
                <img style={{ opacity: this.state.opacity }} onMouseEnter={this.handleMouseOverInfo.bind(this)} onMouseLeave={this.handleMouseOutInfo.bind(this)} className="image" src={this.state.nowPlaying.albumArt} alt="Album Art" />
              </div>
            </div>
          }

          {this.state.dataReceived && this.state.view &&
            <div className="info-wrapper">
              <div>
                <a className="text title" href={this.state.nowPlaying.title.url}>{this.state.nowPlaying.title.name}</a>
              </div>
              <div>
                {this.state.nowPlaying.artists.map((item, index, arr) => {
                  let text = index === arr.length - 1 ? item.name : item.name + ", ";
                  return (<a className="text artist" key={index} href={item.external_urls.spotify}>{text}</a>);
                })
                }
              </div>
            </div>
          }
          {this.state.dataReceived && 
            <div className="progressbar-wrapper">
              <div style={{color: "white", marginRight: "5px"}}>{`${Math.floor(this.state.nowPlaying.progress/1000/60)}:${('00'+Math.round((this.state.nowPlaying.progress % 60000)/1000)).slice(-2)}`}</div>
              <div className="progressbar-bg">
                <div style={{ width: `${(this.state.nowPlaying.progress / this.state.nowPlaying.length) * 100}%`}} className="progressbar">
                </div>
              </div>
              <div style={{color: "white", marginLeft : "5px"}}>{`${Math.floor(this.state.nowPlaying.length/1000/60)}:${('00'+Math.round((this.state.nowPlaying.length % 60000)/1000)).slice(-2)}`}</div>
            </div>
          }

        </div>
        <div>
          {this.state.loggedIn &&
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
              </button>
          }
        </div>
      </div>
    );
  }
}