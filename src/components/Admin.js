import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../Firebase'
import { ref } from '../App'

const Admin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logged, setLogged] = useState(false)
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [address, setAddress] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoaded(true)
  }, [data])

  const loggin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLogged(true)
        getData()
      })
      .catch((error) => console.log('Error: Unable to log')
      )
  }

  const getData = () => {
    ref.onSnapshot((querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
        items.push(doc.data())
      })
      setData(items)
    })
  }

  const deleteAddress = (e) => {
    ref.doc(e.target.value).delete()
  }

  const addOnWhitelist = () => {
    let id = uuidv4()
    let balance = 0
    let obj = {
      id: id,
      address: address,
      balance: balance,
    }
    ref
      .doc(obj.id)
      .set(obj)
      .then((result) => {
        setSuccess('Success: added to the whitelist')
        setError('')
      })
      .catch((error) => {
        setSuccess('')
        setError('Error: Enable to add the address')
      })
  }

  return (
    <div>
      {!logged ? (
        <>
          Se logger à l'interface d'administration
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={loggin}>Connexion</button>
        </>
      ) : (
        <>
          {error && <p className="alert error">{error}</p>}
          {success && <p className="alert success">{success}</p>}
          Listing of accounts in the whitelist
          {loaded &&
            data.map((element) => (
              <li key={element.id}>
                {element.address} - {element.balance} -{' '}
                <button value={element.id} onClick={deleteAddress}>
                  Delete Address
                </button>
              </li>
            ))}
          Add an address to the whitelist
          <input type="text" onChange={(e) => setAddress(e.target.value)} />
          <button onClick={addOnWhitelist}>Add to the Whitelist</button>
        </>
      )}
    </div>
  )
}

export default Admin
