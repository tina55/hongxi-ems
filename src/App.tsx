import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import Dashboard from "@/pages/Dashboard/index";
import ElectricOverview from "@/pages/Electric/Overview";
import YoyAnalysis from "@/pages/Electric/YoyAnalysis";
import MomAnalysis from "@/pages/Electric/MomAnalysis";
import Trend from "@/pages/Electric/Trend";
import YoyMomAnalysis from "@/pages/Electric/YoyMomAnalysis";
import TeamAnalysis from "@/pages/Statistics/TeamAnalysis";
import TeamAnalysisHongao from "@/pages/Statistics/TeamAnalysisHongao";
import ProductEnergy from "@/pages/Statistics/ProductEnergy";
import ProcessEnergy from "@/pages/Statistics/ProcessEnergy";
import ProcessEnergy2 from "@/pages/Statistics/ProcessEnergy2";
import DeviceGroup from "@/pages/Device/DeviceGroup";
import DeviceList from "@/pages/Device/DeviceList";
import MeterManagement from "@/pages/Device/MeterManagement";
import TagManagement from "@/pages/Device/TagManagement";
import RealtimeAlarm from "@/pages/Alarm/RealtimeAlarm";
import HistoryAlarm from "@/pages/Alarm/HistoryAlarm";
import AlarmConfig from "@/pages/Alarm/AlarmConfig";
import HistoryData from "@/pages/Realtime/HistoryData";
import EnergyReport from "@/pages/Report/EnergyReport";
import ManualEntry from "@/pages/Report/ManualEntry";
import Cockpit from "@/pages/Cockpit";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cockpit" element={<Cockpit />} />
          <Route path="/electric/overview" element={<ElectricOverview />} />
          <Route path="/electric/yoy" element={<YoyAnalysis />} />
          <Route path="/electric/mom" element={<MomAnalysis />} />
          <Route path="/electric/trend" element={<Trend />} />
          <Route path="/electric/yoymom" element={<YoyMomAnalysis />} />
          <Route path="/realtime/history" element={<HistoryData />} />
          <Route path="/statistics/team" element={<TeamAnalysis />} />
          <Route path="/statistics/team-hongao" element={<TeamAnalysisHongao />} />
          <Route path="/statistics/product" element={<ProductEnergy />} />
          <Route path="/statistics/process" element={<ProcessEnergy />} />
          <Route path="/statistics/process2" element={<ProcessEnergy2 />} />
          <Route path="/device/group" element={<DeviceGroup />} />
          <Route path="/device/list" element={<DeviceList />} />
          <Route path="/device/meter" element={<MeterManagement />} />
          <Route path="/device/tag" element={<TagManagement />} />
          <Route path="/alarm/realtime" element={<RealtimeAlarm />} />
          <Route path="/alarm/history" element={<HistoryAlarm />} />
          <Route path="/alarm/config" element={<AlarmConfig />} />
          <Route path="/report/energy" element={<EnergyReport />} />
          <Route path="/report/manual" element={<ManualEntry />} />
        </Route>
      </Routes>
    </Router>
  );
}
