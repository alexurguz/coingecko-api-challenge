type Populate = {
    CONCURRENCY: number;
    DELAY: number;
};

type Paging = {
    DEFAULT_LIMIT: number;
    MAX_LIMIT?: number;
    DEFAULT_OFFSET: number;
};

export default class Constants {
    public static MY_API_PAGING: Paging = {
        DEFAULT_LIMIT: 20,
        DEFAULT_OFFSET: 0
    };

    public static POPULATE_COINS: Populate = {
        CONCURRENCY: 1,
        DELAY: 700
    };

    public static ORDER_BY: any = {
        asc: 1,
        desc: -1
    };

    public static QUOTE_CURRENCY_ALLOWED: any = ['ars','usd','eur'];

    public static TOKEN_JWT_EXPIRES: number = 60 * 60;
}