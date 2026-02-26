import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function ResultsPanel() {
    const { results, error, loading } = useWorkspace();

    if (loading) return <div>Executing query...</div>;
    if (error) return <div className="error-box"><h1>Error</h1><p>{error}</p></div>;
    if (!results) return null;

    const data = results.preview || results;

    return (
        <div className="panel">
            <h1>Results {results.preview && '(Rolling Back...)'}</h1>
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>{data.columns.map(c => <th key={c}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data.rows.map((r, i) => (
                            <tr key={i}>{data.columns.map(c => <td key={c}>{String(r[c])}</td>)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
