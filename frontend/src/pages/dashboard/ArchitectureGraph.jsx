import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { AlertTriangle, Filter, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ArchitectureGraph() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const highlights = searchParams.get('highlight')?.split(',') || [];
    const searchMatch = searchParams.get('search') || '';
    const highlightList = [...highlights, searchMatch].map(s => s?.trim()).filter(Boolean);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showMyTeamOnly, setShowMyTeamOnly] = useState(false);
    const [criticalCount, setCriticalCount] = useState(0);

    useEffect(() => {
        const buildGraph = async () => {
            try {
                const token = localStorage.getItem('archtrace_token');
                const [svcRes, depRes] = await Promise.all([
                    fetch('http://localhost:8080/api/services', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:8080/api/dependencies', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                let allServices = svcRes.ok ? await svcRes.json() : [];
                let allDeps = depRes.ok ? await depRes.json() : [];

                // Count critical services for risk badge
                setCriticalCount(allServices.filter(s => s.status === 'Critical').length);

                // Filter by team if toggled
                let services = allServices;
                let deps = allDeps;

                if (showMyTeamOnly && user?.team) {
                    services = allServices.filter(s => s.team === user.team);
                    deps = allDeps.filter(d =>
                        services.some(s => s.name === d.source) &&
                        services.some(s => s.name === d.target)
                    );
                }

                // --- Layout: group services into team columns ---
                // Sort teams so order is deterministic
                const teams = [...new Set(services.map(s => s.team || 'Unassigned'))].sort();
                const COLUMN_WIDTH = 300;   // px between team columns
                const ROW_HEIGHT = 160;     // px between nodes in same column
                const NODE_WIDTH = 220;
                const START_X = 60;
                const START_Y = 60;

                // Count services per team to center column vertically
                const teamXMap = {};
                teams.forEach((team, i) => {
                    teamXMap[team] = START_X + i * (NODE_WIDTH + COLUMN_WIDTH);
                });

                const teamCounts = {};

                const newNodes = services.map((srv) => {
                    const team = srv.team || 'Unassigned';
                    const rowIndex = teamCounts[team] ?? 0;
                    teamCounts[team] = rowIndex + 1;

                    const isHighlighted = highlightList.includes(srv.name);

                    return {
                        id: srv.name,
                        position: {
                            x: teamXMap[team],
                            y: START_Y + rowIndex * ROW_HEIGHT
                        },
                        data: {
                            label: (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{srv.name}</div>
                                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{team}</div>
                                    <div style={{
                                        marginTop: 6,
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: 12,
                                        fontSize: 10,
                                        fontWeight: 600,
                                        background: srv.status === 'Critical' ? '#FEE2E2'
                                            : srv.status === 'Warning' ? '#FEF3C7' : '#D1FAE5',
                                        color: srv.status === 'Critical' ? '#DC2626'
                                            : srv.status === 'Warning' ? '#D97706' : '#059669'
                                    }}>
                                        {srv.status || 'Healthy'}
                                    </div>
                                </div>
                            )
                        },
                        style: {
                            background: isHighlighted ? '#EEF2FF'
                                : srv.status === 'Critical' ? '#FEF2F2'
                                    : srv.status === 'Warning' ? '#FFFBEB' : '#FFFFFF',
                            borderColor: isHighlighted ? '#4F46E5'
                                : srv.status === 'Critical' ? '#EF4444'
                                    : srv.status === 'Warning' ? '#F59E0B' : '#C7D2FE',
                            borderWidth: isHighlighted ? 3 : 1.5,
                            borderRadius: 14,
                            width: NODE_WIDTH,
                            boxShadow: isHighlighted
                                ? '0 0 0 4px rgba(79,70,229,0.2), 0 4px 16px rgba(79,70,229,0.15)'
                                : '0 2px 8px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s'
                        }
                    };
                });

                const newEdges = deps.map((dep, index) => ({
                    id: `e-${dep.source}-${dep.target}-${index}`,
                    source: dep.source,
                    target: dep.target,
                    animated: true,
                    label: dep.type,
                    type: 'smoothstep',
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 20,
                        height: 20,
                        color: dep.risk === 'High' ? '#EF4444' : dep.risk === 'Medium' ? '#F59E0B' : '#10B981',
                    },
                    style: {
                        stroke: dep.risk === 'High' ? '#EF4444' : dep.risk === 'Medium' ? '#F59E0B' : '#10B981',
                        strokeWidth: 2.5,
                    },
                    labelStyle: { fill: '#0f172a', fontWeight: 700, fontSize: 11 },
                    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95 },
                    labelBgPadding: [6, 4],
                    labelBgBorderRadius: 6,
                }));

                setNodes(newNodes);
                setEdges(newEdges);
            } catch (err) {
                console.error('Error building graph:', err);
            }
        };

        buildGraph();
    }, [setNodes, setEdges, showMyTeamOnly, user, highlightList.join(',')]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const riskLabel = criticalCount > 0 ? `${criticalCount} Critical` : 'All Healthy';
    const riskStyle = criticalCount > 0
        ? 'bg-rose-50 border-rose-100 text-rose-700'
        : 'bg-emerald-50 border-emerald-100 text-emerald-700';
    const RiskIcon = criticalCount > 0 ? AlertTriangle : CheckCircle;

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 112px)' }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-slate-800 tracking-tight">Architecture Visualization</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Interactive graph of your microservices ecosystem.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMyTeamOnly(prev => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${showMyTeamOnly
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                    >
                        {showMyTeamOnly ? <Users size={16} /> : <Filter size={16} />}
                        {showMyTeamOnly ? 'My Team Only' : 'All Services'}
                    </button>
                    <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-sm font-medium ${riskStyle}`}>
                        <RiskIcon size={15} /> {riskLabel}
                    </div>
                </div>
            </div>

            {/* Graph Canvas */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative"
            >
                {/* Legend */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm text-xs space-y-2">
                    <p className="font-semibold text-slate-700 mb-1">Legend</p>
                    <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-rose-500 rounded" /> <span className="text-slate-600">High Risk</span></div>
                    <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-amber-400 rounded" /> <span className="text-slate-600">Medium Risk</span></div>
                    <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-emerald-500 rounded" /> <span className="text-slate-600">Low Risk</span></div>
                    <div className="border-t border-slate-100 pt-2 mt-1 space-y-1">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-50 border-2 border-indigo-500" /> <span className="text-slate-600">Highlighted</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-rose-50 border border-rose-400" /> <span className="text-slate-600">Critical</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-400" /> <span className="text-slate-600">Warning</span></div>
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    minZoom={0.2}
                    maxZoom={2}
                    attributionPosition="bottom-right"
                    className="bg-slate-50/70"
                >
                    <MiniMap
                        nodeStrokeColor={(n) => n.style?.borderColor || '#6366f1'}
                        nodeColor={(n) => n.style?.background || '#fff'}
                        nodeBorderRadius={6}
                        className="rounded-xl shadow border border-slate-200"
                        style={{ bottom: 16, right: 16 }}
                    />
                    <Controls className="rounded-lg shadow-sm border border-slate-200 bg-white" style={{ bottom: 16, left: 16 }} />
                    <Background color="#CBD5E1" gap={20} size={1} />
                </ReactFlow>
            </motion.div>
        </div>
    );
}
