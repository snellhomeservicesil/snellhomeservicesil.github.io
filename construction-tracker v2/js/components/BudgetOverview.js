// BudgetOverview Component - Display financial metrics
function BudgetOverview({ project }) {
    const e = React.createElement;
    const metrics = calculateProjectMetrics(project);

    const getStatusColor = (status) => {
        const colors = {
            'Scheduling': 'bg-gray-100 text-gray-700',
            'Quoting': 'bg-yellow-100 text-yellow-700',
            'In Progress': 'bg-blue-100 text-blue-700',
            'Awaiting Final Payment': 'bg-orange-100 text-orange-700',
            'Awaiting Materials Payment': 'bg-purple-100 text-purple-700',
            'Completed': 'bg-green-100 text-green-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return e('div', { className: "bg-white rounded-xl shadow-lg p-6" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('h2', { className: "text-xl font-bold text-slate-800" }, 'Project Overview'),
            e('span', {
                className: `px-3 py-1 text-sm font-medium rounded ${getStatusColor(project.status || 'Scheduling')}`
            }, project.status || 'Scheduling')
        ),

        project.description && e('p', { className: "text-slate-600 mb-4 pb-4 border-b" }, project.description),

        e('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-4" },
            e('div', { className: "p-4 bg-blue-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Original Price'),
                e('p', { className: "text-2xl font-bold text-blue-700" }, '$', project.agreedPrice.toLocaleString())
            ),
            e('div', { className: "p-4 bg-purple-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Change Orders'),
                e('p', { className: "text-2xl font-bold text-purple-700" },
                    metrics.totalChangeOrders >= 0 ? '+$' : '-$',
                    Math.abs(metrics.totalChangeOrders).toLocaleString()
                )
            ),
            e('div', { className: "p-4 bg-indigo-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Adjusted Price'),
                e('p', { className: "text-2xl font-bold text-indigo-700" }, '$', metrics.adjustedPrice.toLocaleString())
            ),
            e('div', { className: "p-4 bg-orange-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Materials Cost'),
                e('p', { className: "text-2xl font-bold text-orange-700" }, '$', metrics.totalMaterials.toLocaleString())
            ),
            e('div', { className: "p-4 bg-pink-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Labor Cost'),
                e('p', { className: "text-2xl font-bold text-pink-700" }, '$', metrics.totalLaborCost.toLocaleString())
            ),
            e('div', { className: "p-4 bg-emerald-50 rounded-lg" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Remaining Budget'),
                e('p', { className: "text-2xl font-bold text-emerald-700" }, '$', metrics.remainingBudget.toLocaleString())
            ),
            e('div', { className: "p-4 bg-teal-50 rounded-lg border-2 border-teal-300" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Payments Received'),
                e('p', { className: "text-2xl font-bold text-teal-700" }, '$', metrics.totalPayments.toLocaleString())
            ),
            e('div', { className: "p-4 bg-amber-50 rounded-lg border-2 border-amber-300" },
                e('p', { className: "text-sm text-slate-600 mb-1" }, 'Outstanding Balance'),
                e('p', { className: "text-2xl font-bold text-amber-700" }, '$', metrics.outstandingBalance.toLocaleString())
            )
        )
    );
}
