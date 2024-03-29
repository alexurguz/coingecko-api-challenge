import UseCase from "../../../domain/UseCase";
import UserNotFoundError from "../../../domain/errors/UserNotFoundError";

export default class AuthUseCase extends UseCase<any> {
    async exec(authData: any): Promise<any> {
        console.log('AuthUseCase::exec',authData);
        const user = await this.repository.exec(authData);

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    }
}
