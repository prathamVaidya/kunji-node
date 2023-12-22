export const decodeBase64 = (base64Token : string) => {
    try {
        return atob(base64Token);
    } catch (error) {
        throw new Error('Kunji Error: Public Key is Invalid. It should be Base 64 Encoded')
    }
}