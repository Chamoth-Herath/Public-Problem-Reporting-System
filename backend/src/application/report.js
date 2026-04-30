import Emergency from '../domain/report.js';

export const createEmergencyRequest = async ({ serviceType, phone, location, coordinates }) => {
    const emergency = new Emergency({
        serviceType,
        phone,
        location,
        coordinates
    });
    await emergency.save();
    return emergency;
};

export const getAllEmergencyRequests = async () => {
    return await Emergency.find().sort({ createdAt: -1 });
};

export const getEmergencyById = async (id) => {
    return await Emergency.findById(id);
};

export const updateEmergencyStatus = async (id, status) => {
    return await Emergency.findByIdAndUpdate(id, { status }, { new: true });
};
export const getActiveRequestByPhone = async (phone) => {
    return await Emergency.findOne({
        phone,
        status: { $ne: 'resolved' }
    }).sort({ createdAt: -1 });
};

export const getRequestByRef = async (referenceNumber) => {
    return await Emergency.findOne({ referenceNumber });
};