// TravelExpenses Component - Track travel expenses with mileage
function TravelExpenses({ project, onUpdate }) {
    const e = React.createElement;
    const { useState, useEffect } = React;

    // Helper function (fallback if utils.js not loaded yet)
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [showForm, setShowForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        teamMemberId: '',
        date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(),
        miles: '',
        mpg: '',
        fuelType: 'gas',
        description: ''
    });
    const [settingsForm, setSettingsForm] = useState({
        gas: 0,
        diesel: 0
    });

    // Close settings when project changes
    useEffect(() => {
        setShowSettings(false);
        setShowForm(false);
        setEditing(null);
    }, [project?.id]);

    // Calculate travel cost
    const calculateCost = (miles, mpg, fuelType) => {
        const fuelPrices = project.fuelPrices || { gas: 0, diesel: 0 };
        const pricePerGallon = fuelPrices[fuelType] || 0;
        const gallonsUsed = miles / mpg;
        return gallonsUsed * pricePerGallon;
    };

    // Helper function to get team member name
    const getMemberName = (memberId) => {
        const member = project?.teamMembers.find(m => m.id === Number(memberId));
        return member ? member.name : 'Unknown';
    };

    const handleAdd = () => {
        if (!form.teamMemberId || !form.miles || !form.mpg || !form.fuelType) return;

        const miles = parseFloat(form.miles);
        const mpg = parseFloat(form.mpg);
        const cost = calculateCost(miles, mpg, form.fuelType);

        const newExpense = {
            id: Date.now(),
            teamMemberId: Number(form.teamMemberId),
            date: form.date,
            miles: miles,
            mpg: mpg,
            fuelType: form.fuelType,
            cost: cost,
            description: form.description.trim()
        };

        const travelExpenses = project.travelExpenses || [];
        onUpdate({
            ...project,
            travelExpenses: [...travelExpenses, newExpense]
        });

        setForm({ 
            teamMemberId: '',
            date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), 
            miles: '', 
            mpg: '', 
            fuelType: 'gas', 
            description: '' 
        });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.teamMemberId || !form.miles || !form.mpg || !form.fuelType) return;

        const miles = parseFloat(form.miles);
        const mpg = parseFloat(form.mpg);
        const cost = calculateCost(miles, mpg, form.fuelType);

        const travelExpenses = project.travelExpenses || [];
        onUpdate({
            ...project,
            travelExpenses: travelExpenses.map(t =>
                t.id === editing.id
                    ? { ...t, teamMemberId: Number(form.teamMemberId), date: form.date, miles: miles, mpg: mpg, fuelType: form.fuelType, cost: cost, description: form.description.trim() }
                    : t
            )
        });

        setEditing(null);
        setForm({ 
            teamMemberId: '',
            date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), 
            miles: '', 
            mpg: '', 
            fuelType: 'gas', 
            description: '' 
        });
    };

    const handleDelete = (expenseId) => {
        if (!confirm('Are you sure you want to delete this travel expense? This action cannot be undone.')) {
            return;
        }
        
        const travelExpenses = project.travelExpenses || [];
        onUpdate({
            ...project,
            travelExpenses: travelExpenses.filter(t => t.id !== expenseId)
        });
    };

    // Calculate total travel costs
    const totalTravelCost = (project.travelExpenses || []).reduce((sum, t) => sum + t.cost, 0);
    const totalMiles = (project.travelExpenses || []).reduce((sum, t) => sum + t.miles, 0);

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-white" }, 'Travel Expenses')
            ),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: () => {
                        setSettingsForm({
                            gas: project.fuelPrices?.gas || 0,
                            diesel: project.fuelPrices?.diesel || 0
                        });
                        setShowSettings(true);
                    },
                    className: "p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700",
                    title: "Fuel Price Settings"
                }, e(Icon, { d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", size: 20 })),
                e('button', {
                    onClick: () => setShowForm(true),
                    className: "p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700",
                    title: "Add Travel Expense"
                }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
            )
        ),

        // Settings Form (Popup)
        showSettings && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-slate-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Fuel Price Settings'),
            e('div', { className: "grid grid-cols-2 gap-3 mb-3" },
                e('div', null,
                    e('label', { className: "block text-sm text-slate-300 mb-1" }, 'Gas ($/gal)'),
                    e('input', {
                        type: "number",
                        step: "0.01",
                        placeholder: "0.00",
                        value: settingsForm.gas || '',
                        onChange: e => setSettingsForm({ ...settingsForm, gas: e.target.value === '' ? 0 : parseFloat(e.target.value) }),
                        className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
                    })
                ),
                e('div', null,
                    e('label', { className: "block text-sm text-slate-300 mb-1" }, 'Diesel ($/gal)'),
                    e('input', {
                        type: "number",
                        step: "0.01",
                        placeholder: "0.00",
                        value: settingsForm.diesel || '',
                        onChange: e => setSettingsForm({ ...settingsForm, diesel: e.target.value === '' ? 0 : parseFloat(e.target.value) }),
                        className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
                    })
                )
            ),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: () => {
                        onUpdate({
                            ...project,
                            fuelPrices: {
                                gas: settingsForm.gas,
                                diesel: settingsForm.diesel
                            }
                        });
                        setShowSettings(false);
                    },
                    className: "flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                }, 'Save Settings'),
                e('button', {
                    onClick: () => setShowSettings(false),
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-cyan-500" },
            e('select', {
                value: form.teamMemberId,
                onChange: e => setForm({ ...form, teamMemberId: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                e('option', { value: "" }, 'Select Team Member'),
                project.teamMembers.map(tm =>
                    e('option', { key: tm.id, value: tm.id }, tm.name)
                )
            ),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            }),
            e('input', {
                type: "number",
                step: "0.1",
                placeholder: "Miles Driven",
                value: form.miles,
                onChange: e => setForm({ ...form, miles: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('div', { className: "grid grid-cols-2 gap-2 mb-2" },
                e('input', {
                    type: "number",
                    step: "0.1",
                    placeholder: "MPG",
                    value: form.mpg,
                    onChange: e => setForm({ ...form, mpg: e.target.value }),
                    className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
                }),
                e('select', {
                    value: form.fuelType,
                    onChange: e => setForm({ ...form, fuelType: e.target.value }),
                    className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
                },
                    e('option', { value: "gas" }, 'Gas'),
                    e('option', { value: "diesel" }, 'Diesel')
                )
            ),
            form.miles && form.mpg && form.fuelType && e('div', { className: "mb-2 p-2 bg-cyan-900 rounded text-center" },
                e('p', { className: "text-sm text-cyan-300" }, 'Calculated Cost: '),
                e('p', { className: "text-lg font-bold text-cyan-400" }, 
                    '$', calculateCost(parseFloat(form.miles), parseFloat(form.mpg), form.fuelType).toFixed(2)
                )
            ),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                }, 'Add'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ 
                            teamMemberId: '',
                            date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), 
                            miles: '', 
                            mpg: '', 
                            fuelType: 'gas', 
                            description: '' 
                        });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-amber-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Edit Travel Expense'),
            e('select', {
                value: form.teamMemberId,
                onChange: e => setForm({ ...form, teamMemberId: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                e('option', { value: "" }, 'Select Team Member'),
                project.teamMembers.map(tm =>
                    e('option', { key: tm.id, value: tm.id }, tm.name)
                )
            ),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            }),
            e('input', {
                type: "number",
                step: "0.1",
                placeholder: "Miles Driven",
                value: form.miles,
                onChange: e => setForm({ ...form, miles: e.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('div', { className: "grid grid-cols-2 gap-2 mb-2" },
                e('input', {
                    type: "number",
                    step: "0.1",
                    placeholder: "MPG",
                    value: form.mpg,
                    onChange: e => setForm({ ...form, mpg: e.target.value }),
                    className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
                }),
                e('select', {
                    value: form.fuelType,
                    onChange: e => setForm({ ...form, fuelType: e.target.value }),
                    className: "w-full p-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
                },
                    e('option', { value: "gas" }, 'Gas'),
                    e('option', { value: "diesel" }, 'Diesel')
                )
            ),
            form.miles && form.mpg && form.fuelType && e('div', { className: "mb-2 p-2 bg-cyan-900 rounded text-center" },
                e('p', { className: "text-sm text-cyan-300" }, 'Calculated Cost: '),
                e('p', { className: "text-lg font-bold text-cyan-400" }, 
                    '$', calculateCost(parseFloat(form.miles), parseFloat(form.mpg), form.fuelType).toFixed(2)
                )
            ),
            e('input', {
                type: "text",
                placeholder: "Description (optional)",
                value: form.description,
                onChange: e => setForm({ ...form, description: e.target.value }),
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
                        setForm({ 
                            teamMemberId: '',
                            date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), 
                            miles: '', 
                            mpg: '', 
                            fuelType: 'gas', 
                            description: '' 
                        });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Travel Expenses List
        e('div', { className: "space-y-2" },
            (project.travelExpenses || []).map(expense =>
                e('div', {
                    key: expense.id,
                    className: "p-3 bg-slate-700 rounded-lg border border-slate-600"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', null,
                            e('h3', { className: "font-semibold text-cyan-400" },
                                getMemberName(expense.teamMemberId),
                                expense.description ? ' • ' + expense.description : ''
                            ),
                            e('p', { className: "text-sm text-slate-400" },
                                expense.date, ' • ',
                                expense.miles, ' miles @ ', expense.mpg, ' MPG • ',
                                expense.fuelType === 'diesel' ? 'Diesel' : 'Gas'
                            ),
                            e('p', { className: "text-sm font-semibold text-cyan-400 mt-1" },
                                'Cost: $', expense.cost.toFixed(2)
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(expense);
                                    setForm({
                                        teamMemberId: expense.teamMemberId,
                                        date: expense.date,
                                        miles: expense.miles.toString(),
                                        mpg: expense.mpg.toString(),
                                        fuelType: expense.fuelType || 'gas',
                                        description: expense.description || ''
                                    });
                                },
                                className: "p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(expense.id),
                                className: "p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
