import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';

export class SettingsSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || 100
    };

    this.onChange = props.onChange;
  }

  handleSliderChange(event, newValue) {
    this.setState(state => {
      state.value = newValue;
      return state;
    }, this.onChange);
  }

  handleInputChange(event) {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    this.setState(state => {
      state.value = value;
      return state;
    }, this.onChange);
  }

  handleBlur() {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  }

  get value() {
    return this.state.value / 100;
  }

  set value(val) {
    this.setState(state => {
      state.value = val;
      return state;
    }, this.onChange);
  }

  render() {
    return (
      <div className="row">
        <div className='col-sm-5'>
          <a href={this.props.url}>{this.props.name}</a>
        </div>
        <div className='col-sm-4'>
          <Slider
            value={typeof this.state.value === 'number' ? this.state.value : 0}
            onChange={this.handleSliderChange.bind(this)}
            aria-labelledby="input-slider"
            min={0}
            max={200}
          />
        </div>
        <div className='col-sm-3'>
          <Input
            ref="input"
            value={this.state.value}
            margin="dense"
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            inputProps={{
              step: 1,
              min: 0,
              max: 200,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          %
        </div>
      </div>
    );
  }
}
