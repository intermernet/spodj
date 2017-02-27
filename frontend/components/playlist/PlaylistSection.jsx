import React, {Component} from 'react';
import PlaylistForm from './PlaylistForm.jsx';

class PlaylistSection extends Component{
    render(){
        return (
            <div className='panel panel-primary'>
                <div>
                    <h1><strong>SpoDJ</strong></h1>
                </div>
                <div className='panel-heading'>
                    <strong>Spotify DJ Playlist Generator</strong>
                </div>
                <div className='panel-body playlists'>
                    <PlaylistForm {...this.props} />
                </div>
            </div>

        )
    }
}

PlaylistSection.propTypes = {
    bpmLow: React.PropTypes.number.isRequired,
    bpmHigh: React.PropTypes.number.isRequired,
    danceLow: React.PropTypes.number.isRequired,
    danceHigh: React.PropTypes.number.isRequired,
    nrgLow: React.PropTypes.number.isRequired,
    nrgHigh: React.PropTypes.number.isRequired,
    acoustLow: React.PropTypes.number.isRequired,
    acoustHigh: React.PropTypes.number.isRequired,
    popLow: React.PropTypes.number.isRequired,
    popHigh: React.PropTypes.number.isRequired,
    moodLow: React.PropTypes.number.isRequired,
    moodHigh: React.PropTypes.number.isRequired,
    genres: React.PropTypes.array.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleSliderChange: React.PropTypes.func.isRequired,
    postForm: React.PropTypes.func.isRequired
}

export default PlaylistSection