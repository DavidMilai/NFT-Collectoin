// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  res.status(200),({
    tokenId:tokenId,
  });
}
