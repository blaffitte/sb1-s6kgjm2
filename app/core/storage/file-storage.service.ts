import { Injectable } from 'tsyringe';
import { IStorage } from '../interfaces/storage.interface';
import { File, Folder, knownFolders, path } from '@nativescript/core';

@Injectable()
export class FileStorageService implements IStorage {
    private readonly dataFolder: Folder;
    
    constructor() {
        this.dataFolder = knownFolders.documents();
        this.ensureDataFolderExists();
    }

    private ensureDataFolderExists(): void {
        const fridgeDataPath = path.join(this.dataFolder.path, 'fridge-data');
        if (!Folder.exists(fridgeDataPath)) {
            Folder.fromPath(fridgeDataPath);
        }
    }

    private getFilePath(key: string): string {
        return path.join(this.dataFolder.path, 'fridge-data', `${key}.json`);
    }

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const filePath = this.getFilePath(key);
            if (!File.exists(filePath)) {
                return null;
            }

            const file = File.fromPath(filePath);
            const content = await file.readText();
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            const file = File.fromPath(filePath);
            const content = JSON.stringify(value, null, 2);
            await file.writeText(content);
        } catch (error) {
            console.error('Error writing file:', error);
            throw error;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            if (File.exists(filePath)) {
                const file = File.fromPath(filePath);
                await file.remove();
            }
        } catch (error) {
            console.error('Error removing file:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            const fridgeDataPath = path.join(this.dataFolder.path, 'fridge-data');
            if (Folder.exists(fridgeDataPath)) {
                const folder = Folder.fromPath(fridgeDataPath);
                const entities = await folder.getEntities();
                
                for (const entity of entities) {
                    if (entity instanceof File) {
                        await entity.remove();
                    }
                }
            }
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
}