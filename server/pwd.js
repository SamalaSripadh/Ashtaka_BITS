const bcrypt = require('bcryptjs');
const password = "bits@ad1";
bcrypt.hash(password, 10).then(hash => console.log(hash));