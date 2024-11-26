import { NavigatedData, Page, EventData, Frame } from '@nativescript/core';
import { ItemFormViewModel } from '../view-models/item-form-view-model';
import { FridgeItem } from '../models/fridge-item';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const context = args.context || {};
    page.bindingContext = new ItemFormViewModel(context.item);
}

export function onSaveTap(args: EventData) {
    const page = (<any>args.object).page as Page;
    const vm = page.bindingContext as ItemFormViewModel;
    
    if (vm.validate()) {
        const item = vm.getItem();
        const frame = Frame.topmost();
        frame.goBack({ item });
    }
}

export function onCancelTap() {
    const frame = Frame.topmost();
    frame.goBack();
}

export function onTextFieldFocus(args: EventData) {
    const textField = args.object;
    const vm = (<any>textField).page.bindingContext as ItemFormViewModel;
    vm.clearValidationError(textField.id);
}

export function onDatePickerLoaded(args: EventData) {
    const datePicker = args.object;
    const vm = (<any>datePicker).page.bindingContext as ItemFormViewModel;
    vm.initializeExpiryDate();
}