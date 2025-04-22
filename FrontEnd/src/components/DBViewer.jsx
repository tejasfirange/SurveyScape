import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DBViewer.css';

function DBViewer() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/db/tables');
            setTables(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch tables');
            setLoading(false);
        }
    };

    const fetchTableData = async (tableName) => {
        try {
            setLoading(true);
            setSelectedTable(tableName);
            const response = await axios.get(`/api/db/table/${tableName}`);
            setTableData(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Failed to fetch data from ${tableName}`);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="db-viewer-container">
            <div className="loading">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="db-viewer-container">
            <div className="error">{error}</div>
        </div>
    );

    return (
        <div className="db-viewer-container">
            <h1>Database Viewer</h1>
            
            <div className="tables-list">
                <h2>Tables</h2>
                {tables.map(table => (
                    <button
                        key={table}
                        className={`table-button ${selectedTable === table ? 'selected' : ''}`}
                        onClick={() => fetchTableData(table)}
                    >
                        {table}
                    </button>
                ))}
            </div>

            {selectedTable && tableData.length > 0 && (
                <div className="table-viewer">
                    <h2>{selectedTable}</h2>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(tableData[0]).map(key => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{String(value)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DBViewer; 