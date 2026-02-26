import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useWorkspace } from '../../context/WorkspaceContext';
import SqlEditor from '../SqlEditor/SqlEditor';
import ResultsPanel from '../ResultsPanel/ResultsPanel';
import HintPanel from '../HintPanel/HintPanel';

export default function AttemptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setAssignment, assignment, clearWorkspace } = useWorkspace();
    const editorRef = useRef();

    useEffect(() => {
        clearWorkspace();
        api.get(`/assignments/${id}`).then(({ data }) => setAssignment(data.data));
    }, [id, setAssignment]);

    if (!assignment) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate('/')}>← Back</button>
                <h1>{assignment.title}</h1>
            </div>

            <div className="attempt-page__layout">
                <div>
                    <div className="panel">
                        <h1>Requirement</h1>
                        <p>{assignment.question}</p>
                    </div>
                    <div className="panel">
                        <h1>Database Schema</h1>
                        {assignment.tableSchemas.map(s => (
                            <div key={s.tableName}>
                                <h1>{s.tableName}</h1>
                                <ul>{s.columns.map(c => <li key={c.name}>{c.name} ({c.type})</li>)}</ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <SqlEditor editorRef={editorRef} />
                    <HintPanel />
                    <ResultsPanel />
                </div>
            </div>
        </div>
    );
}
