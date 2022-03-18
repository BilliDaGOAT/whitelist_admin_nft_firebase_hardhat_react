import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Contract from './artifacts/contracts/ERC721Merkle.sol/ERC721Merkle.json'
import firebase from './Firebase'
import AddWhitelist from './components/AddWhitelist'
import Modal from './components/Modal'
import { Route, Routes } from 'react-router-dom'
import Mint from './components/Mint'
import NavbarCustom from './components/Navbar'
import Admin from './components/Admin'
import * as s from './styles/global.style'

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const tokens = require('./tokens.json')
const address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const ref = firebase.firestore().collection('whitelist')

function App() {
  // number of addresses in the whitelist
  const [countData, setCountData] = useState(0)
  // const [tokens, setTokens] = useState([])
  const [loader, setLoader] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [price, setPrice] = useState()
  const [balance, setBalance] = useState(0)
  const [modalShow, setModalShow] = useState(false)
  const [titleModal, setTitleModal] = useState(false)
  const [contentModal, setContentModal] = useState(false)

  useEffect(() => {
    getAccounts()
    getPrice()
    setLoader(false)
    getCount()
    // getData()
  }, [])

  window.ethereum.addListener('connect', async (response) => {
    getAccounts()
  })

  window.ethereum.on('accountsChanged', () => {
    window.location.reload()
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })

  window.ethereum.on('disconnect', () => {
    window.location.reload()
  })

  const getCount = () => {
    ref.get().then(function (querySnapshot) {
      setCountData(querySnapshot.size)
    })
  }

  // const getData = () => {
  //   ref.onSnapshot((querySnapshot) => {
  //     const items = []
  //     querySnapshot.forEach((doc) => {
  //       items.push({"address": doc.data().address})
  //     })
  //     setTokens(items)
  //   })
  // }

  async function getAccounts() {
    // check if metamask o other exists
    if (typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(accounts)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(accounts[0])
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth)
    }
  }

  async function getPrice() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(address, Contract.abi, provider)
      try {
        const data = await contract.price()
        setPrice(data)
      } catch (error) {
        handleModal("error", error.message)
      }
    }
  }

  async function mint() {
    if (typeof window.ethereum !== 'undefined' && tokens.length > 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      let tab = []
      tokens.map((token) => tab.push(token.address))
      const leaves = tab.map((address) => keccak256(address))
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      const leaf = keccak256(accounts[0])
      const proof = tree.getHexProof(leaf)

      try {
        let overrides = {
          from: accounts[0],
          value: price,
        }
        const transaction = await contract.mintNft(
          accounts[0],
          proof,
          overrides,
        )
        await transaction.wait()
      } catch (error) {
        handleModal("error", error.message)
      }
    }
  }

  const handleModal = (title, content) => {
    setTitleModal(title)
    setContentModal(content)
    setModalShow(true)
  }

  return (
    <s.Screen>
      <s.Container ai="center" flex={1} bc="#36468e" style={{ paddingTop: 80 }}>
        {loader || !accounts ? (
          <s.TextTitle style={{ alignSelf: 'center' }}>
            Loading Web3, accounts, and contract...
          </s.TextTitle>
        ) : (
          <Routes>
            <Route path="/" element={<NavbarCustom accounts={accounts} />}>
              <Route index element={<Mint mint={mint} />} />
              <Route
                path="whitelist"
                element={
                  <AddWhitelist
                    countData={countData}
                    getCount={getCount}
                    balance={balance}
                    accounts={accounts}
                    handleModal={handleModal}
                  />
                }
              />
              <Route path="admin" element={<Admin handleModal={handleModal} />} />
            </Route>
          </Routes>
        )}
        <Modal
          modalShow={modalShow}
          setModalShow={setModalShow}
          title={titleModal}
          content={contentModal}
        />
      </s.Container>
    </s.Screen>
  )
}

export { ref }
export default App
