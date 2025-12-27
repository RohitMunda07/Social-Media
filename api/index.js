// import handler from "../Server/src/index.js";

// export default handler;


import { app } from "../Server/src/app.js";

export default function handler(req, res) {
  return app(req, res);
}
