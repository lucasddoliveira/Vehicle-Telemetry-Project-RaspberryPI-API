const createtxtWriter = require('fs')

const maketxt = async (name, text) => {

   await createtxtWriter.write(name, text)
}

module.exports = maketxt