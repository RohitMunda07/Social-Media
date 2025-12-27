// import handler from "../Server/src/index.js";

// export default handler;


export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "Serverless entry working",
    node: process.version
  });
}
