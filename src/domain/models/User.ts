/**
 * Class with user model
 *
 * @author jurbano
 * @since 2021-01-27
 */
export default class User {
    name: string;
    lastName: string;
    userName: string;
    password: string;
    favoriteMoney: string;

    constructor(
        name: string, lastName: string, 
        userName: string, password: string, favoriteMoney: string
    ) {
        this.name = name;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
        this.favoriteMoney = favoriteMoney;
    }

}
