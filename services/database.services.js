// database.service.js

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "security";

const DatabaseService = {
    name: "database",

    settings: {
        uri,
        dbName
    },

    actions: {
        async storeSecurityInfo(ctx, data) {
            try {
                const { uri, dbName } = this.settings;
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();

                const db = client.db(dbName);
                const collection = db.collection("port_scans");

                const result = await collection.insertOne(data);
                console.log("Scan results inserted:", result.insertedId);

                await client.close();
                return "Scan results inserted successfully";
            } catch (error) {
                console.error('Error storing security info:', error);
                throw error;
            }
        }
    }
};

// Create service broker
const broker = new ServiceBroker({
    nodeID: "node-2",
    transporter: "NATS"
});

// Load database service
broker.createService(DataBaseService);

// Start broker
broker.start();
