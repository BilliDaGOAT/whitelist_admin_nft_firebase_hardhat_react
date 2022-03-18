import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../Firebase'
import { ref } from '../App'
import * as s from '../styles/global.style'

const Admin = ({handleModal}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logged, setLogged] = useState(false)
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [address, setAddress] = useState('')

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
      .catch((error) => console.log('Error: Unable to log'))
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
        handleModal('Success:', 'added to the whitelist')
      })
      .catch((error) => {
        handleModal('Error:', 'Enable to add the address')
      })
  }

  return (
    <s.Container ai="center">
      {!logged ? (
        <>
          <s.TextSubTitle>
            Se logger à l'interface d'administration
          </s.TextSubTitle>
          <s.Input
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <s.Input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <s.Button onClick={loggin}>Connexion</s.Button>
        </>
      ) : (
        <>
          <s.TextSubTitle>Listing of accounts in the whitelist</s.TextSubTitle>
          {loaded &&
            data.map((element) => (
              <li key={element.id}>
                <s.Container fd="row" ai="center">
                  <s.TextDescription>
                    {element.address} - {element.balance} ETH
                  </s.TextDescription>
                  <s.Button
                    style={{ marginLeft: 10 }}
                    value={element.id}
                    onClick={deleteAddress}
                  >
                    Delete Address
                  </s.Button>
                </s.Container>
              </li>
            ))}
          <s.SpacerLarge />
          <s.TextSubTitle>Add an address to the whitelist</s.TextSubTitle>
          <s.Input placeholder='Address' type="text" onChange={(e) => setAddress(e.target.value)} />
          <s.Button onClick={addOnWhitelist}>Add to the Whitelist</s.Button>
        </>
      )}
    </s.Container>
  )
}

export default Admin
