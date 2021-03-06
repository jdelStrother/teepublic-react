import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DesignTile from '../design_tile/DesignTile';

import './DesignCollection.scss';

const CLASS_ROOT = 'tp-design-collection';

export default class DesignCollection extends Component {
  render() {
    const { className, designs, buyProductLinkBuilder, storeId } = this.props;

    const classes = classnames(CLASS_ROOT, className, 'teepublic');

    const designTiles = designs.map(function(design, designIndex) {
      return (
        <DesignTile
          key={designIndex}
          buyProductLinkBuilder={buyProductLinkBuilder}
          design={design}
          storeId={storeId}
          className={`${CLASS_ROOT}__tile`}
        />
      );
    }, this);

    return <div className={classes}>{designTiles}</div>;
  }
}

DesignCollection.propTypes = {
  designs: PropTypes.array.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired,
  storeId: PropTypes.number
};
