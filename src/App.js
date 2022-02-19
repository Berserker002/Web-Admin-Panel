import React, { Fragment, useState } from 'react';
import ProductForm from './components/ProductForm';
import Header  from './components/Header';
import Inventory  from './components/Inventory';

function App() {

  const [productId, setProductId] = useState("")
  // const [imgUrl, setImgUrl] = useState("")

  const productIdHandler = (id) => {
    // console.log(id)
    setProductId(id)

  }

  // const imgHandler = (url) => {
  //   setImgUrl(url)
  // }
 


  return (
    <Fragment>
      <Header/>
      <ProductForm id={productId} setId={setProductId} />
      <Inventory idHandler={productIdHandler}/>
    </Fragment>
  );
}

export default App;
