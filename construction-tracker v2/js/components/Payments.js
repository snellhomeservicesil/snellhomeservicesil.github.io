// Payments Component - Track client payments
function Payments({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        amount: '',
        date: getTodayISODate(),
        description: ''
    });

    const handleAdd = () => {
        if (!form.amount) return;

        const newPayment = {
            id: Date.now(),
            amount: parseFloat(form.amount),
            date: form.date,
            description: form.description
        };

        const payments = project.payments || [];
        onUpdate({
            ...project,
            payments: [...payments, newPayment]
        });

        setForm({ amount: '', date: getTodayISODate(), description: '' });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.amount) return;

        const payments = project.payments || [];
        onUpdate({
            ...project,
            payments: payments.map(p =>
                p.id === editing.id
                    ? { ...p, amount: parseFloat(form.amount), date: form.date, description: form.description }
                    : p
            )
        });

        setEditing(null);
        setForm({ amount: '', date: getTodayISODate(), description: '' });
    };

    const handleDelete = (paymentId) => {
        const payments = project.payments || [];
        onUpdate({
            ...project,
            payments: payments.filter(p => p.id !== paymentId)
        });
    };

    return e('div', { className: "bg-white rounded-xl shadow-lg p-6" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-slate-800" }, 'Client Payments')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-50 rounded-lg border-2 border-teal-200" },
            e('input', {
                type: "number",
                placeholder: "Payment Amount ($)",
                value: form.amount,
                onChange: e => setForm({ ...form, amount: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                }, 'Add Payment'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ amount: '', date: getTodayISODate(), description: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300" },
            e('h3', { className: "font-semibold mb-3 text-slate-700" }, 'Edit Payment'),
            e('input', {
                type: "number",
                placeholder: "Payment Amount ($)",
                value: form.amount,
                onChange: e => setForm({ ...form, amount: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleUpdate,
                    className: "flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                }, 'Update'),
                e('button', {
                    onClick: () => {
                        setEditing(null);
                        setForm({ amount: '', date: getTodayISODate(), description: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Payments List
        e('div', { className: "space-y-2" },
            (project.payments || []).map(payment =>
                e('div', {
                    key: payment.id,
                    className: "p-3 bg-slate-50 rounded-lg border border-slate-200"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', null,
                            e('h3', { className: "font-semibold text-teal-700" },
                                '$', payment.amount.toLocaleString()
                            ),
                            e('p', { className: "text-sm text-slate-600" },
                                payment.date,
                                payment.description ? ' • ' + payment.description : ''
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(payment);
                                    setForm({
                                        amount: payment.amount.toString(),
                                        date: payment.date,
                                        description: payment.description || ''
                                    });
                                },
                                className: "p-1 text-blue-600 hover:bg-blue-100 rounded"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(payment.id),
                                className: "p-1 text-red-600 hover:bg-red-100 rounded"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
