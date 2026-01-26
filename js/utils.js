// Utility functions for the Construction Projects Tracker

// Calculate all project financial metrics
function calculateProjectMetrics(project) {
    if (!project) {
        return {
            adjustedPrice: 0,
            totalMaterials: 0,
            totalChangeOrders: 0,
            remainingBudget: 0,
            totalLaborCost: 0,
            totalPayments: 0,
            outstandingBalance: 0
        };
    }

    const totalChangeOrders = project.changeOrders.reduce((sum, co) => sum + co.price, 0);
    const totalMaterials = project.materials.reduce((sum, m) => sum + m.cost, 0);
    const totalLaborCost = project.hours.reduce((sum, he) => {
        const member = project.teamMembers.find(m => m.id === he.teamMemberId);
        return sum + (member ? he.hours * member.hourlyRate : 0);
    }, 0);
    const totalPayments = (project.payments || []).reduce((sum, pay) => sum + pay.amount, 0);
    
    const adjustedPrice = project.agreedPrice + totalChangeOrders;
    const remainingBudget = adjustedPrice - totalMaterials - totalLaborCost;
    const outstandingBalance = adjustedPrice - totalPayments;

    return {
        adjustedPrice,
        totalMaterials,
        totalChangeOrders,
        remainingBudget,
        totalLaborCost,
        totalPayments,
        outstandingBalance
    };
}

// Get team member name by ID
function getTeamMemberName(project, teamMemberId) {
    const member = project?.teamMembers.find(m => m.id === teamMemberId);
    return member ? member.name : 'Unknown';
}

// Get total hours for a team member
function getTotalHours(project, teamMemberId) {
    return project?.hours
        .filter(h => h.teamMemberId === teamMemberId)
        .reduce((sum, h) => sum + h.hours, 0) || 0;
}

// Get today's date in ISO format
function getTodayISODate() {
    return new Date().toISOString().split('T')[0];
}
