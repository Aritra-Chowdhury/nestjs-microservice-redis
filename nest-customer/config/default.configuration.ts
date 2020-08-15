export default ():any =>({
    port: parseInt(process.env.PORT, 10) || 3001,
    authPrivateKey : process.env.AUTH_PRIVATE_KEY,
    database: {
        userName : process.env.DATABASE_USERNAME,
        password : process.env.DATABASE_PASSWORD,
        dbName : process.env.DATABASE_NAME || "customer"
  }
});