export default():any=>({
    port: parseInt(process.env.PORT, 10) || 3000,
    authPrivateKey: process.env.AUTH_PRIVATE_KEY,
    customer: {
        host: process.env.CUSTOMER_HOST ||'127.0.0.1',
        port: parseInt(process.env.CUSTOMER_PORT, 10) || 3001
    },
    account: {
        host: process.env.ACCOUNT_HOST ||'127.0.0.1',
        port: parseInt(process.env.ACCOUNT_PORT, 10) || 3002
    }
});