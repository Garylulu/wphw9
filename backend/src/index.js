
// import GraphQL server
import server from './server'

// import MongoDB connection
import mongo from './mongo'

mongo.connect();
const port = process.env.PORT || 4000;
server.listen({port}, () => {
 console.log(`Listening on http://localhost:${port}`);
});