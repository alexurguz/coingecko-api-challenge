import UseCase from "../../../domain/UseCase";

export default class GetUserByIdUseCase extends UseCase<any> {
    async exec(id: string): Promise<any> {
        console.log('GetUserByIdUseCase::exec::id',id)
        const user = await this.repository.exec(id);
        return user;
    }
}
