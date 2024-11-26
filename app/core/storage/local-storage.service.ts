import { IStorage } from '../interfaces/storage.interface';
import { injectable } from 'tsyringe';

@injectable()
export class LocalStorageService implements IStorage {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to storage:', error);
            throw error;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from storage:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
}