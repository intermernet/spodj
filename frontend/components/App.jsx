import React, {Component} from 'react';
import PlaylistSection from './playlist/PlaylistSection.jsx';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
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
                acoustHigh: 0.9
        };
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

    render(){
        return (
            <div className='app'>
                <div className='nav'>
                   <PlaylistSection 
                        {...this.state}
                        handleChange={this.handleChange.bind(this)}
                        handleSliderChange={this.handleSliderChange.bind(this)}
                   />
                </div>
            </div>
        )
    }
}

export default App