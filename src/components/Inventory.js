import React, { Fragment, useEffect, useState } from 'react'
import ProductDataServices from '../services/book.services'
import './Inventory.css'

export const Inventory = ({ idHandler }) => {
  const [products, setProducts] = useState([])
  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    const data = await ProductDataServices.getAllProducts()
    // console.log(data.docs)
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  const deleteHandler = (id) => {
    ProductDataServices.deleteProduct(id)
    getProducts()
  }

  const getProductsHandler = () => {
    getProducts()
  }
  return (
    <div className="forms__controls">
      <button onClick={getProductsHandler}>Refresh Products List</button>
      {products.map((doc, index) => {
        return (
          <div className="meal" key={doc.id}>
              <div className='inside__list'>
            <div>
              <h2>{index + 1}</h2>
              <h3>Name = {doc.productName}</h3>
              <div className="price">price = {doc.productPrice}</div>
              <div className="values">Mrp = {doc.productMrp}</div>
              <div className="values">Discount = {doc.productDiscount}</div>
              <div className="values">Size = {doc.productSize}</div>
              <div className="values">quantity = {doc.quantity}</div>
              <div className="values">color = {doc.color}</div>
              <div className="values">Description = {doc.description}</div>
            </div>
            <div>
              <img src={doc.image} className="image__class" />
            </div>
              </div>
            <div>
              <button onClick={(e) => idHandler(doc.id)}>Edit</button>
              <button onClick={(e) => deleteHandler(doc.id)}>Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Inventory
