import React, { Component } from "react";

export class HeroesInput extends Component {
  constructor(props) {
    super(props);

    this.allHeroes = props.allHeroes;
    this.initialHeroes = props.heroes || [];
    this.heroSelect = React.createRef();

    this.parentOnHeroAdd = props.onHeroAdd || (() => {});
    this.parentOnHeroRemove = props.onHeroRemove || (() => {});
    this.bulkSet = false;
  }

  componentDidMount() {
    this.bulkSet = true;
    this.select = $(this.heroSelect.current).selectize({
      labelField: 'hero',
      searchField: 'hero',
      valueField: 'hero',
      options: this.allHeroes,
      create: false,
      closeAfterSelect: true,
      openOnFocus: false,
      onItemAdd: (hero) => {
        if (!this.bulkSet)
          this.parentOnHeroAdd({values: this.select.items, hero})
      },
      onItemRemove: (hero) => {
        if (!initializing)
          this.parentOnHeroRemove({values: this.select.items, hero})
      }
    })[0].selectize;
    this.select.setValue(this.initialHeroes);
    this.bulkSet = false;
  }

  get heroes() {
    return this.select.items;
  }

  set heroes(values) {
    if (this.select) {
      this.bulkSet = true;
      this.select.setValue(values);
      this.bulkSet = false;
    }

  }

  render() {
    const {playerHolder} = this.props;
    return (
      <select ref={this.heroSelect} multiple placeholder={playerHolder}>
      </select>
    );
  }
}
