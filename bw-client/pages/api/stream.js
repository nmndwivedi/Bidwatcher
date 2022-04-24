// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const authorizationHeader = req.headers && req.headers["authorization"];
        const streamName = req.body && req.body.name;
        const streamProfiles = [
            {
              "name": "720p",
              "bitrate": 2000000,
              "fps": 30,
              "width": 1280,
              "height": 720
            },
            {
              "name": "480p",
              "bitrate": 1000000,
              "fps": 30,
              "width": 854,
              "height": 480
            },
            {
              "name": "360p",
              "bitrate": 500000,
              "fps": 30,
              "width": 640,
              "height": 360
            }
          ];

        try {
          const createStreamResponse = await axios.post(
            "https://livepeer.com/api/stream",
            {
              name: streamName,
              profiles: streamProfiles,
            },
            {
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`, // API Key needs to be passed as a header
              },
            }
          );

          if (createStreamResponse && createStreamResponse.data) {
            res.statusCode = 200;
            res.json({ ...createStreamResponse.data });
          } else {
            res.statusCode = 500;
            res.json({ error: "Something went wrong" });
          }
        } catch (error) {
          res.statusCode = 500;

          // Handles Invalid API key error
          if (error.response.status === 403) {
            res.statusCode = 403;
          }
          res.json({ error });
        }
      }

      else if (req.method === "DELETE") {
        const streamId = req.body && req.body.id

        try {
          const delStreamResponse = await axios.delete(
            `https://livepeer.com/api/stream/${streamId}`,
            {},
            {
              headers: {
                authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`, // API Key needs to be passed as a header
              },
            }
          );

          if (delStreamResponse) {
            res.statusCode = 204;
            res.json({ message: "Stream deleted" });
          } else {
            res.statusCode = 500;
            res.json({ error: "Something went wrong" });
          }
        } catch (error) {
          res.statusCode = 500;

          // Handles Invalid API key error
          if (error.response.status === 403) {
            res.statusCode = 403;
          }
          res.json({ error });
        }
      }
}
