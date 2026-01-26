// Materials Component - Track materials purchased
function Materials({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    // Helper function (fallback if utils.js not loaded yet)
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        cost: '',
        quantity: '',
        date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate()
    });

    const handleAdd = () => {
        if (!form.name.trim() || !form.cost) return;

        const newMaterial = {
            id: Date.now(),
            name: form.name.trim(),
            cost: parseFloat(form.cost),
            quantity: form.quantity.trim() || 1,
            date: form.date
        };

        onUpdate({
            ...project,
            materials: [...project.materials, newMaterial]
        });

        setForm({ name: '', cost: '', quantity: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate() });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.name.trim() || !form.cost) return;

        onUpdate({
            ...project,
            materials: project.materials.map(m =>
                m.id === editing.id
                    ? { ...m, name: form.name.trim(), cost: parseFloat(form.cost), quantity: form.quantity.trim() || 1, date: form.date }
                    : m
            )
        });

        setEditing(null);
        setForm({ name: '', cost: '', quantity: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate() });
    };

    const handleDelete = (materialId) => {
        if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
            return;
        }
        
        onUpdate({
            ...project,
            materials: project.materials.filter(m => m.id !== materialId)
        });
    };

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-white" }, 'Materials Purchased')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-orange-500" },
            e('input', {
                type: "text",
                placeholder: "Material Name",
                value: form.name,
                onChange: e => setForm({ ...form, name: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Cost ($)",
                value: form.cost,
                onChange: e => setForm({ ...form, cost: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "text",
                placeholder: "Quantity (optional)",
                value: form.quantity,
                onChange: e => setForm({ ...form, quantity: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                }, 'Add'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ name: '', cost: '', quantity: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate() });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-amber-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Edit Material'),
            e('input', {
                type: "text",
                placeholder: "Material Name",
                value: form.name,
                onChange: e => setForm({ ...form, name: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Cost ($)",
                value: form.cost,
                onChange: e => setForm({ ...form, cost: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "text",
                placeholder: "Quantity (optional)",
                value: form.quantity,
                onChange: e => setForm({ ...form, quantity: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white"
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
                        setForm({ name: '', cost: '', quantity: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate() });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Materials List
        e('div', { className: "space-y-2" },
            project.materials.map(material =>
                e('div', {
                    key: material.id,
                    className: "p-3 bg-slate-700 rounded-lg border border-slate-600"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', null,
                            e('h3', { className: "font-semibold text-white" }, material.name),
                            e('p', { className: "text-sm text-slate-400" },
                                material.date, ' • Qty: ', material.quantity, ' • $', material.cost.toLocaleString()
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(material);
                                    setForm({
                                        name: material.name,
                                        cost: material.cost.toString(),
                                        quantity: material.quantity.toString(),
                                        date: material.date
                                    });
                                },
                                className: "p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(material.id),
                                className: "p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
