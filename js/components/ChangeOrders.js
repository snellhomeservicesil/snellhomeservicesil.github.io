// ChangeOrders Component - Manage change orders
function ChangeOrders({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ description: '', price: '' });

    const handleAdd = () => {
        if (!form.description.trim() || !form.price) return;

        const newChangeOrder = {
            id: Date.now(),
            description: form.description.trim(),
            price: parseFloat(form.price)
        };

        onUpdate({
            ...project,
            changeOrders: [...project.changeOrders, newChangeOrder]
        });

        setForm({ description: '', price: '' });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.description.trim() || !form.price) return;

        onUpdate({
            ...project,
            changeOrders: project.changeOrders.map(co =>
                co.id === editing.id
                    ? { ...co, description: form.description.trim(), price: parseFloat(form.price) }
                    : co
            )
        });

        setEditing(null);
        setForm({ description: '', price: '' });
    };

    const handleDelete = (changeOrderId) => {
        if (!confirm('Are you sure you want to delete this change order? This action cannot be undone.')) {
            return;
        }
        
        onUpdate({
            ...project,
            changeOrders: project.changeOrders.filter(co => co.id !== changeOrderId)
        });
    };

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-white" }, 'Change Orders')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-purple-500" },
            e('input', {
                type: "text",
                placeholder: "Description",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Price Adjustment ($)",
                value: form.price,
                onChange: e => setForm({ ...form, price: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                }, 'Add'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ description: '', price: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-amber-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Edit Change Order'),
            e('input', {
                type: "text",
                placeholder: "Description",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Price Adjustment ($)",
                value: form.price,
                onChange: e => setForm({ ...form, price: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
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
                        setForm({ description: '', price: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Change Orders List
        e('div', { className: "space-y-2" },
            project.changeOrders.map(co =>
                e('div', {
                    key: co.id,
                    className: "p-3 bg-slate-700 rounded-lg border border-slate-600"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', null,
                            e('h3', { className: "font-semibold text-white" }, co.description),
                            e('p', { className: "text-sm text-green-400 font-semibold" },
                                '+$', co.price.toLocaleString()
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(co);
                                    setForm({
                                        description: co.description,
                                        price: co.price.toString()
                                    });
                                },
                                className: "p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(co.id),
                                className: "p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
