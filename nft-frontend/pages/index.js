import Head from "next/head";
import { providers, Contract, utils } from "ethers";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import { NFT_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  const web3ModalRef = useRef();

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const owner = await nftContract.owner();

      console.log("Owner is ", owner);

      const userAddress = await signer.getAddress();

      console.log("address is ", userAddress);

      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const txn = await nftContract.startPresale();
      await txn.wait();

      setPresaleStarted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      const presaleEndTime = await nftContract.presaleEnded();

      const currentTimeInSeconds = Date.now() / 1000;

      const hasPresaleEnded = presaleEndTime.lt(
        Math.floor(currentTimeInSeconds)
      );

      setPresaleEnded(hasPresaleEnded);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      const isPresaleStarted = await nftContract.presaleStarted();

      setPresaleStarted(isPresaleStarted);

      return isPresaleStarted;
    } catch (err) {
      console.log(err);
      return false;
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

  const onPageLoad = async () => {
    await connectWallet();
    await getOwner();
    const presaleStarted = await checkIfPresaleStarted();

    if (presaleStarted) {
      await checkIfPresaleEnded();
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, []);

  const preSaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const txn = await nftContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      await txn.wait();
      window.alert("You successfully minted a cryptodev!");
    } catch (error) {
      console.log(error);
    }
  };

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const txn = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      await txn.wait();
      window.alert("You successfully minted a cryptodev!");
    } catch (error) {
      console.log(error);
    }
  };

  function renderBody() {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          connect Wallet
        </button>
      );
    }

    if (loading) {
      return <span className={styles.description}>Loading...</span>;
    }

    if (isOwner && !presaleStarted) {
      return (
        <button onClick={startPresale} className={styles.button}>
          Start Presale
        </button>
      );
    }

  if (!presaleStarted) {
    return (
         <div>
          <span className={styles.description}>
            Presale hasn't started come back later
          </span>
        </div> 
    );
  }

  if (presaleEnded && !presaleEnded) {
    return (
      <div>
        <span className={styles.description}>
          Presale has started! if your address has started, you can mint a
          cryptodev
        </span>
        <button onClick={preSaleMint} className={styles.button}>
          Presale Mint
        </button>
      </div>
    );
  }

  if (presaleEnded) {
    return (
      <div>
        <span className={styles.description}>
          Presale has ended, you can mint a Cryptodev in public sale, if any
          remain
        </span>
        <button onClick={publicMint} className={styles.button}>
          Public Mint
        </button>
      </div>
    );
  }
}

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to CryptoDevs NFT</h1>
          <span className={styles.description}>
            This is a collection for devs in WEB3
          </span>
          {renderBody()}
        </div>
        <img className={styles.image} src="/cryptodevs/0.svg" />
      </div>
      <footer className={styles.footer}>Made with &#10084; by SuperM</footer>
    </div>
  );
}
