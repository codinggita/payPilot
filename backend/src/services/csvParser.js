const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const transactions = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Try to detect transaction columns
                const transaction = {
                    date: row.Date || row.date || row['Transaction Date'] || row['Posting Date'],
                    description: row.Description || row.description || row['Merchant Name'] || row['Payee'],
                    amount: parseFloat(row.Amount || row.amount || row['Debit'] || row['Withdrawal']) || 0,
                    type: row.Type || row.type || 'debit'
                };
                
                // Handle credit/negative amounts
                if (transaction.amount < 0) {
                    transaction.amount = Math.abs(transaction.amount);
                    transaction.type = 'credit';
                }
                
                if (transaction.date && transaction.description && transaction.amount > 0) {
                    transactions.push(transaction);
                }
            })
            .on('end', () => resolve(transactions))
            .on('error', (error) => reject(error));
    });
};

const parsePDF = async (filePath) => {
    // Placeholder - will be implemented with pdf-parse
    // For MVP, return empty array and suggest CSV
    console.log('PDF parsing not fully implemented. Please use CSV format.');
    return [];
};

module.exports = { parseCSV, parsePDF };
