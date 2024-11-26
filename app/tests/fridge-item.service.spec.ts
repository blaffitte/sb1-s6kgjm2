import 'reflect-metadata';
import { container } from 'tsyringe';
import { FridgeItemService } from '../core/services/fridge-item.service';
import { FridgeItemRepository } from '../core/repositories/fridge-item.repository';
import { IStorage } from '../core/interfaces/storage.interface';

describe('FridgeItemService', () => {
    let service: FridgeItemService;
    let mockStorage: jasmine.SpyObj<IStorage>;

    beforeEach(() => {
        mockStorage = jasmine.createSpyObj('IStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
        
        container.registerInstance('IStorage', mockStorage);
        container.register(FridgeItemRepository, {
            useClass: FridgeItemRepository
        });
        container.register(FridgeItemService, {
            useClass: FridgeItemService
        });

        service = container.resolve(FridgeItemService);
    });

    it('should get all items', async () => {
        const mockItems = [
            { id: '1', name: 'Milk', quantity: 1, expiryDate: new Date(), category: 'Dairy' }
        ];
        mockStorage.getItem.and.returnValue(Promise.resolve(mockItems));

        const items = await service.getAllItems();
        expect(items).toEqual(mockItems);
        expect(mockStorage.getItem).toHaveBeenCalled();
    });

    it('should add new item', async () => {
        const newItem = {
            id: '1',
            name: 'Milk',
            quantity: 1,
            expiryDate: new Date(),
            category: 'Dairy'
        };
        mockStorage.getItem.and.returnValue(Promise.resolve([]));
        await service.addItem(newItem);

        expect(mockStorage.setItem).toHaveBeenCalled();
    });

    it('should identify expired items', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        const mockItems = [
            { id: '1', name: 'Expired', quantity: 1, expiryDate: pastDate, category: 'Dairy' },
            { id: '2', name: 'Fresh', quantity: 1, expiryDate: futureDate, category: 'Dairy' }
        ];

        mockStorage.getItem.and.returnValue(Promise.resolve(mockItems));

        const expiredItems = await service.getExpiredItems();
        expect(expiredItems.length).toBe(1);
        expect(expiredItems[0].name).toBe('Expired');
    });
});