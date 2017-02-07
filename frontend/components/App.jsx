import React, {Component} from 'react';
import PlaylistSection from './playlist/PlaylistSection.jsx';

const initialState = {
                bpmLow: 130,
                bpmHigh: 150,
                stepBPM: 1,
                maxBPM: 210,
                minBPM: 70,
                danceLow: 0.7,
                danceHigh: 0.9,
                nrgLow: 0.7,
                nrgHigh: 0.9,
                acoustLow: 0.7,
                acoustHigh: 0.9,
                liveLow: 0.7,
                liveHigh: 0.9,
                loudLow: 0.7,
                loudHigh: 0.9,
                popLow: 75,
                popHigh: 100,
                moodLow: 0.8,
                moodHigh: 1.0,
                genres: [ "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music" ]
        };

class App extends Component{
    
    constructor(props){
        super(props);
        this.state = initialState;
    }

    handleChange(name, value){
        let state = this.state;
        state[name] = value;
        this.setState({state});
    }

    handleSliderChange(name1, name2, scale, value){
        let state = this.state;
        state[name1] = value.target.value[0]*scale;
        state[name2] = value.target.value[1]*scale;
        this.setState({state});
    }

    postForm(data){
        console.log(data);
    }

    render(){
        return (
            <div className='app'>
                <div className='nav'>
                   <PlaylistSection 
                        {...this.state}
                        handleChange={this.handleChange.bind(this)}
                        handleSliderChange={this.handleSliderChange.bind(this)}
                        postForm={this.postForm.bind(this)}
                   />
                </div>
            </div>
        )
    }
}

export default App