# About
Components for rendering a TeePublic storefront.
[![test-status](https://travis-ci.org/BustedTees/teepublic-react.svg?branch=master)](https://travis-ci.org/BustedTees/teepublic-react)

# Installation
`npm install teepublic-react`
or
`yarn add teepublic-react`

# Quick Start
These components are designed for responses from the TeePublic.com API.  With an API response from  `/v1/stores/{id}`, you can use the DesignCollection component to quickly show tiles.
```
import { DesignCollection } from 'teepublic-react'

class MyStore extends React.Component {
  render () {
    const avatarUrl = this.props.store_data.avatarUrl
    const bannerUrl = this.props.store_data.bannerUrl
    const designs   = this.props.store_data._embedded.designs
    const onClickHandler   = (design, sku) => {
      console.log(design);
      console.log(sku);
    }

    return (
      <div className='homepage'>
        <img src={bannerUrl}/>
        <br/>
        <img src={avatarUrl}/>

        <DesignCollection
          designs={designs}
          tileSize="large"
          onDesignClick={ onClickHandler }
        />

      </div>
    );
  }
}
```

# Documentation
## Components
## `<AddToCart />`
This component allows you to add items to a cart that is managed in localStorage. We read from the same localStorage object in the `<Cart />` component

`<AddToCart /> -----> localStorage -------> <Cart />`

The AddToCart button could be placed anywhere on the screen just make sure you provide the required propTypes to this component.

We currently use this Component on `<BuyProduct />` component where user can look through product details and if they like it they can "AddToCart"

#### `<AddToCart />` propTypes
```
AddToCart.propTypes = {
  className: PropTypes.string,
  design: PropTypes.object.isRequired,
  affiliateId: PropTypes.number.isRequired,
  affiliateNetworkId: PropTypes.number.isRequired,
  storeId: PropTypes.number.isRequired,
  sku: PropTypes.object.isRequired
};
```
#### `<AddToCart />` propTypes explanation
**design**: design object returned from TeePublic APIs, there are several APIs which return design objects, one example is this. (https://api.teepublic.com/v1/docs#/designs/getV1DesignsId)

**affiliateId**: The Affiliate ID of a given store so that we can track the sale and credit your portion of the revenue to you account. You can find this  (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)

**affiliateNetworkId**: Your Affiliate Network ID so we can track the sale and credit your portion of the revenue to the account. Since it is possible to have multiple affiliates, and affiliate stores in your network, the Affiliate Network ID is necessary to get credit for sales coming from stores in your network. Found as a header `X-AffiliateNetwork-Id` on API responses.

**storeId**: store id on TeePublic, also returned from the API (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)

**sku**: Sku is unique identifier for product, this API (https://api.teepublic.com/v1/docs#/designs/getV1DesignsId) returns a list of sku

## `<BackToProducts />`
This renders a button which lets users go back to store page from anywhere. We use this component on `<BuyProduct />` page.

#### `<BackToProducts />` propTypes
```
BackToProducts.propTypes = {
  className: PropTypes.string,
  storeUrl: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};
```
#### `<BackToProducts />` propTypes explanation
**storeUrl**: Application specific store URL like 'https://my-website.com/teepublic/stores/store-slug'

**linkText**: Configure button text like "Back to Store"


## `<BuyProduct />`
This render the product page for a given design. Users can select different style, color or size of the product in this component.

Other Components it uses internally
```
AddToCart -> Allows users to add current selected sku to the cart
ImageGallery -> As it sounds, it shows the mockups of design
BackToProducts -> This allows user to go back to store page
ProductVariants -> This shows users different product types for the same design
SkuSelector -> A design has a complex rules when a particular option is selected like size and color
RelatedTags -> This shows users related tags to the current design which are calcauted by our Graph DB
```

#### `<BuyProduct />` propTypes
```
BuyProduct.propTypes = {
  className: PropTypes.string,
  design: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  storeUrl: PropTypes.func.isRequired,
  affiliateNetworkId: PropTypes.number.isRequired,
  tagLinkBuilder: PropTypes.func.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired,
  sizechartUrl: PropTypes.func.isRequired
};
```

#### `<BuyProduct />` propTypes explanation
**design**: design object returned from TeePublic APIs (https://api.teepublic.com/v1/docs#/designs/getV1DesignsId)

**store**: store object is returned by TeePublic APIs (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)

**storeUrl**: Function to build application specific URL for store so that `<BackToProducts />` could take users back to the store.
```
(storeId) => {
  return `/stores/${storeId}`;
}
```

**affiliateNetworkId**: Your Affiliate Network ID so we can track the sale and credit your portion of the revenue to the account. Since it is possible to have multiple affiliates, and affiliate stores in your network, the Affiliate Network ID is necessary to get credit for sales coming from stores in your network. Found as a header `X-AffiliateNetwork-Id` on API responses.

**tagLinkBuilder**: There is component at the bottom of the page to allow users dive into other related tags. But in order to make that happen we need a URL where we can direct them after the click. This is how our demo projects looks like.
```
tagLinkBuilder={(type, tag, affiliateId, affiliateNetworkId) => {
  var baseUrl = 'https://www.teepublic.com';
  return `${baseUrl}/${type}/${tag}?ref_id=${affiliateId}&aff_network_id=${affiliateNetworkId}`;
}}
```
For the time being you would have to use same baseUrl as mentioned above since we don't have capability to show designs for tags on white label stores.

**buyProductLinkBuilder**: On Buy Product page, we allow users to buy other products too like same designs on different products or different designs from your store. So in order to route them properly we need to understand how application specific BuyProduct Urls looks like.
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```
productTypeName is available in design objects

**sizechartUrl**: This helps user to look at size chart
```
() => {
  return 'https://www.teepublic.com/sizechart';
}
```

## `<Cart />`
Reads the added cart items from local storage to populate Cart and show it to users.

#### `<Cart />` propTypes
```
Cart.propTypes = {
  className: PropTypes.string,
  storePathLinkBuilder: PropTypes.func.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired
};
```
#### `<Cart />` propTypes explanation
**storePathLinkBuilder**: A function to build your application specific store URLs.
```
(
  storeId,
  selectedPage,
  selectedAlbumId,
  selectedProductTypeName
) => {
  let url = `/stores/${storeId}?page=${selectedPage}`;
  if (selectedAlbumId) url += `&album_id=${selectedAlbumId}`;
  if (selectedProductTypeName)
    url += `&product_type=${selectedProductTypeName}`;
  return url;
}
```
**buyProductLinkBuilder**: A function to build BuyProduct page URL which let's users to go back to product page from the items in the cart
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```
**onCheckout**: A function to help users to checkout and redirect them to TeePublic. Below is a working example
```
(cartItems) => {
    const cartJSON = JSON.stringify({cartItems: cartItems})
    var url = 'https://www.teepublic.com/external_cart?cart_items='
    url += cartJSON
    window.location = url
  },
```


## `<CartButton />`
Cart Button should be placed at all times on your UI. It does three things.
1. keep poling localStorage for any changes and if there is any item added to the cart from anywhere, it will just update the count
2. Allow users to click on the cart to see their full cart and what's in it
3. Direct Checkout and skip the looking at the cart part

#### `<CartButton />` propTypes
```
Cart.propTypes = {
  className: PropTypes.string,
  cartUrl: PropTypes.string.isRequired,
  onCheckout: PropTypes.func.isRequired
};
```
#### `<CartButton />` propTypes explanation
**cartUrl**: Application specific URL where `<Cart />` component is rendered

**onCheckout**: A function to help users to checkout and redirect them to TeePublic. Below is a working example
```
(cartItems) => {
    const cartJSON = JSON.stringify({cartItems: cartItems})
    var url = 'https://www.teepublic.com/external_cart?cart_items='
    url += cartJSON
    window.location = url
  },
```

## `<CartItem />`
This component is being used by `<Cart />` internally to show individuals cart item.
#### `<CartItem />` propTypes
```
CartItem.propTypes = {
  className: PropTypes.string,
  cartItem: PropTypes.object.isRequired,
  buyProductLinkBuilderL PropTypes.func.isRequired,
  updateCartItem: PropTypes.func.isRequired,
  deleteCartItem: PropTypes.func.isRequired
};
```

## `<Column />`
This is a wrapper around flex box with column layout


## `<DesignCollection />`
This component shows a collection of `<DesignTile />`. This component is being inside `<Store />` component but if applications needs to show a collection of designs somewhere else, this could be used.

#### `<DesignCollection />` propTypes
```
DesignCollection.propTypes = {
  tileSize: PropTypes.oneOf(['small', 'medium', 'large']),
  designs: PropTypes.array.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired,
  storeId: PropTypes.number
};
```
#### `<DesignCollection />` propTypes explanation
**tileSize**: This is being passed to individual `<DesignTile />` component

**designs**: List of designs returned from TeePublic APIs. (https://api.teepublic.com/v1/docs#/designs/getV1Designs)

**buyProductLinkBuilder**: It allows design collection to build your application specific urls to render `<BuyProduct />` pages.
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```

**storeId**: This is the store id on TeePublic, returned from the API (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)

## `<DesignTile />`
This component is responsible for rendering individual design tile which includes product mockup, price, design title and a buy button.
#### `<DesignTile />` propTypes
```
DesignTile.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  design: PropTypes.object.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired,
  storeId: PropTypes.number.isRequired
};
```
#### `<DesignTile />` propTypes explanation
**size**: `['small', 'medium', 'large']`

**design**: a single design object returned from TeePublic APIs (https://api.teepublic.com/v1/docs#/designs/getV1Designs)

**buyProductLinkBuilder**: It allows design tile to build your application specific urls to render `<BuyProduct />` pages.
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```

**storeId**: This is your store id on TeePublic, also returned from the API (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)


## `<Footer />`
This render a footer component with powered by TeePublic logo in it.

## `<ImageGallery />`
This component is being used internally by `<BuyProduct />` component, which allows users to see through different images of the product.
#### `<ImageGallery />` propTypes
```
ImageGallery.propTypes = {
  className: PropTypes.string,
  images: PropTypes.array.isRequired,
  selectedImageIndex: PropTypes.number.isRequired,
  onImageSelect: PropTypes.func.isRequired
};
```
#### `<ImageGallery />` propTypes explanation
**images**: Array of image urls that will help the component to build thumbnails. https://api.teepublic.com/v1/docs#/designs/getV1Designs. design -> skus -> images

**selectedImageIndex**: Parent should pass selectedImageIndex, so the component knows which image to load on the main image.

**onImageSelect**: Since this component doesn't maintain the selectedImageIndex, we expect a function to be passed, components fires when a user clicks on a thumbnail. For eg, if users clicks on the 3rd image in the images array, component is gonna call onImageSelect with index = 2.


## `<Pagination />`
It renders a pagination component which allows users to change page number of something.
If the number of designs are too large to load in one go, application will need to implement paging by passing paging params to this API (https://api.teepublic.com/v1/docs#/designs/getV1Designs). This component is used in `<Store />` component to manage different pages.
#### `<Pagination />` propTypes
```
Pagination.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired
};
```
#### `<Pagination />` propTypes explanation
**currentPage**: Currently selected page, we let parent component store the state of currentPage

**onPageChange**: This is a function which is called when users clicks a page.

**totalPages**: Number of pages parents wants to render

## `<ProductVariants />`
It renders a collection of product for a same design. Each design can be printed on different product types like t-shirt, mug or iPhone case. This helps an application to show different product variants for the same design.
#### `<ProductVariants />` propTypes
```
ProductVariants.propTypes = {
  className: PropTypes.string,
  design: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  currentSku: PropTypes.object.isRequired,
  buyProductLinkBuilder: PropTypes.func.isRequired
};
```
#### `<ProductVariants />` propTypes explanation
**design**: design object for which an application want to show different product variants.

**store**: store object as received from the TeePublic APIs (https://api.teepublic.com/v1/docs#/stores/getV1StoresId)

**currentSku**: This helps the component show everything other than the current sku. design object -> skus

**buyProductLinkBuilder**: It allows product variants to build your application specific urls to render `<BuyProduct />` pages if users clicks on any of those product variants.
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```

## `<RelatedTags />`
This renders a list of clickable tags related to a design. This could be found at the bottom of `<BuyProduct />` component where it shows other related tags for the current design.
#### `<RelatedTags />` propTypes
```
RelatedTags.propTypes = {
  className: PropTypes.string,
  design: PropTypes.object.isRequired,
  tagLinkBuilder: PropTypes.func.isRequired,
  affiliateId: PropTypes.number,
  affiliateNetworkId: PropTypes.number
};
```
## `<Row />`
This is a wrapper around flex box with row layout

## `<Store />`
This renders a complete store page very similar to your TeePubic store.
#### `<Store />` propTypes
```
Store.propTypes = {
  className: PropTypes.string,
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
```
#### `<Store />` propTypes explanation
**storeData**: It's the store object returned from https://api.teepublic.com/v1/docs#/stores/getV1StoresId

**storeUrl**: This is a function to build application specific store URLs and this a demo function
```
(storeId) => {
  return `/stores/${storeId}`;
}
```

**cartUrl**: This is a function which return url to the page where `<Cart />` component is being rendered.

**buyProductUrl**: This is a function to build your application specific URL to `<BuyProduct />` component
```
(designId, productTypeName, storeId) => {
  return `/stores/${storeId}/designs/${designId}?product_type=${productTypeName}`;
}
```

**selectedAlbumId**: The ID of the currently selected album, if there is an album selected. This should get passed down to the `<StoreFilter />`.

**selectedPage**: The currently selected page number; used for paging. This should get passed down to the `<StoreFilter />`.

**selectedProductTypeName**: The currently selected product type. This should get passed down to the `<StoreFilter />` to enable filtering by that product.


## `<StoreFilter />`
It renders a component to show different set of options to filter a store. It's being used inside `<Store />` component.
#### `<StoreFilter />` propTypes
```
StoreFilter.propTypes = {
  className: PropTypes.string,
  albums: PropTypes.array.isRequired,
  productTypes: PropTypes.array.isRequired,
  selectedAlbumId: PropTypes.number,
  selectedProductTypeName: PropTypes.string,
  onAlbumChange: PropTypes.func.isRequired,
  onProductTypeChange: PropTypes.func.isRequired,
  filterStyle: PropTypes.oneOf(['nav', 'dropdown']),
};
```
#### `<StoreFilter />` propTypes explanation
**albums**: List of albums could be retrieved from this TeePublic API (https://api.teepublic.com/v1/docs#/stores/getV1StoresId) look for albums object

**productTypes**: List of product types could be retrieved from this TeePublic API (https://api.teepublic.com/v1/docs#/stores/getV1StoresId), look for productTypes and could be passed as it is

**selectedAlbumId**: Send a selected album id to the component so the component can select album id visually

**selectedProductTypeName**: Same logic as selectedAlbumId

**onAlbumChange**: This is a function called when a user clicks on any album to notify the parent component to make an another request to TeePublic API to filter by album

**onProductTypeChange**: Same logic as onAlbumChange

**filterStyle**: Component support two styles as of now. "nav" and "dropdown". dropdown is a default style. Dropdown is designed for mobile and nav is for desktop

### `<TeepublicPowered />`
This renders a logo saying Powered By TeePublic

### General Concepts
**className** You can pass className as a prop to any of TeePublic component and it will get added to the parent tag of the component
```
// We have some code like this in each component
import classnames from 'classnames';
const { className } = this.props;
const classes = classnames(CLASS_ROOT, className);
```

**CLASS_ROOT:** Each component have a CLASS_ROOT defined inside it which is of `tp-[component]` form.

**PropTypes:** Every component has it's expected PropTypes defined at the bottom of the `[component].js` file with proper requirements like what kind and if it is required. It should be reliable for most parts but this shouldn't be your source of truth.

# Devlopment Process
Clone the repo on your dev machine
`git clone https://github.com/BustedTees/teepublic-react`

`npm install` to install all dependencies

`npm start` to run the demo project

`npm publish` to publish the package on npm. You would need to change the version number in package.json

`git push -u origin <branch-name>` & create PR and get it reviewed
