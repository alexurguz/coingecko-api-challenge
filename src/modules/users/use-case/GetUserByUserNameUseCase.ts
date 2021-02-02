import UseCase from "../../../domain/UseCase";

export default class GetUserByUserNameUseCase extends UseCase<any> {
    async exec(userName: string): Promise<any> {
        const user = await this.repository.exec(userName);
        return user;
    }
}
