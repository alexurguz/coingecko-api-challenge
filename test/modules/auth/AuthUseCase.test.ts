import LoadEnv from '../../../src/helpers/LoadEnv';
import { Db } from "mongodb";
import Database from '../../../src/datasource/database';
import AuthRepository from '../../../src/modules/auth/repository/AuthRepository';
import AuthUseCase from '../../../src/modules/auth/use-case/AuthUseCase';

describe('Test User authorization', () => {
    let database: Database<Db>;
    let authRepository: AuthRepository;
    let authUseCase: AuthUseCase;

    beforeAll(() => {
        authRepository = new AuthRepository(database);
        authUseCase = new AuthUseCase(authRepository);
    });

    test('Authorization is success when data is correct', async () => {
        try {
            // Arrange
            const user = {
                userName: 'jurbano',
                password: '12345678'
            }

            // Act
            const result = await authUseCase.exec(user);

            // Assert
            expect(result.token).toBeDefined();
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
            expect(result.token).toBeUndefined();
        } catch (error) {
            expect(error).not.toBeNull();
        }
    });
});
