const config = {
    server:{
        default: {
            port:3000,
            createAdmin: true
        },
        development: {
            port:3000,
            createAdmin: true
        },
        production:{
            port:8080
        }
    },
    mongo:{
        default:{
            url:'mongodb://localhost/nnxt',
            useMongoClient:true
        }
    }
}

export default config