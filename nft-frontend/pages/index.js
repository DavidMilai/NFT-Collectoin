import Head from "next/head";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_APBI } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const web3ModalRef = useRef();

  const getOwner = async () => {
    const signer = await getProviderOrSigner(true);

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_APBI,
      signer
    );

    const owner = nftContract.owner();

    const userAddress = signer.getAddress();

    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      setIsOwner(true);
    }
  };

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_APBI,
        signer
      );

      const txn = await nftContract.startPresale();
      await txn.wait();

      setPresaleStarted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfPresaleEnded = async ()=>{
    try{}
    catch(err){
      console.log(err);
    }
  }

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_APBI,
        provider
      );

      const isPresaleStarted = await nftContract.presaleStarted();

      setPresaleStarted(isPresaleStarted);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    getProviderOrSigner();
    setWalletConnected(true);
  };

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();

      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();

      if (chainId != 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      checkIfPresaleStarted();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>
        {!walletConnected ? (
          <button onClick={connectWallet} className={styles.button}>
            connect Wallet{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
}
