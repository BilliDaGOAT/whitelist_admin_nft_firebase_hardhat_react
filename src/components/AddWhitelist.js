import React from 'react'
import { ref } from '../App'
import { v4 as uuidv4 } from 'uuid'
import * as s from '../styles/global.style'

const AddWhitelist = ({
  countData,
  getCount,
  balance,
  accounts,
  handleModal,
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
                    handleModal('Success:', 'You have been added to the whitelist')
                  })
                  .catch((err) => {
                    handleModal('Error:', 'Unable to add your address')
                  })
              } else {
                handleModal('Error:', 'Not enough funds (0.3 ETH min.)')
              }
            } else {
              handleModal('Error:', 'Address already in the whitelist')
            }
          })
          .catch((err) => {
            handleModal('Error', 'with firebase')
          })
      } else {
        handleModal('Error:', 'Whitelist max limit exceeded')
      }
    } else {
      handleModal('Error:', 'Invalid address')
    }
    setTimeout(getCount(), 500)
  }

  return (
    <s.Container flex={1} ai="center">
      <s.TextTitle>Whitelist</s.TextTitle>
      {balance && <s.TextSubTitle>Wallet Balance : {balance} ETH</s.TextSubTitle>}
      {balance > 0.3 ? (
        <s.Button
          onClick={() => {
            createDoc({ address: accounts[0], id: uuidv4(), balance: balance })
          }}
        >
          Enter to the Whitelist
        </s.Button>
      ) : (
        <s.TextSubTitle>
          Not enough Eth on your account to be member of our whitelist
        </s.TextSubTitle>
      )}
    </s.Container>
  )
}

export default AddWhitelist
