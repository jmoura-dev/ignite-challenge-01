import http from "node:http";

const server = http.createServer((req, res) => {

});

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
});