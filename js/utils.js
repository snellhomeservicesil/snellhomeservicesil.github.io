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
            totalInvoicesPaid: 0,
            totalInvoices: 0,
            outstandingBalance: 0
        };
    }

    const totalChangeOrders = project.changeOrders.reduce((sum, co) => sum + co.price, 0);
    const totalMaterials = project.materials.reduce((sum, m) => sum + m.cost, 0);
    const totalLaborCost = project.hours.reduce((sum, he) => {
        const member = project.teamMembers.find(m => m.id === he.teamMemberId);
        return sum + (member ? he.hours * member.hourlyRate : 0);
    }, 0);
    const totalInvoicesPaid = (project.invoices || [])
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvoices = (project.invoices || [])
        .filter(inv => inv.status != 'Cancelled')
        .reduce((sum, inv) => sum + inv.amount, 0);
    
    const adjustedPrice = project.agreedPrice + totalChangeOrders;
    const remainingBudget = adjustedPrice - totalMaterials - totalLaborCost;
    const outstandingBalance = adjustedPrice - totalInvoicesPaid;

    return {
        adjustedPrice,
        totalMaterials,
        totalChangeOrders,
        remainingBudget,
        totalLaborCost,
        totalInvoicesPaid,
        totalInvoices,
        outstandingBalance
    };
}

function formatCurrency(value) {
    if (value == null || isNaN(value)) return '$0';
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
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
