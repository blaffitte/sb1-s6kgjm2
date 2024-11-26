import { Observable } from '@nativescript/core';
import { injectable, inject } from 'tsyringe';
import { AuthService } from '../core/services/auth.service';
import { StorageManager } from '../core/storage/storage-manager';

@injectable()
export class SettingsViewModel extends Observable {
    private _useLocalStorage: boolean = true;
    private _useOneDrive: boolean = false;
    private _isAuthenticated: boolean = false;

    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(StorageManager) private storageManager: StorageManager
    ) {
        super();
        this.checkAuthStatus();
    }

    get useLocalStorage(): boolean {
        return this._useLocalStorage;
    }

    set useLocalStorage(value: boolean) {
        if (this._useLocalStorage !== value) {
            this._useLocalStorage = value;
            this.notifyPropertyChange('useLocalStorage', value);
            this.updateStorageType();
        }
    }

    get useOneDrive(): boolean {
        return this._useOneDrive;
    }

    set useOneDrive(value: boolean) {
        if (this._useOneDrive !== value) {
            this._useOneDrive = value;
            this.notifyPropertyChange('useOneDrive', value);
            this.updateStorageType();
        }
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    get canMigrate(): boolean {
        return this._isAuthenticated && this._useOneDrive;
    }

    private async checkAuthStatus() {
        const token = await this.authService.getToken();
        this._isAuthenticated = !!token;
        this.notifyPropertyChange('isAuthenticated', this._isAuthenticated);
        this.notifyPropertyChange('canMigrate', this.canMigrate);
    }

    async onLogin() {
        try {
            await this.authService.login();
            await this.checkAuthStatus();
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error (show alert, etc.)
        }
    }

    async onLogout() {
        try {
            await this.authService.logout();
            await this.checkAuthStatus();
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle error (show alert, etc.)
        }
    }

    private async updateStorageType() {
        if (this._useOneDrive && this._isAuthenticated) {
            await this.storageManager.switchToOneDrive();
        } else {
            await this.storageManager.switchToLocal();
        }
    }

    async onMigrateData() {
        try {
            await this.storageManager.migrateData();
            // Show success message
        } catch (error) {
            console.error('Migration failed:', error);
            // Show error message
        }
    }
}