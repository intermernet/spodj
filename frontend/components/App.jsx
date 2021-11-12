import React, {Component} from 'react';
import PlaylistSection from './playlist/PlaylistSection.jsx';

const initialState = {
                bpmLow: 90,
                bpmHigh: 140,
                stepBPM: 1,
                maxBPM: 210,
                minBPM: 70,
                danceLow: 0.1,
                danceHigh: 0.9,
                nrgLow: 0.1,
                nrgHigh: 0.9,
                acoustLow: 0.1,
                acoustHigh: 0.9,
                popLow: 25,
                popHigh: 100,
                moodLow: 0.2,
                moodHigh: 1.0,
                genres: [ "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music" ]
        };

class App extends Component{
    
    constructor(props){
        super(props);
        this.state = initialState;
        this.alertOptions = {
            offset: 14,
            position: 'bottom left',
            theme: 'dark',
            time: 5000,
            transition: 'scale'
        };
    }

    handleChange(name, value){
        if (value != null) {
            let state = this.state;
            state[name] = value;
            this.setState({state});
        }
    }

    handleSliderChange(name1, name2, scale, value){
        if (value != null) {
            let state = this.state;
            state[name1] = value.target.value[0]*scale;
            state[name2] = value.target.value[1]*scale;
            this.setState({state});
        }
    }

    postForm(data){
        var selectedGenres = [];
        for(var i = 0; i < data.genres.length; i++) {
            selectedGenres[i] = data.genres[i].value;
        }
        var postData = {
                name: data.name,
                bpmLow: this.state.bpmLow,
                bpmHigh: this.state.bpmHigh,
                danceLow: this.state.danceLow,
                danceHigh: this.state.danceHigh,
                nrgLow: this.state.nrgLow,
                nrgHigh: this.state.nrgHigh,
                acoustLow: this.state.acoustLow,
                acoustHigh: this.state.acoustHigh,
                popLow: this.state.popLow,
                popHigh: this.state.popHigh,
                moodLow: this.state.moodLow,
                moodHigh: this.state.moodHigh,
                genres: selectedGenres
        }
        console.log(JSON.stringify(postData));
        //this.setState({initialState});
        console.log("Doing API Request...\n");
         var request = new Request('https://spodj.intermer.net/api', {
        //var request = new Request('http://127.0.0.1:9090/api', {
            method: 'POST', 
	        mode: 'cors',
            body: JSON.stringify(postData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        fetch(request)
        .then(function(response) {
            console.log(response.status);
            if(response.status == 200) return response.json();
            else throw new Error('Something went wrong on api server!');
        })
        .then(function(response) {
            console.log("received response");
            console.debug(response);
            location.assign(response.url)
            // ...
        })
        .catch(function(error) {
            console.error(error);
        });
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