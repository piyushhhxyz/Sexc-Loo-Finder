const { default: mongoose } = require("mongoose")
require("dotenv").config()

exports.dbConnect = async() => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(console.log('DB Connection Successfull'))
        .catch(e => {
            console.log('Failed DB Connection')
            console.error(e.message)
            process.exit(1)
        })
}