// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;

  const name = "Crypto dev #${tokenId}";

  const description = "CryptoDevs is an NFT collection woe Web3 Devs";

  const image = "https://github.com/LearnWeb3DAO/NFT-Collection/blob/main/my-app/public/cryptodevs/${Number(tokenId) - 1}.svg";


  return res.json({
    name: name,
    description: description,
    image: image,
  });
}
