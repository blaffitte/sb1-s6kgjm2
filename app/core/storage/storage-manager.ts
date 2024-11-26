import { injectable, inject } from 'tsyringe';
import { IStorage } from '../interfaces/storage.interface';
import { FileStorageService } from './file-storage.service';
import { OneDriveStorageService } from './onedrive-storage.service';

@injectable()
export class StorageManager {
    private currentStorage: IStorage;

    constructor(
        @inject(FileStorageService) private localStorage: FileStorageService,
        @inject(OneDriveStorageService) private oneDriveStorage: OneDriveStorageService
    ) {
        this.currentStorage = localStorage;
    }

    async switchToOneDrive(): Promise<void> {
        this.currentStorage = this.oneDriveStorage;
    }

    async switchToLocal(): Promise<void> {
        this.currentStorage = this.localStorage;
    }

    async migrateData(): Promise<void> {
        const fromStorage = this.localStorage;
        const toStorage = this.oneDriveStorage;

        // Migrate fridge items
        const items = await fromStorage.getItem('fridge_items');
        if (items) {
            await toStorage.setItem('fridge_items', items);
        }

        // Add other data migrations here if needed
    }

    getCurrentStorage(): IStorage {
        return this.currentStorage;
    }
}