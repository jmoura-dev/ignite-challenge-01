import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./middlewares/routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  });

  try {
    if (!route) {
      throw new Error("Rota http não encontrada")
    }
    if (route) {
      const routeParams = req.url.match(route.path)

      req.params = { ...routeParams.groups }

      return route.handler(req, res);
    }

  } catch (error) {
    console.error(error);

    return res.writeHead(404).end("Rota não encontrada");
  }

});

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
});