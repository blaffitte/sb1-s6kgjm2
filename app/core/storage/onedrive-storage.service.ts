import { injectable, inject } from 'tsyringe';
import { IStorage } from '../interfaces/storage.interface';
import { AuthService } from '../services/auth.service';
import { Client } from '@microsoft/microsoft-graph-client';

@injectable()
export class OneDriveStorageService implements IStorage {
    private client: Client;
    private readonly APP_FOLDER = '/apps/FridgeManager';

    constructor(@inject(AuthService) private authService: AuthService) {
        this.initializeClient();
    }

    private async initializeClient() {
        const token = await this.authService.getToken();
        if (!token) throw new Error('Not authenticated');

        this.client = Client.init({
            authProvider: (done) => {
                done(null, token);
            }
        });
    }

    private async ensureAppFolder(): Promise<void> {
        try {
            await this.client.api(this.APP_FOLDER).get();
        } catch {
            await this.client.api('/drive/special/approot').patch({
                name: 'FridgeManager'
            });
        }
    }

    async getItem<T>(key: string): Promise<T | null> {
        try {
            await this.ensureAppFolder();
            const response = await this.client
                .api(`${this.APP_FOLDER}/${key}.json`)
                .get();

            const content = await response.text();
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading from OneDrive:', error);
            return null;
        }
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            await this.ensureAppFolder();
            const content = JSON.stringify(value);
            
            await this.client
                .api(`${this.APP_FOLDER}/${key}.json:/content`)
                .put(content);
        } catch (error) {
            console.error('Error writing to OneDrive:', error);
            throw error;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await this.client
                .api(`${this.APP_FOLDER}/${key}.json`)
                .delete();
        } catch (error) {
            console.error('Error removing from OneDrive:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            const items = await this.client
                .api(`${this.APP_FOLDER}`)
                .get();

            for (const item of items.value) {
                await this.client
                    .api(`${this.APP_FOLDER}/${item.name}`)
                    .delete();
            }
        } catch (error) {
            console.error('Error clearing OneDrive storage:', error);
            throw error;
        }
    }
}