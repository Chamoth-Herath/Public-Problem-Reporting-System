// frontend/src/services/disasterService.js
import axios from 'axios';

const API = 'http://localhost:5000/api/disaster';

export const submitDisasterReport = async (payload) => {
    const { data } = await axios.post(API, payload);
    return data;
};

export const getDisasterReports = async () => {
    const { data } = await axios.get(API);
    return data;
};

// Admin calls
export const adminGetAllReports = async () => {
    const { data } = await axios.get(`${API}/admin/all`);
    return data;
};
export const adminAssignReport = async (reportId, agentId) => {
    const { data } = await axios.patch(`${API}/admin/assign/${reportId}`, { agentId });
    return data;
};

// Agent calls
export const agentGetMyReports = async (agentId) => {
    const { data } = await axios.get(`${API}/agent/${agentId}`);
    return data;
};

export const agentResolveReport = async (reportId, agentId, note) => {
    const { data } = await axios.patch(`${API}/agent/resolve/${reportId}`, { agentId, note });
    return data;
};