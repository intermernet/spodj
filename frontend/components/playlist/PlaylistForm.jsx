import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import ReactSelectize, { MultiSelect } from 'react-selectize';
import AlertContainer from 'react-alert';

class PlaylistForm extends Component {
    onSubmit(e) {
        e.preventDefault();
        var data = {
            genres: this.refs.genres.state.values,
            name: this.refs.name.value
        }
        if (data.genres.length === 0) {
            msg.show('You must select at least one genre!', {
                type: 'error'
            });
            return;
        }
        this.props.postForm(data);
    }

    render() {
        return (
            <Grid>
                <form ref='form' onSubmit={this.onSubmit.bind(this)}>
                    <Row>
                        <Col md={12}>
                            <div>
                                <MultiSelect
                                    style={{ width: '100%' }}
                                    placeholder="Select genres"
                                    options={
                                        this.props.genres.map(genre => {
                                            return { label: genre, value: genre }
                                        })
                                    }
                                    maxValues={5}
                                    ref='genres'
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>BPM</strong>
                            </div>
                        </Col>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>Danceability</strong>
                            </div>
                        </Col>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>Energy</strong>
                            </div>
                        </Col>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>Acousticness</strong>
                            </div>
                        </Col>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>Popularity</strong>
                            </div>
                        </Col>
                        <Col md={2} xs={2}>
                            <div>
                                <strong>Mood</strong>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'bpmHigh')}
                                    min={this.props.minBPM}
                                    max={this.props.maxBPM}
                                    value={this.props.bpmHigh}
                                    size={3}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'popHigh')}
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={this.props.popHigh}
                                    size={3}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'moodHigh')}
                                    min={0.0}
                                    max={1.0}
                                    step={0.01}
                                    precision={2}
                                    value={this.props.moodHigh}
                                    size={3}
                                />
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.bpmLow, this.props.bpmHigh]}
                                    change={this.props.handleSliderChange.bind(this, 'bpmLow', 'bpmHigh', 1)}
                                    step={this.props.stepBPM}
                                    min={this.props.minBPM}
                                    max={this.props.maxBPM}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[this.props.minBPM, 100, 140, 180, this.props.maxBPM]}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.danceLow * 100, this.props.danceHigh * 100]}
                                    change={this.props.handleSliderChange.bind(this, 'danceLow', 'danceHigh', 0.01)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[0, 100]}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.nrgLow * 100, this.props.nrgHigh * 100]}
                                    change={this.props.handleSliderChange.bind(this, 'nrgLow', 'nrgHigh', 0.01)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[0, 100]}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.acoustLow * 100, this.props.acoustHigh * 100]}
                                    change={this.props.handleSliderChange.bind(this, 'acoustLow', 'acoustHigh', 0.01)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[0, 100]}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.popLow, this.props.popHigh]}
                                    change={this.props.handleSliderChange.bind(this, 'popLow', 'popHigh', 1)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[0, 100]}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span className='slider'>
                                <ReactBootstrapSlider
                                    value={[this.props.moodLow * 100, this.props.moodHigh * 100]}
                                    change={this.props.handleSliderChange.bind(this, 'moodLow', 'moodHigh', 0.01)}
                                    step={1}
                                    min={0}
                                    max={100}
                                    range='true'
                                    tooltip='hide'
                                    orientation='vertical'
                                    reversed={true}
                                    ticks={[0, 100]}
                                />
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'bpmLow')}
                                    min={this.props.minBPM}
                                    max={this.props.maxBPM}
                                    value={this.props.bpmLow}
                                    size={3}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
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
                        </Col>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'popLow')}
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={this.props.popLow}
                                    size={3}
                                />
                            </span>
                        </Col>
                        <Col md={2} xs={2}>
                            <span>
                                <NumericInput
                                    onChange={this.props.handleChange.bind(this, 'moodLow')}
                                    min={0.0}
                                    max={1.0}
                                    step={0.01}
                                    precision={2}
                                    value={this.props.moodLow}
                                    size={3}
                                />
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <input
                                placeholder='Playlist name'
                                ref='name'
                            />
                            <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />
                            <Button type="submit">Submit</Button>
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
    popLow: React.PropTypes.number.isRequired,
    popHigh: React.PropTypes.number.isRequired,
    moodLow: React.PropTypes.number.isRequired,
    moodHigh: React.PropTypes.number.isRequired,
    genres: React.PropTypes.array.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleSliderChange: React.PropTypes.func.isRequired,
    postForm: React.PropTypes.func.isRequired
}

export default PlaylistForm