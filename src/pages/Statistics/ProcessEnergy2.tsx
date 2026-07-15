import { useState } from 'react';
import { BarChart } from '@/components/Chart/BarChart';
import { processEnergyData } from '@/data/analysisData';
import type { ProcessEnergyData } from '@/types/energy';

export default function ProcessEnergy2() {
  const [selectedProcess, setSelectedProcess] = useState<string>(processEnergyData[0]?.processId || '');

  const processes = processEnergyData;

  const getSelectedProcessData = (): ProcessEnergyData | undefined => {
    return processes.find(p => p.processId === selectedProcess);
  };

  const selectedProcessData = getSelectedProcessData();

  const getOptimizationSuggestions = () => {
    if (!selectedProcessData) return [];
    return selectedProcessData.stages
      .filter(stage => stage.efficiency < 85)
      .map(stage => ({
        stage: stage.name,
        efficiency: stage.efficiency,
        suggestion: `建议优化"${stage.name}"环节，当前效率${stage.efficiency.toFixed(1)}%，可通过工艺改进或设备升级提升能效。`
      }));
  };

  const suggestions = getOptimizationSuggestions();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">工艺能耗2（宏创）</h1>
          <div className="text-sm text-gray-500">
            数据更新时间：{new Date().toLocaleString('zh-CN')}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-3">工艺选择</div>
          <div className="flex gap-2">
            {processes.map(process => (
              <button
                key={process.processId}
                onClick={() => setSelectedProcess(process.processId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedProcess === process.processId
                    ? 'bg-[#10469c] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {process.processName}
              </button>
            ))}
          </div>
        </div>

        {selectedProcessData && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-4">
              {selectedProcessData.processName} - 工艺流程
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {selectedProcessData.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-[180px]">
                    <div className="text-gray-800 font-medium mb-2">{stage.name}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">能耗: </span>
                        <span className="text-[#1d90ff] font-mono">
                          {(stage.energy / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">时长: </span>
                        <span className="text-gray-800 font-mono">{stage.duration}h</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">效率: </span>
                        <span className={`font-mono ${
                          stage.efficiency >= 90 ? 'text-emerald-500' :
                          stage.efficiency >= 80 ? 'text-amber-500' :
                          'text-red-500'
                        }`}>
                          {stage.efficiency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < selectedProcessData.stages.length - 1 && (
                    <div className="flex-shrink-0 w-8 text-gray-300 text-2xl">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProcessData && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">工艺名称</div>
              <div className="text-xl font-bold text-gray-800">{selectedProcessData.processName}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">总能耗</div>
              <div className="text-2xl font-bold text-[#1d90ff] font-mono">
                {(selectedProcessData.totalEnergy / 1000000).toFixed(2)}M
                <span className="text-sm ml-1 text-gray-500">kW·h</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">总时长</div>
              <div className="text-2xl font-bold text-gray-800 font-mono">
                {selectedProcessData.stages.reduce((sum, s) => sum + s.duration, 0).toFixed(1)}
                <span className="text-sm ml-1 text-gray-500">小时</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-2">平均效率</div>
              <div className="text-2xl font-bold text-emerald-500 font-mono">
                {(selectedProcessData.stages.reduce((sum, s) => sum + s.efficiency, 0) / selectedProcessData.stages.length).toFixed(1)}
                <span className="text-sm ml-1 text-gray-500">%</span>
              </div>
            </div>
          </div>
        )}

        {selectedProcessData && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-4">各环节能耗统计</div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#2c5bb5]">
                  <th className="text-left py-2 text-sm font-medium text-white">序号</th>
                  <th className="text-left py-2 text-sm font-medium text-white">环节名称</th>
                  <th className="text-right py-2 text-sm font-medium text-white">能耗(kW·h)</th>
                  <th className="text-right py-2 text-sm font-medium text-white">时长(h)</th>
                  <th className="text-right py-2 text-sm font-medium text-white">效率</th>
                  <th className="text-right py-2 text-sm font-medium text-white">占比</th>
                </tr>
              </thead>
              <tbody>
                {selectedProcessData.stages.map((stage, index) => {
                  const percent = (stage.energy / selectedProcessData.totalEnergy * 100).toFixed(1);
                  return (
                    <tr
                      key={stage.id}
                      className={`border-b border-gray-100 last:border-b-0 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-3 text-sm text-gray-700">{stage.name}</td>
                      <td className="py-3 text-sm text-[#1d90ff] text-right font-mono">
                        {stage.energy.toFixed(2)}
                      </td>
                      <td className="py-3 text-sm text-gray-800 text-right font-mono">
                        {stage.duration.toFixed(1)}
                      </td>
                      <td className={`py-3 text-sm text-right font-mono ${
                        stage.efficiency >= 90 ? 'text-emerald-500' :
                        stage.efficiency >= 80 ? 'text-amber-500' :
                        'text-red-500'
                      }`}>
                        {stage.efficiency.toFixed(1)}%
                      </td>
                      <td className="py-3 text-sm text-gray-500 text-right font-mono">
                        {percent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            {selectedProcessData && (
              <BarChart
                data={selectedProcessData.stages.map((stage, index) => ({
                  teamId: stage.id,
                  teamName: stage.name,
                  totalEnergy: stage.energy,
                  output: stage.duration,
                  energyPerUnit: stage.efficiency,
                  rank: index + 1
                }))}
                title="各环节能耗对比"
                dataKey="totalEnergy"
                height={280}
              />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-4">优化建议</div>
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-500 font-medium">{item.stage}</span>
                      <span className="text-sm text-gray-500">效率: {item.efficiency.toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200 text-center">
                <div className="text-emerald-500 text-lg mb-2">✓ 运行良好</div>
                <div className="text-sm text-gray-600">所有环节效率均达到85%以上，暂无优化建议</div>
              </div>
            )}

            {selectedProcessData && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-sm text-emerald-600 font-medium mb-2">效率指标说明</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span>效率 ≥ 90%: 优秀</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>效率 80%-90%: 良好</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>效率 &lt; 80%: 需优化</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}