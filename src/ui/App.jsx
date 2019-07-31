import React, {Component} from 'react';
import logo from '../logo.svg';
import '../css/App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default class App extends Component {
  constructor(props)
  {
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
        loggedIn : token ? true : false,
        nowPlaying : { name: 'Not Checked', albumArt: '' }
      }
    );  

  }

  getNowPlaying()
  {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      this.setState({
        nowPlaying : {
          name : res.item.name,
          albumArt : res.item.album.images[0].url
        }
      });
    });
  }

  render()
  {
    return (
      <div className="App">
        <a href="http://localhost:8888/login"> Login to Spotify</a>
        <div>
          Now playing: {this.state.nowPlaying.name}
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} alt="Album Art" style={{height: 150}}/>
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