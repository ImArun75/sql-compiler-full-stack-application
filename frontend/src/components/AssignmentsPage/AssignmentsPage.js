import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function AssignmentsPage() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const { clearWorkspace } = useWorkspace();

    useEffect(() => {
        clearWorkspace();
        api.get('/assignments').then(({ data }) => setList(data.data));
    }, []);

    return (
        <div>
            <h1>Practice Assignments</h1>
            <div className="assignments-grid">
                {list.map(a => (
                    <div key={a._id} className="assignment-card" onClick={() => navigate(`/attempt/${a._id}`)}>
                        <h1>{a.title}</h1>
                        <p>{a.description}</p>
                        <span className={`badge ${a.difficulty.toLowerCase()}`}>{a.difficulty}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
