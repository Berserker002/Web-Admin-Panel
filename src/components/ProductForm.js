import './ProductForm.css'
import useInput from '../store/use-input'
import ProductDataServices from '../services/book.services'
import { Fragment, useEffect, useState } from 'react'
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase/firebase-config'
import imageCompression from 'browser-image-compression'

const isNotEmpty = (value) => value.trim() !== ''
const isPositive = (value) => value.trim() !== '' && value > 0
const isDiscount = (value) => value.trim() !== '' && value > 0 && value <= 100
const isDesc = (value) => value.trim().length > 20

export const ProductForm = ({ id, setId, onImageUrl }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const {
    enteredInput: enteredName,
    inputIsValid: nameIsValid,
    inputIsInValid: nameIsInValid,
    setWasTouched: setNameWasTouched,
    enteredInputHandler: nameInputHandler,
    inputLostFocusHandler: nameLostFocusHandler,
    setEnteredInput: setEnteredName,
    reset: resetName,
  } = useInput(isNotEmpty)
  const {
    enteredInput: enteredPrice,
    inputIsValid: priceIsValid,
    inputIsInValid: priceIsInValid,
    setWasTouched: setPriceWasTouched,
    enteredInputHandler: priceInputHandler,
    inputLostFocusHandler: priceLostFocusHandler,
    setEnteredInput: setEnteredPrice,
    reset: resetPrice,
  } = useInput(isPositive)
  const {
    enteredInput: enteredMrp,
    inputIsValid: mrpIsValid,
    inputIsInValid: mrpIsInValid,
    setWasTouched: setMrpWasTouched,
    enteredInputHandler: mrpInputHandler,
    inputLostFocusHandler: mrpLostFocusHandler,
    setEnteredInput: setEnteredMrp,
    reset: resetMrp,
  } = useInput(isPositive)
  const {
    enteredInput: enteredDiscount,
    inputIsValid: discountIsValid,
    inputIsInValid: discountIsInValid,
    setWasTouched: setDiscountWasTouched,
    enteredInputHandler: discountInputHandler,
    inputLostFocusHandler: discountLostFocusHandler,
    setEnteredInput: setEnteredDiscount,
    reset: resetDiscount,
  } = useInput(isDiscount)
  const {
    enteredInput: enteredSize,
    inputIsValid: sizeIsValid,
    inputIsInValid: sizeIsInValid,
    setWasTouched: setSizeWasTouched,
    enteredInputHandler: sizeInputHandler,
    inputLostFocusHandler: sizeLostFocusHandler,
    setEnteredInput: setEnteredSize,
    reset: resetSize,
  } = useInput(isPositive)
  const {
    enteredInput: enteredQuantity,
    inputIsValid: quantityIsValid,
    inputIsInValid: quantityIsInValid,
    setWasTouched: setQuantityWasTouched,
    enteredInputHandler: quantityInputHandler,
    inputLostFocusHandler: quantityLostFocusHandler,
    setEnteredInput: setEnteredQuantity,
    reset: resetQuantity,
  } = useInput(isPositive)
  const {
    enteredInput: enteredColor,
    inputIsValid: colorIsValid,
    inputIsInValid: colorIsInValid,
    setWasTouched: setColorWasTouched,
    enteredInputHandler: colorInputHandler,
    inputLostFocusHandler: colorLostFocusHandler,
    setEnteredInput: setEnteredColor,
    reset: resetColor,
  } = useInput(isNotEmpty)
  const {
    enteredInput: enteredDesc,
    inputIsValid: descIsValid,
    inputIsInValid: descIsInValid,
    setWasTouched: setDescWasTouched,
    enteredInputHandler: descInputHandler,
    inputLostFocusHandler: descLostFocusHandler,
    setEnteredInput: setEnteredDesc,
    reset: resetDesc,
  } = useInput(isDesc)

  const [compressedDownloadLink, setCompressedDownloadLink] = useState('')


  const [productImage, setProductImage] = useState('')
  const [productImageError, setProductImageError] = useState('')
  const [imageLoading, setImageIsLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(0)

  const productImageIsValid = productImageError === ''


  const productImageHandler = (event) => {
    const file = event.target.files[0]
    if (!file) {
      setProductImageError('Please Upload Image')
      return
    }
    if (event.target.files[0].size >= 2000000) {
      setProductImageError('Image Size Must be less than 2MB')
      return
    }
    if (
      event.target.files[0].type !== 'image/png' &&
      event.target.files[0].type !== 'image/jpg' &&
      event.target.files[0].type !== 'image/jpeg'
    ) {
      setProductImageError('Please Upload jpg/jpeg or png')
      return
    } else {
      setProductImageError('')
    }
    console.log(event.target.files[0])

    const fileRef = ref(storage, `/productImages/${file.name}`)
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: 'image/jpeg',
    })
    setImageIsLoading(true)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        setUploadLoading(progress)
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProductImage(downloadURL)
          setImageIsLoading(false)
        })
      },
    )
  }

  let formIsValid = false
  if (
    nameIsValid &&
    priceIsValid &&
    mrpIsValid &&
    discountIsValid &&
    sizeIsValid &&
    quantityIsValid &&
    colorIsValid &&
    descIsValid &&
    productImageIsValid
  ) {
    formIsValid = true
  }

  const productSubmitHandler = async (event) => {
    event.preventDefault()
    setNameWasTouched(true)
    setPriceWasTouched(true)
    setMrpWasTouched(true)
    setDiscountWasTouched(true)
    setSizeWasTouched(true)
    setQuantityWasTouched(true)
    setColorWasTouched(true)
    setDescWasTouched(true)
    setProductImageError('Please Upload Image')

    if (!formIsValid) {
      return
    }
    const newProduct = {
      productName: enteredName,
      productPrice: enteredPrice,
      productMrp: enteredMrp,
      productDiscount: enteredDiscount,
      productSize: enteredSize,
      quantity: enteredQuantity,
      color: enteredColor,
      description: enteredDesc,
      image: productImage,
    }
    setIsLoading(true)
    setError('')
    try {
      if (id !== undefined && id !== '') {
        await ProductDataServices.updateProduct(id, newProduct)
        setId('')
      } else {
        await ProductDataServices.addProducts(newProduct)
      }
    } catch (err) {
      setError(err.message)
    }
    setShowForm(false)
    setIsLoading(false)

    resetName()
    resetPrice()
    resetMrp()
    resetDiscount()
    resetSize()
    resetQuantity()
    resetColor()
    resetDesc()
  }

  const editHandler = async () => {
    setShowForm(true)
    try {
      const snapData = await ProductDataServices.getProducts(id)
      setEnteredName(snapData.data().productName)
      setEnteredPrice(snapData.data().productPrice)
      setEnteredMrp(snapData.data().productMrp)
      setEnteredDiscount(snapData.data().productDiscount)
      setEnteredSize(snapData.data().productSize)
      setEnteredQuantity(snapData.data().quantity)
      setEnteredColor(snapData.data().color)
      setEnteredDesc(snapData.data().description)
      setProductImage(snapData.data().image)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (id !== undefined && id !== '') {
      // console.log('form app' + id)
      editHandler(id)
    }
  }, [id])

  let content = (
    <div className="forms__controls__add">
      <button
        onClick={() => {
          setShowForm(true)
        }}
      >
        Add New Product
      </button>
    </div>
  )

  if (showForm) {
    content = (
      <form onSubmit={productSubmitHandler}>
        <div className="forms__controls">
          <div className="forms__control">
            <label htmlFor="Name">Enter name of the product</label>
            <input
              type="text"
              value={enteredName}
              onChange={nameInputHandler}
              onBlur={nameLostFocusHandler}
            ></input>
            {nameIsInValid && (
              <p className="invalid">Enter valid name of product</p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Price">Enter Price</label>
            <input
              type="number"
              value={enteredPrice}
              onChange={priceInputHandler}
              onBlur={priceLostFocusHandler}
            ></input>
            {priceIsInValid && (
              <p className="invalid">
                Enter valid price of product(must be in +ve )
              </p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="MRP">Enter MRP</label>
            <input
              type="number"
              value={enteredMrp}
              onChange={mrpInputHandler}
              onBlur={mrpLostFocusHandler}
            ></input>
            {mrpIsInValid && (
              <p className="invalid">
                Enter valid MRP of product(must be in +ve )
              </p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Discount">Enter Discount(%)</label>
            <input
              type="number"
              value={enteredDiscount}
              onChange={discountInputHandler}
              onBlur={discountLostFocusHandler}
            ></input>
            {discountIsInValid && (
              <p className="invalid">Enter valid discount on product(0-100)%</p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Size">Enter size</label>
            <input
              type="number"
              value={enteredSize}
              onChange={sizeInputHandler}
              onBlur={sizeLostFocusHandler}
            ></input>
            {sizeIsInValid && (
              <p className="invalid">
                Enter valid size of product(must be in +ve)
              </p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Quantitiy">Enter quantity</label>
            <input
              type="number"
              value={enteredQuantity}
              onChange={quantityInputHandler}
              onBlur={quantityLostFocusHandler}
            ></input>
            {quantityIsInValid && (
              <p className="invalid">
                Enter valid quantity of product(must be in +ve )
              </p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Color">Enter color</label>
            <input
              type="text"
              value={enteredColor}
              onChange={colorInputHandler}
              onBlur={colorLostFocusHandler}
            ></input>
            {colorIsInValid && (
              <p className="invalid">Enter valid color of product</p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="Desc">Describe your product</label>
            <textarea
              name="paragraph_text"
              cols="40"
              rows="10"
              value={enteredDesc}
              onChange={descInputHandler}
              onBlur={descLostFocusHandler}
            ></textarea>
            {descIsInValid && (
              <p className="invalid">
                Enter valid description(more than 20 words)
              </p>
            )}
          </div>
          <div className="forms__control">
            <label htmlFor="image">Upload image of the product</label>
            <input
              type="file"
              onChange={productImageHandler}
              accept="image/*"
            ></input>
            {imageLoading && <p>Please wait image is geting uploaded....</p>}
            {productImageError && (
              <p className="invalid">{productImageError}</p>
            )}
          </div>
          {/* <button onClick={getProductsHandler}>Refresh</button> */}
          <button type="submit">Add/Update Product</button>
          <button
            onClick={() => {
              setShowForm(false)
            }}
          >
            close
          </button>
        </div>
        <div className="forms__actions"></div>
      </form>
    )
  }

  if (isLoading) {
    content = <p className="forms__controls__p">Loading...</p>
  }

  if (error) {
    content = (
      <div className="forms__controls__add">
        <p className="forms__controls__p">{error}</p>
        <button
          onClick={() => {
            setShowForm(true)
          }}
        >
          Add New Product
        </button>
      </div>
    )
  }

  return <Fragment>{content}</Fragment>
}

export default ProductForm
