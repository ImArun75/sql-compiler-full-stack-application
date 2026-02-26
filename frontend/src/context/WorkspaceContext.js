import React, { createContext, useContext, useState } from 'react';
import api from '../api/client';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
    const [assignment, setAssignment] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState(null);
    const [error, setError] = useState(null);

    const clearWorkspace = () => {
        setResults(null);
        setHint(null);
        setError(null);
    };

    const runQuery = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('execute', { assignmentId: assignment._id, query });
            setResults(data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const getHint = async (query) => {
        setLoading(true);
        try {
            const { data } = await api.post('hint', {
                assignmentQuestion: assignment.question,
                tableSchemas: assignment.tableSchemas,
                studentQuery: query,
                lastError: error
            });
            setHint(data.hint);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WorkspaceContext.Provider value={{ assignment, setAssignment, results, runQuery, getHint, hint, loading, error, setHint, clearWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);
