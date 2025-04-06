

import {app} from "./app";
import connectToDB from "./db/db";
import {logger} from "./utils/winstonLogger";
const PORT=process.env.PORT||3000;

connectToDB();

app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`);
})