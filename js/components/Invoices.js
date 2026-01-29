// Invoices Component - Track client invoices
function Invoices({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    // Helper function (fallback if utils.js not loaded yet)
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        amount: '',
        date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(),
        description: '',
        status: 'Pending'
    });

    const statusOptions = [
        'Pending',
        'Sent',
        'Paid',
        'Overdue',
        'Cancelled'
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-gray-100 text-gray-700',
            'Sent': 'bg-blue-100 text-blue-700',
            'Paid': 'bg-green-100 text-green-700',
            'Overdue': 'bg-red-100 text-red-700',
            'Cancelled': 'bg-slate-100 text-slate-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const handleAdd = () => {
        if (!form.amount) return;

        const newInvoice = {
            id: Date.now(),
            amount: parseFloat(form.amount),
            date: form.date,
            description: form.description.trim(),
            status: form.status
        };

        const invoices = project.invoices || [];
        onUpdate({
            ...project,
            invoices: [...invoices, newInvoice]
        });

        setForm({ amount: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), description: '', status: 'Pending' });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.amount) return;

        const invoices = project.invoices || [];
        onUpdate({
            ...project,
            invoices: invoices.map(inv =>
                inv.id === editing.id
                    ? { ...inv, amount: parseFloat(form.amount), date: form.date, description: form.description.trim(), status: form.status }
                    : inv
            )
        });

        setEditing(null);
        setForm({ amount: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), description: '', status: 'Pending' });
    };

    const handleDelete = (invoiceId) => {
        if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
            return;
        }
        
        const invoices = project.invoices || [];
        onUpdate({
            ...project,
            invoices: invoices.filter(inv => inv.id !== invoiceId)
        });
    };

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-white" }, 'Invoices')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))

        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-teal-500" },
            e('input', {
                type: "number",
                placeholder: "Invoice Amount ($)",
                value: form.amount,
                onChange: e => setForm({ ...form, amount: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            }),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('select', {
                value: form.status,
                onChange: e => setForm({ ...form, status: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                }, 'Add Invoice'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ amount: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), description: '', status: 'Pending' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-amber-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Edit Invoice'),
            e('input', {
                type: "number",
                placeholder: "Invoice Amount ($)",
                value: form.amount,
                onChange: e => setForm({ ...form, amount: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            }),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('select', {
                value: form.status,
                onChange: e => setForm({ ...form, status: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleUpdate,
                    className: "flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2"
                },
                    e(Icon, { d: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", size: 16 }),
                    ' Update'
                ),
                e('button', {
                    onClick: () => {
                        setEditing(null);
                        setForm({ amount: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), description: '', status: 'Pending' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Invoices List
        e('div', { className: "space-y-2" },
            (project.invoices || []).map(invoice =>
                e('div', {
                    key: invoice.id,
                    className: "p-3 bg-slate-700 rounded-lg border border-slate-600"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', { className: "flex-1" },
                            e('div', { className: "flex items-center gap-2 mb-1" },
                                e('h3', { className: "font-semibold text-teal-400" },
                                    '$', invoice.amount.toLocaleString()
                                ),
                                e('span', {
                                    className: `inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(invoice.status || 'Pending')}`
                                }, invoice.status || 'Pending')
                            ),
                            e('p', { className: "text-sm text-slate-400" },
                                invoice.date,
                                invoice.description ? ' • ' + invoice.description : ''
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(invoice);
                                    setForm({
                                        amount: invoice.amount.toString(),
                                        date: invoice.date,
                                        description: invoice.description || '',
                                        status: invoice.status || 'Pending'
                                    });
                                },
                                className: "p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(invoice.id),
                                className: "p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
