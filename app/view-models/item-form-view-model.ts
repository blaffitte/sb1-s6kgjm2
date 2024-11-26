import { Observable } from '@nativescript/core';
import { FridgeItem } from '../models/fridge-item';

export class ItemFormViewModel extends Observable {
    private _categories = ['Produits laitiers', 'Légumes', 'Fruits', 'Viandes', 'Boissons', 'Autres'];
    private _id: string;
    private _name: string = '';
    private _quantity: number = 1;
    private _expiryDate: Date = new Date();
    private _selectedCategoryIndex: number = 0;
    private _isEditing: boolean = false;
    private _validationErrors: { [key: string]: string } = {};

    constructor(item?: FridgeItem) {
        super();

        if (item) {
            this._id = item.id;
            this._name = item.name;
            this._quantity = item.quantity;
            this._expiryDate = new Date(item.expiryDate);
            this._selectedCategoryIndex = this._categories.indexOf(item.category);
            this._isEditing = true;
        } else {
            this._id = Date.now().toString();
            this.initializeExpiryDate();
        }
    }

    initializeExpiryDate() {
        if (!this._isEditing) {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            this._expiryDate = date;
            this.notifyPropertyChange('expiryDate', this._expiryDate);
        }
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (this._name !== value) {
            this._name = value;
            this.notifyPropertyChange('name', value);
            this.validateName();
        }
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        if (this._quantity !== value) {
            this._quantity = value;
            this.notifyPropertyChange('quantity', value);
            this.validateQuantity();
        }
    }

    get expiryDate(): Date {
        return this._expiryDate;
    }

    set expiryDate(value: Date) {
        if (this._expiryDate !== value) {
            this._expiryDate = value;
            this.notifyPropertyChange('expiryDate', value);
            this.validateExpiryDate();
        }
    }

    get categories(): string[] {
        return this._categories;
    }

    get selectedCategoryIndex(): number {
        return this._selectedCategoryIndex;
    }

    set selectedCategoryIndex(value: number) {
        if (this._selectedCategoryIndex !== value) {
            this._selectedCategoryIndex = value;
            this.notifyPropertyChange('selectedCategoryIndex', value);
        }
    }

    get isEditing(): boolean {
        return this._isEditing;
    }

    get validationErrors(): { [key: string]: string } {
        return this._validationErrors;
    }

    clearValidationError(fieldId: string) {
        if (this._validationErrors[fieldId]) {
            delete this._validationErrors[fieldId];
            this.notifyPropertyChange('validationErrors', this._validationErrors);
        }
    }

    private validateName(): boolean {
        if (!this._name || this._name.trim().length === 0) {
            this._validationErrors.name = "Le nom est requis";
            this.notifyPropertyChange('validationErrors', this._validationErrors);
            return false;
        }
        delete this._validationErrors.name;
        this.notifyPropertyChange('validationErrors', this._validationErrors);
        return true;
    }

    private validateQuantity(): boolean {
        if (isNaN(this._quantity) || this._quantity <= 0) {
            this._validationErrors.quantity = "La quantité doit être supérieure à 0";
            this.notifyPropertyChange('validationErrors', this._validationErrors);
            return false;
        }
        delete this._validationErrors.quantity;
        this.notifyPropertyChange('validationErrors', this._validationErrors);
        return true;
    }

    private validateExpiryDate(): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (this._expiryDate < today) {
            this._validationErrors.expiryDate = "La date d'expiration ne peut pas être dans le passé";
            this.notifyPropertyChange('validationErrors', this._validationErrors);
            return false;
        }
        delete this._validationErrors.expiryDate;
        this.notifyPropertyChange('validationErrors', this._validationErrors);
        return true;
    }

    validate(): boolean {
        const nameValid = this.validateName();
        const quantityValid = this.validateQuantity();
        const expiryValid = this.validateExpiryDate();
        
        return nameValid && quantityValid && expiryValid;
    }

    getItem(): FridgeItem {
        return {
            id: this._id,
            name: this._name.trim(),
            quantity: this._quantity,
            expiryDate: this._expiryDate,
            category: this._categories[this._selectedCategoryIndex]
        };
    }
}