const bcrypt = require('bcrypt');


bcrypt.hash('admin123',10)
.then(password=>{
    console.log(password);
});