import Respository from "../../../domain/Repository";
import UseCase from "../../../domain/UseCase";
import User from "../../../domain/models/User";
import GetUserByUserNameUseCase from './GetUserByUserNameUseCase';
import UserNameExistError from '../../../domain/errors/UserNameExistError';

export default class SaveUserUseCase extends UseCase<any> {
    constructor(
        protected repository: Respository<any>,
        private getUserByUserNameUseCase: GetUserByUserNameUseCase
    ) {
        super(repository);
    }

    /**
     * Insert a user into the user collection
     * @author johnurbaguz
     * @date 2021-01-26
     * @param {object} userData - A object of user to register.
     * @returns {Promise<any>}
     * @memberof SaveUserUseCase
     */
    async exec(userData : User): Promise<any> {
        const user = await this.getUserByUserNameUseCase.exec(userData.userName);
        if (user) {
            throw new UserNameExistError(userData.userName);
        }
        await this.repository.exec(userData);
        const result = await this.getUserByUserNameUseCase.exec(userData.userName);
        return result;
    }
}