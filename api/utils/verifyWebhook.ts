import crypto from "crypto" 


function verify(secrethash: any, signature: string): boolean {
    return secrethash === signature;
}
export default verify