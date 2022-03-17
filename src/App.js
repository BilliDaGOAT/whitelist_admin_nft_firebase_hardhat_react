import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import InfosAccount from './components/InfosAccount'
import firebase from './Firebase'
import AddWhitelist from './components/AddWhitelist'

const ref = firebase.firestore().collection('whitelist')

function App() {
  const [countData, setCountData] = useState(0)
  const [loader, setLoader] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getAccounts()
    setLoader(false)
    getCount()
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

  async function getAccounts() {
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

  return (
    <div className="App">
      {error && <p className="alert error">{error}</p>}
      {success && <p className="alert success">{success}</p>}
      <InfosAccount loader={loader} accounts={accounts} balance={balance} />

      <AddWhitelist
        countData={countData}
        getCount={getCount}
        balance={balance}
        accounts={accounts}
        setError={setError}
        setSuccess={setSuccess}
      />
    </div>
  )
}

export { ref }
export default App
