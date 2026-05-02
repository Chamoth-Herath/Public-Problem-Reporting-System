import Disaster from '../domain/disaster.js';

export const createDisasterReport = async (reportData) => {
    const { type, severity, location, name, phone, description, affectedPeople, isRedZone } = reportData;
    const refNumber = `DIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return await Disaster.create({
        refNumber, disasterType: type.label, severity, location,
        reporterName: name, phone, description, affectedPeople, isRedZone,
        status: 'Pending',
    });
};

// Admin: get all reports (fetching → status becomes In Review)
export const getAllReports = async () => {
    // Bulk-update all Pending → In Review when admin fetches
    await Disaster.updateMany({ status: 'Pending' }, { status: 'In Review' });
    return await Disaster.find().populate('assignedTo', 'name email').sort({ submittedAt: -1 });
};

// Admin: assign to a disaster agent
export const assignReport = async (reportId, agentId) => {
    return await Disaster.findByIdAndUpdate(
        reportId,
        { status: 'Assigned', assignedTo: agentId, assignedAt: new Date() },
        { new: true }
    ).populate('assignedTo', 'name email');
};

// Agent: get reports assigned to them
export const getAgentReports = async (agentId) => {
    return await Disaster.find({ assignedTo: agentId }).sort({ assignedAt: -1 });
};

// Agent: resolve a report
export const resolveReport = async (reportId, agentId, note) => {
    const report = await Disaster.findOne({ _id: reportId, assignedTo: agentId });
    if (!report) throw new Error('Not authorised or report not found');
    report.status     = 'Resolved';
    report.resolvedAt = new Date();
    report.agentNote  = note || '';
    return await report.save();
};