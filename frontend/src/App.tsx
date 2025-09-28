import React, { useState, useEffect } from 'react'
import { uploadFile, getTransactions, getSummary, deleteTransaction } from './api'
import Summary from './components/Summary'
import TransactionsTable from './components/TransactionsTable'

function App() {
  const [currentMonth, setCurrentMonth] = useState<string>('')
  const [selectedMerchant, setSelectedMerchant] = useState<string>('')
  const [amountFilter, setAmountFilter] = useState<string>('')
  const [merchants, setMerchants] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const loadMerchants = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/merchants')
      const merchantData = await response.json()
      setMerchants(merchantData)
    } catch (error) {
      console.error('Error loading merchants:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const monthParam = currentMonth || undefined
      const [summaryData, transData] = await Promise.all([
        getSummary(monthParam),
        getTransactions(monthParam, searchTerm)
      ])
      
      let filteredTrans = transData
      
      if (selectedMerchant) {
        filteredTrans = filteredTrans.filter((t: any) => t.merchant === selectedMerchant)
      }
      
      if (amountFilter === 'expenses') {
        filteredTrans = filteredTrans.filter((t: any) => t.amount < 0)
      } else if (amountFilter === 'income') {
        filteredTrans = filteredTrans.filter((t: any) => t.amount > 0)
      }
      
      setSummary(summaryData)
      setTransactions(filteredTrans)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMerchants()
  }, [])

  useEffect(() => {
    loadData()
  }, [currentMonth, searchTerm, selectedMerchant, amountFilter])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadStatus('Uploading...')
      const result = await uploadFile(file)
      setUploadStatus(`Uploaded: ${result.inserted} inserted, ${result.skipped} skipped`)
      loadData()
      loadMerchants()
    } catch (error) {
      setUploadStatus('Upload failed - check backend connection')
      console.error('Upload error:', error)
    }
  }

  const handleTransactionUpdate = async (id: number, updates: any) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    )
    loadData()
  }

  const handleMerchantClick = (merchant: string) => {
    setSelectedMerchant(merchant === selectedMerchant ? '' : merchant)
  }

  if (loading && !summary) {
    return <div className="app"><h1>Loading...</h1></div>
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Simple Expense Tracker</h1>
        <div className="controls">
          <div className="filter-group">
            <label>Filter by month:</label>
            <select value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
              <option value="">All Months</option>
              <option value="2025-01">January 2025</option>
              <option value="2025-02">February 2025</option>
              <option value="2025-03">March 2025</option>
              <option value="2025-04">April 2025</option>
              <option value="2025-05">May 2025</option>
              <option value="2025-06">June 2025</option>
              <option value="2025-07">July 2025</option>
              <option value="2025-08">August 2025</option>
              <option value="2025-09">September 2025</option>
              <option value="2025-10">October 2025</option>
              <option value="2025-11">November 2025</option>
              <option value="2025-12">December 2025</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by merchant:</label>
            <select value={selectedMerchant} onChange={(e) => setSelectedMerchant(e.target.value)}>
              <option value="">All Merchants</option>
              {merchants.map((merchant) => (
                <option key={merchant.merchant} value={merchant.merchant}>
                  {merchant.merchant}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by type:</label>
            <select value={amountFilter} onChange={(e) => setAmountFilter(e.target.value)}>
              <option value="">All Transactions</option>
              <option value="expenses">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </div>
        {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <Summary data={summary} />

      <div className="transactions-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TransactionsTable 
          transactions={transactions} 
          onUpdate={handleTransactionUpdate}
          onMerchantClick={handleMerchantClick}
          onDelete={loadData}
        />
      </div>
    </div>
  )
}

export default App