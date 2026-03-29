(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/supabase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = 'https://paaaywnelsfpfdkurvju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYWF5d25lbHNmcGZka3Vydmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDEyMjIsImV4cCI6MjA5MDMxNzIyMn0.gds0HFCx0jQ41wvqaYUiZ3REmNY_0z5wnejTrDoe1hs';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/sala/[id]/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SalaPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const FLAVORS = [
    'Carne Suave',
    'Carne Picante',
    'Jamón y Queso',
    'Humita',
    'Pollo',
    'Roquefort'
];
function SalaPage() {
    _s();
    const { id: salaId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [userName, setUserName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [hasName, setHasName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pedidos, setPedidos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [copyStatus, setCopyStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Copiar Link');
    const [newFlavor, setNewFlavor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Load initial data and Setup Realtime
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SalaPage.useEffect": ()=>{
            if (!salaId) return;
            // Check localStorage for name
            const storedName = localStorage.getItem('empanadas_user_name');
            if (storedName) {
                setUserName(storedName);
                setHasName(true);
            }
            const fetchPedidos = {
                "SalaPage.useEffect.fetchPedidos": async ()=>{
                    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('pedidos').select('*').eq('sala_id', salaId);
                    if (!error && data) {
                        setPedidos(data);
                    }
                    setLoading(false);
                }
            }["SalaPage.useEffect.fetchPedidos"];
            fetchPedidos();
            // Realtime subscription
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel(`public:pedidos:sala_id=eq.${salaId}`).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'pedidos',
                filter: `sala_id=eq.${salaId}`
            }, {
                "SalaPage.useEffect.channel": (payload)=>{
                    if (payload.eventType === 'INSERT') {
                        setPedidos({
                            "SalaPage.useEffect.channel": (prev)=>[
                                    ...prev,
                                    payload.new
                                ]
                        }["SalaPage.useEffect.channel"]);
                    } else if (payload.eventType === 'UPDATE') {
                        setPedidos({
                            "SalaPage.useEffect.channel": (prev)=>prev.map({
                                    "SalaPage.useEffect.channel": (p)=>p.id === payload.new.id ? payload.new : p
                                }["SalaPage.useEffect.channel"])
                        }["SalaPage.useEffect.channel"]);
                    } else if (payload.eventType === 'DELETE') {
                        setPedidos({
                            "SalaPage.useEffect.channel": (prev)=>prev.filter({
                                    "SalaPage.useEffect.channel": (p)=>p.id !== payload.old.id
                                }["SalaPage.useEffect.channel"])
                        }["SalaPage.useEffect.channel"]);
                    }
                }
            }["SalaPage.useEffect.channel"]).subscribe();
            return ({
                "SalaPage.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                }
            })["SalaPage.useEffect"];
        }
    }["SalaPage.useEffect"], [
        salaId
    ]);
    const saveName = ()=>{
        if (!userName.trim()) return;
        localStorage.setItem('empanadas_user_name', userName.trim());
        setHasName(true);
    };
    const copyLink = async ()=>{
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyStatus('¡Copiado!');
            setTimeout(()=>setCopyStatus('Copiar Link'), 2000);
        } catch (err) {
            console.error('Error copying link', err);
            setCopyStatus('Error');
            setTimeout(()=>setCopyStatus('Copiar Link'), 2000);
        }
    };
    // Optimize calculations
    const myOrdersRaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SalaPage.useMemo[myOrdersRaw]": ()=>{
            return pedidos.filter({
                "SalaPage.useMemo[myOrdersRaw]": (p)=>p.nombre_persona === userName
            }["SalaPage.useMemo[myOrdersRaw]"]);
        }
    }["SalaPage.useMemo[myOrdersRaw]"], [
        pedidos,
        userName
    ]);
    const getMyQty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SalaPage.useCallback[getMyQty]": (flavor)=>{
            const order = myOrdersRaw.find({
                "SalaPage.useCallback[getMyQty].order": (o)=>o.gusto === flavor
            }["SalaPage.useCallback[getMyQty].order"]);
            return order ? order.cantidad : 0;
        }
    }["SalaPage.useCallback[getMyQty]"], [
        myOrdersRaw
    ]);
    const updateQuantity = async (flavor, delta)=>{
        const currentQty = getMyQty(flavor);
        const newQty = Math.max(0, currentQty + delta);
        if (currentQty === newQty) return; // no change
        // Check if the row exists for this user and flavor
        const existingOrder = myOrdersRaw.find((o)=>o.gusto === flavor);
        if (existingOrder) {
            // update
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('pedidos').update({
                cantidad: newQty
            }).eq('id', existingOrder.id);
        } else {
            // insert
            if (newQty > 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('pedidos').insert([
                    {
                        sala_id: salaId,
                        nombre_persona: userName,
                        gusto: flavor,
                        cantidad: newQty
                    }
                ]);
            }
        }
    };
    const handleAddCustomFlavor = ()=>{
        if (!newFlavor.trim()) return;
        const flavor = newFlavor.trim();
        updateQuantity(flavor, 1);
        setNewFlavor('');
    };
    const allFlavors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SalaPage.useMemo[allFlavors]": ()=>{
            const customFlavors = new Set(pedidos.map({
                "SalaPage.useMemo[allFlavors]": (p)=>p.gusto
            }["SalaPage.useMemo[allFlavors]"]));
            FLAVORS.forEach({
                "SalaPage.useMemo[allFlavors]": (f)=>customFlavors.delete(f)
            }["SalaPage.useMemo[allFlavors]"]);
            return [
                ...FLAVORS,
                ...Array.from(customFlavors)
            ];
        }
    }["SalaPage.useMemo[allFlavors]"], [
        pedidos
    ]);
    const totalsByFlavor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SalaPage.useMemo[totalsByFlavor]": ()=>{
            const totals = {};
            allFlavors.forEach({
                "SalaPage.useMemo[totalsByFlavor]": (f)=>totals[f] = 0
            }["SalaPage.useMemo[totalsByFlavor]"]);
            pedidos.forEach({
                "SalaPage.useMemo[totalsByFlavor]": (p)=>{
                    if (totals[p.gusto] !== undefined) {
                        totals[p.gusto] += p.cantidad;
                    } else {
                        totals[p.gusto] = p.cantidad;
                    }
                }
            }["SalaPage.useMemo[totalsByFlavor]"]);
            return totals;
        }
    }["SalaPage.useMemo[totalsByFlavor]"], [
        pedidos,
        allFlavors
    ]);
    const grandTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SalaPage.useMemo[grandTotal]": ()=>{
            return Object.values(totalsByFlavor).reduce({
                "SalaPage.useMemo[grandTotal]": (a, b)=>a + b
            }["SalaPage.useMemo[grandTotal]"], 0);
        }
    }["SalaPage.useMemo[grandTotal]"], [
        totalsByFlavor
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-panel text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Cargando sala..."
            }, void 0, false, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 163,
                columnNumber: 53
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/sala/[id]/page.jsx",
            lineNumber: 163,
            columnNumber: 12
        }, this);
    }
    if (!hasName) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-panel text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "¿Cuál es tu nombre?"
                }, void 0, false, {
                    fileName: "[project]/src/app/sala/[id]/page.jsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Ingresá tu nombre para sumarte al pedido de esta sala."
                }, void 0, false, {
                    fileName: "[project]/src/app/sala/[id]/page.jsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginTop: '2rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Ej: Fede",
                            value: userName,
                            onChange: (e)=>setUserName(e.target.value),
                            onKeyDown: (e)=>e.key === 'Enter' && saveName(),
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/sala/[id]/page.jsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn-primary",
                            onClick: saveName,
                            children: "Entrar a la sala"
                        }, void 0, false, {
                            fileName: "[project]/src/app/sala/[id]/page.jsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/sala/[id]/page.jsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/sala/[id]/page.jsx",
            lineNumber: 168,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-panel",
        style: {
            paddingBottom: '8rem',
            position: 'relative',
            minHeight: '80vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            margin: 0
                        },
                        children: "Sala de Pedido"
                    }, void 0, false, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn-success",
                        onClick: copyLink,
                        style: {
                            padding: '0.5rem 1rem'
                        },
                        children: copyStatus
                    }, void 0, false, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Hola ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: userName
                    }, void 0, false, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 195,
                        columnNumber: 15
                    }, this),
                    ", elegí tus gustos:"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list-container",
                style: {
                    maxHeight: 'none'
                },
                children: allFlavors.map((flavor)=>{
                    const qty = getMyQty(flavor);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "list-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 500
                                },
                                children: flavor
                            }, void 0, false, {
                                fileName: "[project]/src/app/sala/[id]/page.jsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "counter-control",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn-icon",
                                        onClick: ()=>updateQuantity(flavor, -1),
                                        disabled: qty === 0,
                                        children: "−"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "counter-value",
                                        children: qty
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                                        lineNumber: 211,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn-icon",
                                        onClick: ()=>updateQuantity(flavor, 1),
                                        children: "+"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sala/[id]/page.jsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this)
                        ]
                    }, flavor, true, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Añadir otro gusto (ej. Cebolla)",
                        value: newFlavor,
                        onChange: (e)=>setNewFlavor(e.target.value),
                        onKeyDown: (e)=>e.key === 'Enter' && handleAddCustomFlavor(),
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn-primary",
                        style: {
                            marginTop: 0,
                            width: 'auto'
                        },
                        onClick: handleAddCustomFlavor,
                        children: "Agregar"
                    }, void 0, false, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 2rem)',
                    maxWidth: '580px',
                    background: 'var(--surface)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: '2px solid var(--border)',
                    boxShadow: '0 -4px 10px rgba(0,0,0,0.1), 4px 4px 0px 0px var(--border)',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            margin: 0,
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Total en vivo"
                            }, void 0, false, {
                                fileName: "[project]/src/app/sala/[id]/page.jsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    grandTotal,
                                    " empanadas"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sala/[id]/page.jsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            maxHeight: '100px',
                            overflowY: 'auto'
                        },
                        children: [
                            Object.entries(totalsByFlavor).filter(([f, qty])=>qty > 0).map(([f, qty])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: 'var(--accent)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    },
                                    children: [
                                        qty,
                                        " ",
                                        f
                                    ]
                                }, f, true, {
                                    fileName: "[project]/src/app/sala/[id]/page.jsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this)),
                            grandTotal === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem'
                                },
                                children: "Nadie pidió todavía..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/sala/[id]/page.jsx",
                                lineNumber: 264,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sala/[id]/page.jsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sala/[id]/page.jsx",
                lineNumber: 239,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/sala/[id]/page.jsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
_s(SalaPage, "PgugrQIYA9P6UtXpdjQ+d/yIbIs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = SalaPage;
var _c;
__turbopack_context__.k.register(_c, "SalaPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0w3s_z-._.js.map