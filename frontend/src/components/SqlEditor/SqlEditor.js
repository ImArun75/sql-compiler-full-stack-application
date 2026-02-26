import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function SqlEditor({ editorRef }) {
    const { loading, runQuery, getHint } = useWorkspace();

    const onRun = () => runQuery(editorRef.current.getValue());
    const onHint = () => getHint(editorRef.current.getValue());

    return (
        <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1>SQL Editor</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onRun} disabled={loading}>Run Query</button>
                    <button onClick={onHint} disabled={loading}>Get Hint</button>
                </div>
            </div>
            <MonacoEditor
                height="300px"
                language="sql"
                theme="vs-dark"
                onMount={editor => editorRef.current = editor}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
        </div>
    );
}
