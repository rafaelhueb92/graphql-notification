const express = require("express");
const bodyParser = require("body-parser-graphql");
const cors = require("cors");
const { schema } = require("./graphql/schemas/produto");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

const PORT = 4000;
const app = express();

const server = new ApolloServer({
  schema
});

app.use("*", cors({ origin: `http://localhost:3000` }));
app.use("/graphql", bodyParser.graphql());

server.applyMiddleware({
  app
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${
      server.subscriptionsPath
    }`
  );
});
