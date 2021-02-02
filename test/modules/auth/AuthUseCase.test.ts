import LoadEnv from '../../../src/helpers/LoadEnv';
import Database from '../../../src/datasource/database';
import MongoDatabase from '../../../src/datasource/database/mongo';
import AuthRepository from '../../../src/modules/auth/repository/AuthRepository';
import AuthUseCase from '../../../src/modules/auth/use-case/AuthUseCase';
import SaveUserMongodb from '../../../src/modules/users/repository/SaveUserMongodb';
import SaveUserUseCase from '../../../src/modules/users/use-case/SaveUserUseCase';
import GetUserByUserNameMongodb from '../../../src/modules/users/repository/GetUserByUserNameMongodb';
import GetUserByUserNameUseCase from '../../../src/modules/users/use-case/GetUserByUserNameUseCase';

describe('Test User authorization', () => {

    let database: Database<any>;
    let authRepository: AuthRepository;
    let authUseCase: AuthUseCase;
    let saveUserRepository: SaveUserMongodb;
    let saveUserUseCase: SaveUserUseCase;
    let getUserByUserNameMongodb: GetUserByUserNameMongodb;
    let getUserByUserNameUseCase: GetUserByUserNameUseCase;

    const randomstring = require("randomstring");
    const userName = randomstring.generate({
        length: 12,
        charset: 'alphanumeric'
    });

    const user = {
        name: 'Johnatan',
        lastName: 'Urbano',
        userName: userName,
        password: '12345678',
        favoriteMoney: 'ars'
    }

    async function registerUser(database: any){
        getUserByUserNameMongodb = new GetUserByUserNameMongodb(database);
        getUserByUserNameUseCase = new GetUserByUserNameUseCase(getUserByUserNameMongodb);
        saveUserRepository = new SaveUserMongodb(database);
        saveUserUseCase = new SaveUserUseCase(saveUserRepository, getUserByUserNameUseCase);
        await saveUserUseCase.exec(user);
    }

    beforeAll(async() => {
        database = new MongoDatabase();
        await database.connect();
        authRepository = new AuthRepository(database);
        authUseCase = new AuthUseCase(authRepository);

        await registerUser(database);
    });

    test('Authorization is success when data is correct', async () => {
        try {
            // Arrange
            const userAuth = {
                userName: user.userName,
                password: user.password
            }

            // Act
            const result = await authUseCase.exec(userAuth);

            // Assert
            expect(result.userName).toEqual(user.userName);
        } catch (error) {
            expect(error).toBeNull();
        }
    });

    test('Authorization is failed when data is wrong', async () => {
        try {
            // Arrange
            const user = {
                userName: 'jurbano',
                password: '12345678d'
            }

            // Act
            const result = await authUseCase.exec(user);

            // Assert
            expect(result.userName).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
