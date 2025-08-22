let HOST;
if (process.env.NODE_ENV == 'production') {
    HOST = 'https://dises2-93fb98d8241f.herokuapp.com/'
} else {
    HOST = 'http://localhost:3000/'
}

export default HOST