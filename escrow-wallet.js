// Escrow Wallet System for OpusLink
class EscrowWallet {
    static initializeWallet(userId) {
        const wallets = JSON.parse(localStorage.getItem('opuslink_wallets') || '{}');
        
        if (!wallets[userId]) {
            wallets[userId] = {
                userId: userId,
                balance: 0,
                escrowBalance: 0, // Funds held in escrow
                transactions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('opuslink_wallets', JSON.stringify(wallets));
        }
        
        return wallets[userId];
    }

    static getWallet(userId) {
        const wallets = JSON.parse(localStorage.getItem('opuslink_wallets') || '{}');
        return wallets[userId] || this.initializeWallet(userId);
    }

    static addFunds(userId, amount, description = 'Wallet top-up') {
        const wallets = JSON.parse(localStorage.getItem('opuslink_wallets') || '{}');
        const wallet = this.getWallet(userId);
        
        wallet.balance += amount;
        wallet.updatedAt = new Date().toISOString();
        
        // Record transaction
        wallet.transactions.push({
            id: 'txn_' + Date.now(),
            type: 'deposit',
            amount: amount,
            description: description,
            status: 'completed',
            createdAt: new Date().toISOString(),
            balanceAfter: wallet.balance
        });
        
        wallets[userId] = wallet;
        localStorage.setItem('opuslink_wallets', JSON.stringify(wallets));
        
        return wallet;
    }

    static moveToEscrow(userId, amount, agreementId, description = 'Escrow deposit') {
        const wallets = JSON.parse(localStorage.getItem('opuslink_wallets') || '{}');
        const wallet = this.getWallet(userId);
        
        if (wallet.balance < amount) {
            throw new Error('Insufficient balance');
        }
        
        wallet.balance -= amount;
        wallet.escrowBalance += amount;
        wallet.updatedAt = new Date().toISOString();
        
        // Record transaction
        wallet.transactions.push({
            id: 'txn_' + Date.now(),
            type: 'escrow_lock',
            amount: amount,
            description: description,
            agreementId: agreementId,
            status: 'completed',
            createdAt: new Date().toISOString(),
            balanceAfter: wallet.balance,
            escrowBalanceAfter: wallet.escrowBalance
        });
        
        wallets[userId] = wallet;
        localStorage.setItem('opuslink_wallets', JSON.stringify(wallets));
        
        return wallet;
    }

    static releaseFromEscrow(agreementId, workLogId = null) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreement = agreements.find(a => a.id === agreementId);
        
        if (!agreement) {
            throw new Error('Agreement not found');
        }
        
        const wallets = JSON.parse(localStorage.getItem('opuslink_wallets') || '{}');
        const employerWallet = this.getWallet(agreement.employerId);
        const workerWallet = this.getWallet(agreement.workerId);
        
        // Find the payment amount for this work
        const payment = agreement.payments?.find(p => p.workLogId === workLogId);
        const amount = payment ? payment.amount : 0;
        
        if (employerWallet.escrowBalance < amount) {
            throw new Error('Insufficient escrow balance');
        }
        
        // Move from employer escrow to worker balance
        employerWallet.escrowBalance -= amount;
        workerWallet.balance += amount;
        
        employerWallet.updatedAt = new Date().toISOString();
        workerWallet.updatedAt = new Date().toISOString();
        
        // Record employer transaction
        employerWallet.transactions.push({
            id: 'txn_' + Date.now(),
            type: 'escrow_release',
            amount: -amount,
            description: `Payment released to ${agreement.workerName}`,
            agreementId: agreementId,
            workLogId: workLogId,
            status: 'completed',
            createdAt: new Date().toISOString(),
            balanceAfter: employerWallet.balance,
            escrowBalanceAfter: employerWallet.escrowBalance
        });
        
        // Record worker transaction
        workerWallet.transactions.push({
            id: 'txn_' + Date.now(),
            type: 'payment_received',
            amount: amount,
            description: `Payment from ${agreement.employerName}`,
            agreementId: agreementId,
            workLogId: workLogId,
            status: 'completed',
            createdAt: new Date().toISOString(),
            balanceAfter: workerWallet.balance
        });
        
        wallets[agreement.employerId] = employerWallet;
        wallets[agreement.workerId] = workerWallet;
        localStorage.setItem('opuslink_wallets', JSON.stringify(wallets));
        
        return {
            employer: employerWallet,
            worker: workerWallet
        };
    }

    static getTransactionHistory(userId) {
        const wallet = this.getWallet(userId);
        return wallet.transactions || [];
    }

    static getWalletSummary(userId) {
        const wallet = this.getWallet(userId);
        return {
            available: wallet.balance,
            escrow: wallet.escrowBalance,
            total: wallet.balance + wallet.escrowBalance
        };
    }
}