// Wallet Management Interface
class WalletManager {
    static showWalletModal() {
        const currentUser = OpusAuth.getCurrentUser();
        if (!currentUser) return;

        const wallet = EscrowWallet.getWallet(currentUser.id);
        
        const modal = document.getElementById('applicationModal');
        const modalContent = document.getElementById('applicationModalContent');
        
        modalContent.innerHTML = `
            <div>
                <div class="modal-header">
                    <h3>💰 My Wallet</h3>
                    <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                </div>
                
                <div style="margin: 20px 0;">
                    <!-- Balance Cards -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 0.9rem; opacity: 0.9;">Available Balance</div>
                            <div style="font-size: 1.8rem; font-weight: 800; margin: 8px 0;">₹${wallet.balance}</div>
                            <div style="font-size: 0.8rem;">Ready to use</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 0.9rem; opacity: 0.9;">Escrow Balance</div>
                            <div style="font-size: 1.8rem; font-weight: 800; margin: 8px 0;">₹${wallet.escrowBalance}</div>
                            <div style="font-size: 0.8rem;">Secured payments</div>
                        </div>
                    </div>

                    <!-- Add Funds Section -->
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 16px;">💳 Add Funds to Wallet</h4>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
                            <button class="btn btn-ghost" onclick="WalletManager.addFunds(1000)" style="padding: 12px; text-align: center;">
                                ₹1,000
                            </button>
                            <button class="btn btn-ghost" onclick="WalletManager.addFunds(5000)" style="padding: 12px; text-align: center;">
                                ₹5,000
                            </button>
                            <button class="btn btn-ghost" onclick="WalletManager.addFunds(10000)" style="padding: 12px; text-align: center;">
                                ₹10,000
                            </button>
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <input type="number" id="customAmount" placeholder="Enter custom amount" 
                                   style="flex: 1; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff;">
                            <button class="btn btn-primary" onclick="WalletManager.addCustomFunds()">
                                Add Funds
                            </button>
                        </div>
                    </div>

                    <!-- Recent Transactions -->
                    <div>
                        <h4 style="color: #fff; margin-bottom: 16px;">📊 Recent Transactions</h4>
                        ${this.renderTransactionHistory(wallet.transactions)}
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Close</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    static renderTransactionHistory(transactions = []) {
        if (!transactions || transactions.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: var(--muted);">
                    <div style="font-size: 3rem; margin-bottom: 16px;">💸</div>
                    <p>No transactions yet</p>
                </div>
            `;
        }

        const recentTransactions = transactions.slice(-5).reverse();
        
        return `
            <div style="max-height: 300px; overflow-y: auto;">
                ${recentTransactions.map(txn => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div>
                            <div style="color: #fff; font-weight: 600; font-size: 0.9rem;">${txn.description}</div>
                            <div style="color: var(--muted); font-size: 0.8rem;">${new Date(txn.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: ${txn.amount > 0 ? '#4ade80' : '#ff5c5c'}; font-weight: 700;">
                                ${txn.amount > 0 ? '+' : ''}₹${Math.abs(txn.amount)}
                            </div>
                            <div style="color: var(--muted); font-size: 0.8rem; text-transform: capitalize;">
                                ${txn.type.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static addFunds(amount) {
        const currentUser = OpusAuth.getCurrentUser();
        if (!currentUser) return;

        try {
            const wallet = EscrowWallet.addFunds(currentUser.id, amount, `Wallet top-up - ₹${amount}`);
            OpusUtils.showNotification(`₹${amount} added to your wallet!`, 'success');
            this.showWalletModal(); // Refresh the modal
        } catch (error) {
            OpusUtils.showNotification(error.message, 'error');
        }
    }

    static addCustomFunds() {
        const amountInput = document.getElementById('customAmount');
        const amount = parseInt(amountInput.value);
        
        if (!amount || amount < 100) {
            OpusUtils.showNotification('Please enter amount greater than ₹100', 'error');
            return;
        }

        this.addFunds(amount);
        amountInput.value = '';
    }

    static getWalletSummary() {
        const currentUser = OpusAuth.getCurrentUser();
        if (!currentUser) return null;

        const wallet = EscrowWallet.getWallet(currentUser.id);
        return {
            available: wallet.balance,
            escrow: wallet.escrowBalance,
            total: wallet.balance + wallet.escrowBalance
        };
    }
}