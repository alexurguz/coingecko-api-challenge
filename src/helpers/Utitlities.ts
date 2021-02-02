
const CryptoJS = require('crypto-js');

export default class Utilities {

    public static encryptPassword(text: string): string {
        const textEncrypted = CryptoJS.SHA512(text);
        return textEncrypted.toString();
    }
}
