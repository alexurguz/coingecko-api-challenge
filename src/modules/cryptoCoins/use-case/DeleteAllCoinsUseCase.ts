import UseCase from "../../../domain/UseCase";

export default class DeleteAllCoinsUseCase extends UseCase<any> {

    /**
     * Delete all collection coins
     * @author johnurbaguz
     * @date 2021-01-30
     * @param {object} userData - A object of user to register.
     * @returns {Promise<any>}
     * @memberof DeleteAllCoinsUseCase
     */
    async exec(): Promise<any> {
        const result = await this.repository.exec();
        return result;
    }
}