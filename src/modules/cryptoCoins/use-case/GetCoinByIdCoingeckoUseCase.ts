import UseCase from "../../../domain/UseCase";

export default class GetCoinByIdCoingeckoUseCase extends UseCase<any> {
    async exec( coinId: string ): Promise<Array<string>> {
        let coins = Array<any>();
        coins = await this.repository.exec( coinId );
        return coins;
    }
}
