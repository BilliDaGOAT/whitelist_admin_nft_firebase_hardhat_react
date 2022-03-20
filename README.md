Projet NFT pour me familiariser avec les whitelists, son administration sur firebase.  
Projet réaliser avec HardHat et React.  
Manque le fichier .src/Firebase.js car contient des données sensibles.

## Les commandes utilisés :
```
npx create-react-app whitelist_admin_nft_firebase_hardhat_react
npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers
npm i @openzeppelin/contracts merkletreejs keccak256
changer version react-script en 4.0.3, car dans la v5, pas de buffer (indispensable pour keccak).
npx hardhat
```
## Déploiement :
```
npx hardhat node
npx hardhat run .\scripts\deploy.js --network hardhat
```