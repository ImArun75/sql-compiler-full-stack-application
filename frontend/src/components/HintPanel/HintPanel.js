import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function HintPanel() {
    const { hint, setHint } = useWorkspace();

    if (!hint) return null;

    return (
        <div className="hint-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>💡 Thinking Hint</h1>
                <button onClick={() => setHint(null)} style={{ background: 'transparent', color: 'gray', border: 'none' }}>×</button>
            </div>
            <p><strong>Concept:</strong> {hint.concept}</p>
            <p>{hint.hint}</p>
            <p><em>{hint.nextStep}</em></p>
        </div>
    );
}
