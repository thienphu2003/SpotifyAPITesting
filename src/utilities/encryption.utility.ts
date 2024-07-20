import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class Encryption {
    static async generateHash(
        password: string,
        saltRounds: number,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(
                password,
                saltRounds,
                (err: any, hash: string) => {
                    if (!err) {
                        resolve(hash);
                    }
                    reject(err);
                },
            );
        });
    }

    static async verifyHash(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static async generateToken(key: string, value: string) {}

    static async verifyCookie(token: string): Promise<any> {}
}
