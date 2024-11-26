import { NavigatedData, Page, ItemEventData, Frame, SwipeGestureEventData } from '@nativescript/core';
import { HomeViewModel } from '../view-models/home-view-model';
import { FridgeItem } from '../models/fridge-item';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    
    if (!page.bindingContext) {
        page.bindingContext = new HomeViewModel();
    }

    const navigationContext = args.context;
    if (navigationContext && navigationContext.item) {
        const vm = page.bindingContext as HomeViewModel;
        if (vm.items.some(item => item.id === navigationContext.item.id)) {
            vm.updateItem(navigationContext.item);
        } else {
            vm.addItem(navigationContext.item);
        }
    }
}

export function onAddTap() {
    const frame = Frame.topmost();
    frame.navigate({
        moduleName: 'pages/item-form-page',
        transition: {
            name: 'slideLeft'
        }
    });
}

export function onItemTap(args: ItemEventData) {
    const vm = (<any>args.object).bindingContext as HomeViewModel;
    const tappedItem = vm.items.getItem(args.index);
    
    const frame = Frame.topmost();
    frame.navigate({
        moduleName: 'pages/item-form-page',
        context: { item: tappedItem },
        transition: {
            name: 'slideLeft'
        }
    });
}

export function onSwipeCellStarted(args: SwipeGestureEventData) {
    const swipeView = args.object;
    const viewModel = swipeView.bindingContext as FridgeItem;
    const homeViewModel = (<any>swipeView.page).bindingContext as HomeViewModel;
    
    homeViewModel.removeItem(viewModel.id);
}