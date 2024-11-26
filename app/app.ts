import 'reflect-metadata';
import { Application } from '@nativescript/core';
import { container } from 'tsyringe';
import { FileStorageService } from './core/storage/file-storage.service';
import { FridgeItemRepository } from './core/repositories/fridge-item.repository';
import { FridgeItemService } from './core/services/fridge-item.service';
import { TestDataService } from './core/services/test-data.service';
import { AuthService } from './core/services/auth.service';
import { OneDriveStorageService } from './core/storage/onedrive-storage.service';
import { StorageManager } from './core/storage/storage-manager';

// Register dependencies
container.register('IStorage', {
    useClass: FileStorageService
});
container.register(FridgeItemRepository, {
    useClass: FridgeItemRepository
});
container.register(FridgeItemService, {
    useClass: FridgeItemService
});
container.register(TestDataService, {
    useClass: TestDataService
});
container.register(AuthService, {
    useClass: AuthService
});
container.register(OneDriveStorageService, {
    useClass: OneDriveStorageService
});
container.register(StorageManager, {
    useClass: StorageManager
});

// Initialize test data
const testDataService = container.resolve(TestDataService);
testDataService.initializeTestData().catch(console.error);

Application.run({ moduleName: 'app-root' });