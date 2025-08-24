let HOST;
if (process.env.NODE_ENV == 'production') {
    HOST = 'https://disesh2-a562763cdb35.herokuapp.com'
} else {
    HOST = 'http://localhost:3000'
}

export default HOST