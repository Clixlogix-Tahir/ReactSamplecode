import { ERewardType } from "./appManagementTypes";
import { ERewardTypesForDropDown } from "./constants";

export const isInteger = (value: string) => {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

export const isNumericFieldsValid = (value: string): string => {
    let error = '';
    if (value === '') {
        error = 'Please enter the amount';
    }
    else if (isNaN(parseInt(value))) {
        error = 'Please enter a valid number';
    }
    else if (!isInteger(value)) {
        error = 'Please enter an integer';
    }
    else if ((parseInt(value) < 1)) {
        error = 'Value should be greater than or equal to 1';
    }
    return error;
}

export const isDecimalFieldsValid = (value: string): string => {
    let error = '';
    if (value === '') {
        error = 'Please enter the amount';
    }
    else if (isNaN(parseInt(value))) {
        error = 'Please enter a valid number';
    }
    else if ((parseFloat(value) <= 0)) {
        error = 'Value should be greater than 0';
    }
    return error;
}

export const rewardTypeForDropDownToRewardTypeConvertor = (rewardType : ERewardTypesForDropDown) => {
    switch(rewardType){
        case ERewardTypesForDropDown.COIN:
        case ERewardTypesForDropDown.TICKET: {
            return ERewardType.VIRTUAL_CURRENCY;
        }
        case ERewardTypesForDropDown.RLY:
        case ERewardTypesForDropDown.DEPOSIT_CASH:
        case ERewardTypesForDropDown.BONUS_CASH: {
            return ERewardType.REAL_CURRENCY;
        }
    }
}