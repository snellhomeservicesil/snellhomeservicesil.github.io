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

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('h2', { className: "text-xl font-bold text-white" }, 'Project Overview'),
            e('span', {
                className: `px-3 py-1 text-sm font-medium rounded ${getStatusColor(project.status || 'Scheduling')}`
            }, project.status || 'Scheduling')
        ),

        project.description && e('p', { className: "text-slate-400 mb-4 pb-4 border-b border-slate-600" }, project.description),

        e('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-4" },
            e('div', { className: "p-4 bg-blue-900 rounded-lg border border-blue-700" },
                e('p', { className: "text-sm text-blue-300 mb-1" }, 'Original Price'),
                e('p', { className: "text-2xl font-bold text-blue-400" }, '$', project.agreedPrice.toLocaleString())
            ),
            e('div', { className: "p-4 bg-purple-900 rounded-lg border border-purple-700" },
                e('p', { className: "text-sm text-purple-300 mb-1" }, 'Change Orders'),
                e('p', { className: "text-2xl font-bold text-purple-400" },
                    metrics.totalChangeOrders >= 0 ? '+$' : '-$',
                    Math.abs(metrics.totalChangeOrders).toLocaleString()
                )
            ),
            e('div', { className: "p-4 bg-indigo-900 rounded-lg border border-indigo-700" },
                e('p', { className: "text-sm text-indigo-300 mb-1" }, 'Adjusted Price'),
                e('p', { className: "text-2xl font-bold text-indigo-400" }, '$', metrics.adjustedPrice.toLocaleString())
            ),
            e('div', { className: "p-4 bg-orange-900 rounded-lg border border-orange-700" },
                e('p', { className: "text-sm text-orange-300 mb-1" }, 'Materials Cost'),
                e('p', { className: "text-2xl font-bold text-orange-400" }, '$', metrics.totalMaterials.toLocaleString())
            ),
            e('div', { className: "p-4 bg-pink-900 rounded-lg border border-pink-700" },
                e('p', { className: "text-sm text-pink-300 mb-1" }, 'Labor Cost'),
                e('p', { className: "text-2xl font-bold text-pink-400" }, '$', metrics.totalLaborCost.toLocaleString())
            ),
            e('div', { className: "p-4 bg-cyan-900 rounded-lg border border-cyan-700" },
                e('p', { className: "text-sm text-cyan-300 mb-1" }, 'Travel Expenses'),
                e('p', { className: "text-2xl font-bold text-cyan-400" }, '$', metrics.totalTravelExpenses.toFixed(2))
            ),
            e('div', { className: "p-4 bg-emerald-900 rounded-lg border border-emerald-700" },
                e('p', { className: "text-sm text-emerald-300 mb-1" }, 'Remaining Budget'),
                e('p', { className: "text-2xl font-bold text-emerald-400" }, '$', metrics.remainingBudget.toLocaleString())
            ),
            e('div', { className: "p-4 bg-teal-900 rounded-lg border-2 border-teal-600" },
                e('p', { className: "text-sm text-teal-300 mb-1" }, 'Payments Received'),
                e('p', { className: "text-2xl font-bold text-teal-400" }, '$', metrics.totalPayments.toLocaleString())
            ),
            e('div', { className: "p-4 bg-amber-900 rounded-lg border-2 border-amber-600" },
                e('p', { className: "text-sm text-amber-300 mb-1" }, 'Outstanding Balance'),
                e('p', { className: "text-2xl font-bold text-amber-400" }, '$', metrics.outstandingBalance.toLocaleString())
            )
        )
    );
}
