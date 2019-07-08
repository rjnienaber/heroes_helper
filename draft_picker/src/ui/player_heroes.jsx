import React, { Component } from "react";
import {HeroesInput } from './heroes_input.jsx';

export class PlayerHeroes extends Component {
  constructor(props) {
    super(props);

    this.heroInputRef = React.createRef();
    this.index = props.index;
    this.parentOnChange = props.onChange || (() => {});
    this.parentOnPlayerMove = props.onPlayerMove || (() => {});
  }

  get heroes() {
    return this.heroInputRef.current.heroes;
  }

  set heroes(values) {
    this.heroInputRef.current.heroes = values;
  }

  render() {
    const {index, allHeroes, heroes} = this.props;
    const {parentOnChange, parentOnPlayerMove} = this;

    return (
      <div className="row">
        <div className='col-sm-1'>
          {index !== 0 &&
            <button onClick={() => parentOnPlayerMove(this.index, 'up')}>
              <i className="fas fa-arrow-up" />
            </button>
          }

          {index !== 4 &&
            <button onClick={() => parentOnPlayerMove(this.index, 'down')}>
              <i className="fas fa-arrow-down" />
            </button>
          }
        </div>
        <div className='col-sm-1'>
          Player {index + 1}
        </div>
        <div className='col-sm-8'>
          <HeroesInput
            ref={this.heroInputRef}
            placeHolder={'Type in heroes for team'}
            allHeroes={allHeroes}
            heroes={heroes}
            onHeroAdd={() => parentOnChange(this.index)}
            onHeroRemove={() => parentOnChange(this.index)}
          />
        </div>
      </div>
    );
  }
}
