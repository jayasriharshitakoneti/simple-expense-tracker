import React from 'react'

interface SummaryProps {
  data: any
}

const Summary: React.FC<SummaryProps> = ({ data }) => {
  if (!data) return <div>Loading summary...</div>

  return (
    <div className="summary">
      <div className="summary-cards">
        <div className="card">
          <h3>Total Expense</h3>
          <span className="amount expense">${Math.abs(data.total_expense).toFixed(2)}</span>
        </div>
        <div className="card">
          <h3>Total Income</h3>
          <span className="amount income">${data.total_income.toFixed(2)}</span>
        </div>
        <div className="card">
          <h3>Net</h3>
          <span className={`amount ${data.net >= 0 ? 'income' : 'expense'}`}>
            ${data.net.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="categories">
        <h3>Spending by Category</h3>
        <div className="category-list">
          {data.by_category.map((cat: any) => (
            <div key={cat.category} className="category-item">
              <span>{cat.category}</span>
              <span>${cat.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Summary