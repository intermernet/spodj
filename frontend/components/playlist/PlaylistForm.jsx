import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import ReactSelectize, {MultiSelect} from 'react-selectize';

class PlaylistForm extends Component{
    onSubmit(e){
        e.preventDefault();
    }

    render(){
        return (
            <Grid>
                <form onSubmit={this.onSubmit.bind(this)}>
				<Row>
					<Col md={6}>
                    <div className='form-group'>
                        {/*<div>
                            <MultiSelect
                                placeholder = "Select fruits"
                                options = {["apple", "mango", "orange", "banana"].map(function(fruit){return {label: fruit, value: fruit};})}
                                onValuesChange = {function(values){
                                    alert(values);
                                }}
                            />
                        </div>*/}
                        <div>
                            <strong>BPM</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'bpmLow')}
                                min={this.props.minBPM}
                                max={this.props.maxBPM}
                                value={this.props.bpmLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.bpmLow, this.props.bpmHigh]}
                                change={this.props.handleSliderChange.bind(this, 'bpmLow', 'bpmHigh', 1)}
                                step={this.props.stepBPM}
                                min={this.props.minBPM}
                                max={this.props.maxBPM}
                                range='true'
                                tooltip='hide'
                                ticks = {[100, 140, 180]}
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'bpmHigh')}
                                min={this.props.minBPM}
                                max={this.props.maxBPM}
                                value={this.props.bpmHigh}
                                size={3}
                            />
                        </span>
                    </div>
                    </Col>
					<Col md={6}>            
                    <div className='form-group'>
                        <div>
                            <strong>Danceability</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'danceLow')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.danceLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.danceLow*100, this.props.danceHigh*100]}
                                change={this.props.handleSliderChange.bind(this, 'danceLow', 'danceHigh', 0.01)}
                                step={1}
                                min={0}
                                max={100}
                                range='true'
                                tooltip='hide'
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'danceHigh')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.danceHigh}
                                size={3}
                            />
                        </span>
                    </div>         
                    </Col>
                </Row>
				<Row>
					<Col md={6}>   
                    <div className='form-group'>
                        <div>
                            <strong>Energy</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'nrgLow')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.nrgLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.nrgLow*100, this.props.nrgHigh*100]}
                                change={this.props.handleSliderChange.bind(this, 'nrgLow', 'nrgHigh', 0.01)}
                                step={1}
                                min={0}
                                max={100}
                                range='true'
                                tooltip='hide'
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'nrgHigh')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.nrgHigh}
                                size={3}
                            />
                        </span>
                    </div>
                    </Col>
					<Col md={6}>            
                    <div className='form-group'>
                        <div>
                            <strong>Acousticness</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'acoustLow')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.acoustLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.acoustLow*100, this.props.acoustHigh*100]}
                                change={this.props.handleSliderChange.bind(this, 'acoustLow', 'acoustHigh', 0.01)}
                                step={1}
                                min={0}
                                max={100}
                                range='true'
                                tooltip='hide'
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'acoustHigh')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.acoustHigh}
                                size={3}
                            />
                        </span>
                    </div>       
                    </Col>
                </Row>
				<Row>
					<Col md={6}>   
                    <div className='form-group'>
                        <div>
                            <strong>Liveness</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'liveLow')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.liveLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.liveLow*100, this.props.liveHigh*100]}
                                change={this.props.handleSliderChange.bind(this, 'liveLow', 'liveHigh', 0.01)}
                                step={1}
                                min={0}
                                max={100}
                                range='true'
                                tooltip='hide'
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'liveHigh')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.liveHigh}
                                size={3}
                            />
                        </span>
                    </div>
                    </Col>
					<Col md={6}>            
                    <div className='form-group'>
                        <div>
                            <strong>Loudness</strong>
                        </div>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'loudLow')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.loudLow}
                                size={3}
                            />
                        </span>
                        <span>
                            <ReactBootstrapSlider
                                value={[this.props.loudLow*100, this.props.loudHigh*100]}
                                change={this.props.handleSliderChange.bind(this, 'loudLow', 'loudHigh', 0.01)}
                                step={1}
                                min={0}
                                max={100}
                                range='true'
                                tooltip='hide'
                            />
                        </span>
                        <span>
                            <NumericInput
                                onChange={this.props.handleChange.bind(this, 'loudHigh')}
                                min={0.0}
                                max={1.0}
                                step={0.01}
                                precision={2}
                                value={this.props.loudHigh}
                                size={3}
                            />
                        </span>
                    </div>       
                    </Col>
                </Row>
                </form>            
			</Grid>
        )
    }
}

PlaylistForm.propTypes = {
    bpmLow: React.PropTypes.number.isRequired,
    bpmHigh: React.PropTypes.number.isRequired,
    danceLow: React.PropTypes.number.isRequired,
    danceHigh: React.PropTypes.number.isRequired,
    nrgLow: React.PropTypes.number.isRequired,
    nrgHigh: React.PropTypes.number.isRequired,
    acoustLow: React.PropTypes.number.isRequired,
    acoustHigh: React.PropTypes.number.isRequired,
    liveLow: React.PropTypes.number.isRequired,
    liveHigh: React.PropTypes.number.isRequired,
    loudLow: React.PropTypes.number.isRequired,
    loudHigh: React.PropTypes.number.isRequired,
    handleChange: React.PropTypes.func.isRequired,    
    handleSliderChange: React.PropTypes.func.isRequired
}

export default PlaylistForm