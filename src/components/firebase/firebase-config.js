import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC17-HHv7r5BvBBKv43p2PpVMzhd_wrVOg',
  authDomain: 'admin-panel-cdc5b.firebaseapp.com',
  projectId: 'admin-panel-cdc5b',
  storageBucket: 'admin-panel-cdc5b.appspot.com',
  messagingSenderId: '789994409100',
  appId: '1:789994409100:web:de3344330179e3b435ffa9',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)
