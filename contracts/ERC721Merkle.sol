// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

/// @title ERC721 Merkle Tree Whitelist
/// @author cd33
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Merkle is ERC721, Ownable {
    bytes32 merkleRoot;
    uint public price = 0.3 ether;
    uint tokenId = 1;

    constructor(bytes32 _merkleRoot) ERC721("CD33", "CDD") {
        merkleRoot = _merkleRoot;
    }

    /**
    * @notice Change Merkle root to update the whitelist
    * @param _merkleRoot Merkle Root
    **/
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
    * @notice Return true or false if the account is whitelisted or not
    * @param _account User's account
    * @param _proof Merkle Proof
    * @return bool Account whitelisted or not
    **/
    function _isWhiteListed(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        return _verify(_leafHash(_account), _proof);
    }

    /**
    * @notice Return the account hashed
    * @param _account Account to hash
    * @return bytes32 Account hashed
    **/
    function _leafHash(address _account) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    /** 
    * @notice Returns true if a leaf can be proven to be part of a Merkle tree defined by root
    * @param _leaf Leaf
    * @param _proof Merkle Proof
    * @return bool Be part of the Merkle tree or not
    **/
    function _verify(bytes32 _leaf, bytes32[] memory _proof) internal view returns(bool) {
        return MerkleProof.verify(_proof, merkleRoot, _leaf);
    }
}