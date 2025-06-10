import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DBViewer.css';

function DBViewer() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/db-viewer/tables');
            setTables(Array.isArray(response.data) ? response.data : []);
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
            const response = await axios.get(`/admin/db-viewer/${tableName}`);
            setTableData(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Failed to fetch data from ${tableName}`);
            setLoading(false);
        }
    };

    return (
        <div className="db-viewer-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'flex-start', paddingTop: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#fff', letterSpacing: '2px' }}>Database Viewer</h1>
            <div className="tables-list" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <h2 style={{ color: '#e0e0e0', fontSize: '1.5rem', marginRight: '1.5rem', marginBottom: 0 }}>Tables</h2>
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}
                {Array.isArray(tables) && tables.length === 0 && !loading && !error && (
                    <div className="no-tables">No tables found in the database.</div>
                )}
                {Array.isArray(tables) && tables.length > 0 && tables.map(table => (
                    <button
                        key={table}
                        className={`table-button ${selectedTable === table ? 'selected' : ''}`}
                        style={{ fontSize: '1.1rem', padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: selectedTable === table ? '#8B1EDE' : '#444', color: '#fff', cursor: 'pointer', boxShadow: selectedTable === table ? '0 2px 8px #8B1EDE33' : 'none', transition: 'all 0.2s' }}
                        onClick={() => fetchTableData(table)}
                    >
                        {table}
                    </button>
                ))}
            </div>

            {!selectedTable && !loading && !error && Array.isArray(tables) && tables.length > 0 && (
                <div className="no-table-selected" style={{ color: '#ccc', fontSize: '1.2rem', marginTop: '2rem' }}>Select a table to view its data.</div>
            )}

            {selectedTable && !loading && !error && (
                <div className="table-viewer" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2rem' }}>
                    <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1.5rem' }}>{selectedTable}</h2>
                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                        {tableData && tableData.rows && tableData.rows.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', background: 'rgba(255,255,255,0.05)' }}>
                                <thead>
                                    <tr>
                                        {tableData.columns.map(key => (
                                            <th key={key} style={{ background: '#8B1EDE', color: '#fff', fontWeight: 600, padding: '0.75rem 1rem', borderBottom: '2px solid #fff2' }}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.rows.map((row, index) => (
                                        <tr key={index} style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)' }}>
                                            {tableData.columns.map((col, i) => (
                                                <td key={i} style={{ color: '#fff', padding: '0.7rem 1rem', borderBottom: '1px solid #fff1', fontSize: '1rem' }}>{String(row[col])}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-rows" style={{ color: '#ccc', fontSize: '1.1rem', marginTop: '1.5rem' }}>No rows found in this table.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DBViewer; 