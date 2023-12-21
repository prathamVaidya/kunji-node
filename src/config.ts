const isTestEnv = process.env.NODE_ENV === 'test'

// for other envs
let config = {
    JWT_TOKEN_ISSUER_NAME: 'kunji'
}

// only for test
if(isTestEnv){
    config = {
        JWT_TOKEN_ISSUER_NAME: 'kunji-test-issuer'
    }
}

export default config