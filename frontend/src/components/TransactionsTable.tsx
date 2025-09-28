import React from 'react'
import { updateTransaction, deleteTransaction } from '../api'
import '../styles/TransactionsTable.css'

interface Transaction {
  id: number
  date: string
  description: string
  merchant: string
  amount: number
  category: string
  notes?: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
  onUpdate: (id: number, updates: any) => void
  onMerchantClick: (merchant: string) => void
  onDelete: () => void
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onUpdate,
  onMerchantClick,
  onDelete
}) => {
  const handleCategoryChange = async (id: number, category: string) => {
    try {
      await updateTransaction(id, { category })
      onUpdate(id, { category })
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDelete = async (id: number, transaction: Transaction) => {
    const confirmMessage = `Are you sure you want to delete this transaction?

Date: ${new Date(transaction.date).toLocaleDateString()}
Merchant: ${transaction.merchant}
Description: ${transaction.description}
Amount: $${Math.abs(transaction.amount).toFixed(2)}

This action cannot be undone.`

    if (window.confirm(confirmMessage)) {
      try {
        await deleteTransaction(id)
        onDelete() // Refresh the data
      } catch (error) {
        console.error('Failed to delete transaction:', error)
        alert('Failed to delete transaction. Please try again.')
      }
    }
  }

  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>
                <span
                  className="clickable-merchant"
                  onClick={() => onMerchantClick(transaction.merchant)}
                  title="Click to filter by this merchant"
                >
                  {transaction.merchant}
                </span>
              </td>
              <td>
                <input
                  type="text"
                  value={transaction.category}
                  onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                  onBlur={(e) => handleCategoryChange(transaction.id, e.target.value)}
                />
              </td>
              <td className={`amount ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(transaction.id, transaction)}
                  title="Delete transaction"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable