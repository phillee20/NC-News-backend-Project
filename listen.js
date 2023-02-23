const app = require("./db/app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`listening on ${PORT}...`));
