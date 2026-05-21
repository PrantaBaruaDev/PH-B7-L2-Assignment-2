import app from "./app";
import { config } from "./config";
import { initDB } from "./database";

const main = async () => {
    await initDB();
    app.listen(config.port, () => {
        console.log(`Server listening on port ${config.port}`)
    });
}

main();