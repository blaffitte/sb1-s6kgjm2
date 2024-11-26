import { injectable, inject } from 'tsyringe';
import { IStorage } from '../interfaces/storage.interface';
import { FridgeItem } from '../../models/fridge-item';

@injectable()
export class FridgeItemRepository {
    private readonly STORAGE_KEY = 'fridge_items';

    constructor(
        @inject('IStorage') private storage: IStorage
    ) {}

    async getAll(): Promise<FridgeItem[]> {
        const items = await this.storage.getItem<FridgeItem[]>(this.STORAGE_KEY);
        return items || [];
    }

    async add(item: FridgeItem): Promise<void> {
        const items = await this.getAll();
        items.push(item);
        await this.storage.setItem(this.STORAGE_KEY, items);
    }

    async update(item: FridgeItem): Promise<void> {
        const items = await this.getAll();
        const index = items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            items[index] = item;
            await this.storage.setItem(this.STORAGE_KEY, items);
        }
    }

    async delete(id: string): Promise<void> {
        const items = await this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        await this.storage.setItem(this.STORAGE_KEY, filteredItems);
    }
}