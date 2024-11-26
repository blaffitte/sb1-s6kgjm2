import { injectable } from 'tsyringe';
import { FridgeItemService } from './fridge-item.service';
import { FridgeItem } from '../../models/fridge-item';

@injectable()
export class TestDataService {
    constructor(private fridgeService: FridgeItemService) {}

    async initializeTestData(): Promise<void> {
        const today = new Date();
        const testItems: FridgeItem[] = [
            {
                id: '1',
                name: 'Lait entier',
                quantity: 2,
                expiryDate: this.addDays(today, 5),
                category: 'Produits laitiers'
            },
            {
                id: '2',
                name: 'Yaourt nature',
                quantity: 6,
                expiryDate: this.addDays(today, 10),
                category: 'Produits laitiers'
            },
            {
                id: '3',
                name: 'Tomates',
                quantity: 4,
                expiryDate: this.addDays(today, 4),
                category: 'Légumes'
            },
            {
                id: '4',
                name: 'Carottes',
                quantity: 8,
                expiryDate: this.addDays(today, 7),
                category: 'Légumes'
            },
            {
                id: '5',
                name: 'Pommes',
                quantity: 6,
                expiryDate: this.addDays(today, 12),
                category: 'Fruits'
            },
            {
                id: '6',
                name: 'Poulet',
                quantity: 1,
                expiryDate: this.addDays(today, 2),
                category: 'Viandes'
            },
            {
                id: '7',
                name: 'Jus d\'orange',
                quantity: 2,
                expiryDate: this.addDays(today, 15),
                category: 'Boissons'
            },
            {
                id: '8',
                name: 'Fromage râpé',
                quantity: 1,
                expiryDate: this.addDays(today, 8),
                category: 'Produits laitiers'
            },
            {
                id: '9',
                name: 'Salade',
                quantity: 1,
                expiryDate: this.addDays(today, 3),
                category: 'Légumes'
            },
            {
                id: '10',
                name: 'Bananes',
                quantity: 5,
                expiryDate: this.addDays(today, 6),
                category: 'Fruits'
            },
            {
                id: '11',
                name: 'Boeuf haché',
                quantity: 2,
                expiryDate: this.addDays(today, 1),
                category: 'Viandes'
            },
            {
                id: '12',
                name: 'Eau gazeuse',
                quantity: 6,
                expiryDate: this.addDays(today, 90),
                category: 'Boissons'
            },
            {
                id: '13',
                name: 'Beurre',
                quantity: 1,
                expiryDate: this.addDays(today, 20),
                category: 'Produits laitiers'
            },
            {
                id: '14',
                name: 'Courgettes',
                quantity: 3,
                expiryDate: this.addDays(today, 5),
                category: 'Légumes'
            },
            {
                id: '15',
                name: 'Poires',
                quantity: 4,
                expiryDate: this.addDays(today, 7),
                category: 'Fruits'
            },
            {
                id: '16',
                name: 'Jambon',
                quantity: 2,
                expiryDate: this.addDays(today, 4),
                category: 'Viandes'
            },
            {
                id: '17',
                name: 'Soda',
                quantity: 4,
                expiryDate: this.addDays(today, 180),
                category: 'Boissons'
            },
            {
                id: '18',
                name: 'Crème fraîche',
                quantity: 1,
                expiryDate: this.addDays(today, 6),
                category: 'Produits laitiers'
            },
            {
                id: '19',
                name: 'Poivrons',
                quantity: 3,
                expiryDate: this.addDays(today, 8),
                category: 'Légumes'
            },
            {
                id: '20',
                name: 'Raisins',
                quantity: 1,
                expiryDate: this.addDays(today, 5),
                category: 'Fruits'
            }
        ];

        for (const item of testItems) {
            await this.fridgeService.addItem(item);
        }
    }

    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}