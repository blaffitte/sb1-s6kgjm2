import { Observable, ObservableArray } from '@nativescript/core';
import { FridgeItem } from '../models/fridge-item';
import { container } from 'tsyringe';
import { FridgeItemService } from '../core/services/fridge-item.service';

export class HomeViewModel extends Observable {
    private _items: ObservableArray<FridgeItem>;
    private _categories = ['Produits laitiers', 'Légumes', 'Fruits', 'Viandes', 'Boissons', 'Autres'];
    private itemService: FridgeItemService;

    constructor() {
        super();
        this._items = new ObservableArray<FridgeItem>();
        this.itemService = container.resolve(FridgeItemService);
        this.loadItems();
    }

    private async loadItems() {
        try {
            const items = await this.itemService.getAllItems();
            this._items.splice(0);
            items.forEach(item => this._items.push(item));
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }

    get items(): ObservableArray<FridgeItem> {
        return this._items;
    }

    get categories(): string[] {
        return this._categories;
    }

    async addItem(item: FridgeItem) {
        try {
            await this.itemService.addItem(item);
            this._items.push(item);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    async removeItem(id: string) {
        try {
            await this.itemService.deleteItem(id);
            const index = this._items.findIndex(item => item.id === id);
            if (index !== -1) {
                this._items.splice(index, 1);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    async updateItem(updatedItem: FridgeItem) {
        try {
            await this.itemService.updateItem(updatedItem);
            const index = this._items.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                this._items.setItem(index, updatedItem);
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }
}