import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers/UserResolver';
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

(async () => {
    const app = express();

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
        }),
    });

    apolloServer.applyMiddleware({ app });

    const port = process.env.APP_PORT || 4000;
    app.listen(port, () => {
        console.log(`Server started at port: ${port}`);
    })
})();
