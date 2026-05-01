/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  Wallet, 
  ArrowRight, 
  History, 
  Plus, 
  Info,
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface CalculationResult {
  compra: number;
  venda: number;
  qtd: number;
  lucro: number;
  margem: number;
  timestamp: number;
}

export default function App() {
  // Calculator State
  const [compra, setCompra] = useState<string>('45000');
  const [venda, setVenda] = useState<string>('62500');
  const [qtd, setQtd] = useState<string>('120');
  const [history, setHistory] = useState<CalculationResult[]>([]);

  // Simulator State
  const [capInicial, setCapInicial] = useState<string>('500000');
  const [lucroDiario, setLucroDiario] = useState<string>('15000');
  const [reinvestPct, setReinvestPct] = useState<number>(80);

  // Derived Values - Calculator
  const currentCalc = useMemo(() => {
    const c = parseFloat(compra);
    const v = parseFloat(venda);
    const q = parseFloat(qtd);
    
    if (!isNaN(c) && !isNaN(v) && !isNaN(q)) {
      const lucro = (v - c) * q;
      const margem = ((v - c) / v) * 100;
      return { lucro, margem };
    }
    return null;
  }, [compra, venda, qtd]);

  const handleSaveCalc = () => {
    if (currentCalc && compra && venda && qtd) {
      const newResult: CalculationResult = {
        compra: parseFloat(compra),
        venda: parseFloat(venda),
        qtd: parseFloat(qtd),
        lucro: currentCalc.lucro,
        margem: currentCalc.margem,
        timestamp: Date.now()
      };
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    }
  };

  // Derived Values - Simulator
  const simulation = useMemo(() => {
    const cap = parseFloat(capInicial);
    const lucro = parseFloat(lucroDiario);
    
    if (isNaN(cap) || isNaN(lucro)) return null;

    const grow = (days: number) => cap + (lucro * (reinvestPct / 100) * days);

    return {
      mes1: grow(30),
      mes3: grow(90),
      mes6: grow(180),
      ano1: grow(365)
    };
  }, [capInicial, lucroDiario, reinvestPct]);

  const formatKz = (val: number) => {
    return val.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Kz';
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight">
            Kwanza<span className="text-emerald-500 neon-glow">Flow</span>
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/40 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
          Acesso Premium • Luanda
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-6">
        
        <div className="space-y-6">
          {/* Calculator Section */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sleek-card flex flex-col"
          >
            <h2 className="sleek-title">Calculadora de Lucro</h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1">Preço de Compra (Kz)</label>
                <input 
                  type="number" 
                  value={compra}
                  onChange={(e) => setCompra(e.target.value)}
                  className="sleek-input w-full"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1">Preço de Venda (Kz)</label>
                <input 
                  type="number" 
                  value={venda}
                  onChange={(e) => setVenda(e.target.value)}
                  className="sleek-input w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1">Quantidade Stock</label>
                <input 
                  type="number" 
                  value={qtd}
                  onChange={(e) => setQtd(e.target.value)}
                  className="sleek-input w-full"
                />
              </div>

              <button 
                onClick={handleSaveCalc}
                className="sleek-btn w-full mt-2"
              >
                Atualizar Fluxo
              </button>

              <div className="pt-6 mt-4 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider mb-1">Margem Estimada</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-emerald-500">
                    {currentCalc ? currentCalc.margem.toFixed(1) : '0.0'}%
                  </span>
                  {currentCalc && (
                    <span className="text-sm font-mono text-zinc-500">
                      ({formatKz(currentCalc.lucro/parseFloat(qtd))} unid.)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Market Indicators */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sleek-card flex flex-col gap-4"
          >
            <h2 className="sleek-title">Câmbio de Hoje</h2>
            <div className="space-y-3">
              {[
                { pair: 'USD/AOA', trend: '+0.12%', val: '825,45' },
                { pair: 'EUR/AOA', trend: '+0.05%', val: '890,12' }
              ].map((m, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-dashed border-zinc-800 last:border-none last:pb-0">
                  <span className="text-xs font-medium text-zinc-300">{m.pair}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">{m.trend} ↑</span>
                  <span className="text-xs font-mono font-bold text-zinc-200">{m.val}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="space-y-6">
          {/* Wealth Simulator Section */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sleek-card h-full flex flex-col"
          >
            <h2 className="sleek-title">Simulação de Reinvestimento (Compounding)</h2>
            <p className="text-sm text-zinc-400 mb-8">Projeção baseada em reinvestimento de {reinvestPct}% do lucro líquido mensal.</p>

            <div className="space-y-1 mb-8">
              <div className="flex justify-between items-center mb-6 gap-8">
                 <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Investimento Inicial</label>
                  <input type="number" value={capInicial} onChange={e => setCapInicial(e.target.value)} className="sleek-input w-full" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Lucro Diário</label>
                  <input type="number" value={lucroDiario} onChange={e => setLucroDiario(e.target.value)} className="sleek-input w-full" />
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-6">
              {[
                { label: '30 Dias', value: simulation?.mes1 ?? 0, width: '15%' },
                { label: '90 Dias', value: simulation?.mes3 ?? 0, width: '35%' },
                { label: '180 Dias', value: simulation?.mes6 ?? 0, width: '65%' },
                { label: '365 Dias', value: simulation?.ano1 ?? 0, width: '100%' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-zinc-800 last:border-none">
                  <span className="w-20 text-[13px] font-bold text-zinc-300">{p.label}</span>
                  <div className="flex-grow h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: p.width }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-emerald-500/80"
                    />
                  </div>
                  <span className="w-32 text-right font-mono font-bold text-[13px]">{formatKz(p.value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl flex justify-between items-end">
              <div>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Património Final Est.</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-mono text-emerald-500 leading-none">
                    {(simulation?.ano1 ?? 0).toLocaleString('pt-AO')}
                  </span>
                  <span className="text-lg font-bold text-emerald-500/60 uppercase">Kz</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Crescimento Est.</p>
                <div className="text-xl font-bold font-mono text-emerald-500">
                  +{(((simulation?.ano1 ?? 0) / parseFloat(capInicial) - 1) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* History / Recent Activity */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sleek-card"
          >
            <h2 className="sleek-title">Fluxo Recente</h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {history.length > 0 ? (
                  history.map((item) => (
                    <motion.div 
                      key={item.timestamp}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between items-center pb-3 border-b border-zinc-800 last:border-none last:pb-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Venda: {formatKz(item.venda)}</span>
                        <span className="text-xs font-bold text-zinc-300">Qtd: {item.qtd} unidades</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-emerald-500">+{formatKz(item.lucro)}</span>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">Liquidado em {new Date(item.timestamp).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic py-4">Sem histórico de transações.</p>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-zinc-900">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
          KwanzaFlow Digital Infrastructure • v2.4.0
        </p>
      </footer>
    </div>
  );
}
