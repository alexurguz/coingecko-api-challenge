/**
 * Class with user model
 *
 * @author jurbano
 * @since 2021-01-27
 */
export default class UserCoin {
    userId: string;
    coinId: string;

    constructor(
        userId: string, coinId: string,
    ) {
        this.userId = userId;
        this.coinId = coinId;
    }
}
