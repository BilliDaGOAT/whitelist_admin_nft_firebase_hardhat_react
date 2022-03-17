import React from 'react'

const InfosAccount = ({ loader, accounts, balance }) => (
  <>
    {!loader && accounts.length > 0 ? (
      <>
        <p>Connected with {accounts[0]}</p>
        {balance && <p>Wallet Balance : {balance} ETH</p>}
        {balance < 0.3 && (
          <span className="infos">
            Not enough Eth on your account to be member of our whitelist
          </span>
        )}
      </>
    ) : (
      <p>Not Connected</p>
    )}
  </>
)

export default InfosAccount
