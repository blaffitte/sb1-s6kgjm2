import { injectable, inject } from 'tsyringe';
import { FridgeItemRepository } from '../repositories/fridge-item.repository';
import { FridgeItem } from '../../models/fridge-item';

@injectable()
export class FridgeItemService {
    constructor(
        @inject(FridgeItemRepository) private repository: FridgeItemRepository
    ) {}

    async getAllItems(): Promise<FridgeItem[]> {
        return this.repository.getAll();
    }

    async addItem(item: FridgeItem): Promise<void> {
        await this.repository.add(item);
    }

    async updateItem(item: FridgeItem): Promise<void> {
        await this.repository.update(item);
    }

    async deleteItem(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async getExpiredItems(): Promise<FridgeItem[]> {
        const items = await this.repository.getAll();
        const now = new Date();
        return items.filter(item => new Date(item.expiryDate) < now);
    }

    async getItemsNearingExpiry(daysThreshold: number = 3): Promise<FridgeItem[]> {
        const items = await this.repository.getAll();
        const now = new Date();
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + daysThreshold);

        return items.filter(item => {
            const expiryDate = new Date(item.expiryDate);
            return expiryDate > now && expiryDate <= threshold;
        });
    }
}