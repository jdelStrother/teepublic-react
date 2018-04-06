import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import DesignCollection from '../design_collection/DesignCollection';
import CartButton from '../cart_button/CartButton';
import Pagination from '../pagination/Pagination';
import StoreFilter from '../store_filter/StoreFilter';

import './Store.css';

const CLASS_ROOT = 'tp-store';

export default class Store extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPage: props.selectedPage || 1,
      selectedAlbumId: parseInt(props.selectedAlbumId, 10),
      selectedProductTypeName: props.selectedProductTypeName
    };
  }

  pageChangeHandler = page => {
    this.setState({ selectedPage: page });
    const { selectedAlbumId, selectedProductTypeName } = this.state;
    this.fetchStore(page, selectedAlbumId, selectedProductTypeName);
  };

  albumChangeHandler = albumId => {
    this.setState({ selectedAlbumId: albumId });
    const { selectedPage, selectedProductTypeName } = this.state;
    this.fetchStore(selectedPage, albumId, selectedProductTypeName);
  };

  productTypeChangeHandler = productTypeName => {
    this.setState({ selectedProductTypeName: productTypeName });
    const { selectedPage, selectedAlbumId } = this.state;
    this.fetchStore(selectedPage, selectedAlbumId, productTypeName);
  };

  fetchStore = (pageNum, albumId, productTypeName) => {
    const { storeId } = this.props.storeData;

    window.location = this.props.configuration.storeUrl(
      storeId,
      pageNum,
      albumId,
      productTypeName
    );
  };

  render() {
    const { designs, albums, productTypes } = this.props.storeData._embedded;
    const {
      selectedPage,
      selectedAlbumId,
      selectedProductTypeName
    } = this.state;
    const totalPages = parseInt(this.props.storeData.totalPages, 10);

    const { className } = this.props;
    const classes = classnames(className, CLASS_ROOT);

    return (
      <div className={classes}>
        <CartButton href={this.props.configuration.cartUrl()} />

        <Pagination
          currentPage={selectedPage}
          totalPages={totalPages}
          onPageChange={this.pageChangeHandler}
        />

        <StoreFilter
          albums={albums}
          productTypes={productTypes}
          onAlbumChange={this.albumChangeHandler}
          onProductTypeChange={this.productTypeChangeHandler}
          selectedAlbumId={selectedAlbumId}
          selectedProductTypeName={selectedProductTypeName}
        />

        <DesignCollection
          designs={designs}
          tileSize="large"
          buyProductLinkBuilder={this.props.configuration.buyProductUrl}
        />
      </div>
    );
  }
}

Store.propTypes = {
  storeData: PropTypes.object.isRequired,
  configuration: PropTypes.shape({
    storeUrl: PropTypes.func.isRequired,
    cartUrl: PropTypes.func.isRequired,
    buyProductUrl: PropTypes.func.isRequired
  }).isRequired,
  selectedAlbumId: PropTypes.number,
  selectedPage: PropTypes.number,
  selectedProductTypeName: PropTypes.string
};