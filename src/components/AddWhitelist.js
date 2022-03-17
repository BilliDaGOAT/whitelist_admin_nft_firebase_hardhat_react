import React from 'react'
import { ref } from '../App'
import { v4 as uuidv4 } from 'uuid'

const AddWhitelist = ({
  countData,
  getCount,
  balance,
  accounts,
  setError,
  setSuccess,
}) => {
  const createDoc = (newDataObj) => {
    // refresh whitelist
    getCount()

    // check if address valid
    if (newDataObj.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      // Whitelist limit exceeded ? Limit 5 addresses
      if (countData < 5) {
        // Already exist ?
        let i = 0
        ref
          .where('address', '==', newDataObj.address)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              i++
            })
            // If address not alrealdy exist
            if (i < 1) {
              if (balance >= 0.3) {
                // balance min to mint 0.3 ETH
                ref
                  .doc(newDataObj.id)
                  .set(newDataObj)
                  .then((result) => {
                    setSuccess('Success: You have been added to the whitelist')
                    setError('')
                  })
                  .catch((err) => {
                    setSuccess('')
                    setError('Error: Unable to add your address')
                  })
              } else {
                setSuccess('')
                setError('Error: Not enough funds (0.3 ETH min.)')
              }
            } else {
              setSuccess('')
              setError('Error: Address already in the whitelist')
            }
          })
          .catch((err) => {
            setSuccess('')
            setError('Error with firebase')
          })
      } else {
        setSuccess('')
        setError('Error: Whitelist max limit exceeded')
      }
    } else {
      setSuccess('')
      setError('Error: Invalid address')
    }
    setTimeout(getCount(), 500)
  }

  return (
    <>
      {balance > 0.3 && (
        <button
          className="btn"
          onClick={() => {
            createDoc({ address: accounts[0], id: uuidv4(), balance: balance })
          }}
        >
          Go on Whitelist
        </button>
      )}
    </>
  )
}

export default AddWhitelist
