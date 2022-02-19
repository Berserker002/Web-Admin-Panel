import { db } from '../components/firebase/firebase-config'

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

const productCollectionRef = collection(db, "products")

class ProductDataService{

    addProducts = (newProducts) => {
        return addDoc(productCollectionRef, newProducts)
    }

    updateProduct = (id, updateProduct) => {
        const productDoc = doc(db, "products", id)
        return updateDoc(productDoc, updateProduct)
    }

    deleteProduct = (id) => {
        const productDoc = doc(db, "products", id)
        return deleteDoc(productDoc)
    } 

    getAllProducts = () => {
        return getDocs(productCollectionRef)
    }

    getProducts = (id) => {
        const productDoc = doc(db, "products", id)
        return getDoc(productDoc)
    } 


}
export default new ProductDataService
