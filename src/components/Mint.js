import React from 'react'
import * as s from '../styles/global.style'

const Mint = ({mint}) => {
  return (
    <s.Container flex={1} ai="center">
      <s.TextTitle>Mint</s.TextTitle>
      <s.Button style={{ marginTop: 20 }} onClick={mint}>
        MINT NFT
      </s.Button>
    </s.Container>
  )
}

export default Mint
