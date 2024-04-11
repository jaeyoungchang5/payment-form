'use client';
import React, { useEffect, useRef, useState } from 'react'
import CurrencyInput from './CurrencyInput';
import AccountsHeader from './AccountsHeader';
import { AccountDetails, Value } from '../types';
import Account from './Account';

const PaymentDetails = () => {
    const [paymentAmount, setPaymentAmount] = useState<number>();
    const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');
    const [accounts, setAccounts] = useState<AccountDetails[]>([
        { name: 'A', balance: 45156, isSelected: false, accountPayment: 0 },
        { name: 'B', balance: 14901, isSelected: false, accountPayment: 0 },
        { name: 'C', balance:  5438, isSelected: false, accountPayment: 0 },
    ]);

    const totalBalance = accounts.reduce((sum, current) => sum + current.balance, 0);

    function updateAccounts(accountsObj: AccountDetails[], totalPayment: number) {
        let subtotal: number = accountsObj.reduce((sum, current) => sum + (current.isSelected ? current.balance : 0), 0);
        let updatedList: AccountDetails[] = accountsObj.map(account => {
            if (!account.isSelected) {
                return {...account, accountPayment: 0}
            } else {
                return {...account, accountPayment: (account.balance / subtotal) * totalPayment}
            }
        })
        setAccounts(updatedList);
    }

    function handleCheckedUpdate(name: string, isChecked: boolean) {
        let updatedList: AccountDetails[] = accounts.map(account => {
            if (account.name !== name) {
                return account;
            }
            return {...account, isSelected: isChecked}
        })

        updateAccounts(updatedList, paymentAmount ?? 0);
    }

    function handlePaymentAmountChange(value: number) {
        console.log(`handling payments from payment details: ${value}`)
        if (isNaN(value)) {
            return;
        }

        setPaymentAmount(value);
        updateAccounts(accounts, value ?? 0);
    }

    function handleAccountPaymentChange(name: string, value: number) {
        let updatedList: AccountDetails[] = accounts.map(account => {
            if (account.name !== name) {
                return account;
            }

            setPaymentAmount((paymentAmount || 0) + value - account.accountPayment);
            return {...account, accountPayment: value}
        })
        setAccounts(updatedList)
    }

    return (
        <div>
            Payment Detail
            <CurrencyInput
                label={'Payment Amount'}
                value={paymentAmount}
                errorMessage={paymentErrorMessage}
                onChange={handlePaymentAmountChange}
                disabled={false}
            />
 
            <AccountsHeader numSelectedAccounts={3} totalBalance={totalBalance} />

            {Object.entries(accounts).map(([ key, account ]) => {
                return (
                    <Account 
                        key={key} 
                        account={account} 
                        updateChecked={handleCheckedUpdate}
                        updatePaymentAmount={handleAccountPaymentChange}
                    />
                )
            })}
        </div>
    )
}

export default PaymentDetails