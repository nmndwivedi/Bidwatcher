// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const streamId = req.query.id;
    const userAddress = req.body && req.body.userAddress;

    try {
      const doesRequesterOwnNFT = await axios.post(
        "https://api.thegraph.com/subgraphs/name/nmndwivedi/bidwatcher",
        {
          query: `{
                            tokens {
                              tokenId
                              bidders {
                                id
                              }
                            }
                          }`,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      // res.end({data: doesRequesterOwnNFT.data});

      if (doesRequesterOwnNFT && doesRequesterOwnNFT.data) {
        const searchToken = (t) => {
          return t.tokenId === streamId;
        };

        const searchedToken =
          doesRequesterOwnNFT.data.data.tokens.find(searchToken);

        const checkUsername = (obj) => {
          return (
            obj.id.toLowerCase().trim().slice(0, 10) ===
            userAddress.toLowerCase().trim().slice(0, 10)
          );
        };

        const valid = searchedToken?.bidders.some(checkUsername);

        if (valid) {
          res.statusCode = 200;
          res.json({
            livestreamUrl:
              "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8",
          });
        } else {
          res.statusCode = 403;
          res.json({
            error: "You do not own this token",
          });
        }
      } else {
        res.statusCode = 403;
        res.json({
          error: "You do not own this token",
        });
      }
      //    res.end({data: "You do not own this token"});
    } catch (error) {
      res.statusCode = 500;
      console.log(error);
    }
  }
}
