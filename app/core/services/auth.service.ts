import { injectable, inject } from 'tsyringe';
import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { IStorage } from '../interfaces/storage.interface';

@injectable()
export class AuthService {
    private msalConfig: Configuration = {
        auth: {
            clientId: '3b3c0d1e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
            authority: 'https://login.microsoftonline.com/common',
            redirectUri: 'msauth://com.fridgemanager.app/callback'
        },
        cache: {
            cacheLocation: 'localStorage'
        }
    };

    private msalInstance: PublicClientApplication;
    private readonly TOKEN_KEY = 'onedrive_token';

    constructor(@inject('IStorage') private storage: IStorage) {
        this.msalInstance = new PublicClientApplication(this.msalConfig);
    }

    async login(): Promise<AuthenticationResult> {
        try {
            const result = await this.msalInstance.loginPopup({
                scopes: ['Files.ReadWrite.AppFolder']
            });
            await this.storage.setItem(this.TOKEN_KEY, result);
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.msalInstance.logout();
            await this.storage.removeItem(this.TOKEN_KEY);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }

    async getToken(): Promise<string | null> {
        try {
            const authResult = await this.storage.getItem<AuthenticationResult>(this.TOKEN_KEY);
            if (!authResult) return null;

            if (this.isTokenExpired(authResult)) {
                const newResult = await this.msalInstance.acquireTokenSilent({
                    scopes: ['Files.ReadWrite.AppFolder'],
                    account: authResult.account
                });
                await this.storage.setItem(this.TOKEN_KEY, newResult);
                return newResult.accessToken;
            }

            return authResult.accessToken;
        } catch (error) {
            console.error('Get token failed:', error);
            return null;
        }
    }

    private isTokenExpired(authResult: AuthenticationResult): boolean {
        return authResult.expiresOn.getTime() <= new Date().getTime();
    }
}