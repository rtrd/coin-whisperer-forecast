import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Zap } from "lucide-react";
import Select from "react-select";
import axios from "axios";
import AddAlert from "@/components/AddAlert";

type ReactSelectStyles = any;

interface AlertItem {
  id?: string;
  type?: string;
  asset?: string;
  targetAsset?: string;
  condition?: string;
  threshold: number;
  message: string;
  isActive: boolean;
  lastTriggered?: string;
}

interface AlertProps {
  alerts: AlertItem[];
  setAlerts: (alerts: AlertItem[]) => void;
  walletAddress: string | null;
  chainId: string | null;
  fetchAlerts: (address: string) => Promise<void>;
}

const Alert: React.FC<AlertProps> = ({
  alerts,
  setAlerts,
  walletAddress,
  chainId,
  fetchAlerts
}) => {
  const [showInput, setShowInput] = useState(false);
  const [type, setType] = useState("price");
  const [asset, setAsset] = useState("BTC");
  const [targetAsset, setTargetAsset] = useState("");
  const [condition, setCondition] = useState("above");
  const [threshold, setThreshold] = useState<number | "">("");
  const [isEditingAlert, setIsEditingAlert] = useState(false);
  const [editAlertId, setEditAlertId] = useState<string | null>(null);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 border-2 border-orange-500/30 shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30">
        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-400" />
          Smart Alerts & Monitoring
          <div className="ml-auto text-sm font-normal text-orange-300">
            {alerts.filter((a) => a.isActive).length} Active
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-orange-300">Create new alert</span>
            </div>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs"
              onClick={(e) => {
                e.preventDefault();
                setShowInput(!showInput);
              }}
            >
              + Add Alert
            </Button>
          </div>
        </div>

        {showInput && (
          <AddAlert
            type={type}
            setType={setType}
            asset={asset}
            setAsset={setAsset}
            targetAsset={targetAsset}
            setTargetAsset={setTargetAsset}
            condition={condition}
            setCondition={setCondition}
            threshold={threshold}
            setThreshold={setThreshold}
            isEditingAlert={isEditingAlert}
            editAlertId={editAlertId}
            editIsActive={editIsActive}
            setEditIsActive={setEditIsActive}
            setIsEditingAlert={setIsEditingAlert}
            setEditAlertId={setEditAlertId}
            walletAddress={walletAddress}
            chainId={chainId}
            setAlerts={setAlerts}
            fetchAlerts={fetchAlerts}
            setShowInput={setShowInput}
          />
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-all duration-200 border border-gray-600/50 hover:border-orange-500/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${
                    alert.isActive
                      ? "bg-green-400 shadow-lg shadow-green-400/20"
                      : "bg-gray-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">
                      {alert.message}
                    </p>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                        alert.type === "price"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : alert.type === "volume"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : alert.type === "portfolio"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                      }`}
                    >
                      {alert.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {alert.threshold.toLocaleString() && (
                      <span>
                        Threshold: ${alert.threshold.toLocaleString()}
                      </span>
                    )}
                    {alert.asset && <span>Asset: {alert.asset}</span>}
                    {alert.lastTriggered && (
                      <span>
                        Last triggered:{" "}
                        {new Date(alert.lastTriggered).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  className={`text-xs border-0 ${
                    alert.isActive
                      ? "bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30"
                      : "bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Alert status toggled:", alert.id);
                  }}
                >
                  {alert.isActive ? "● Active" : "○ Inactive"}
                </Button>
                <Button
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Alert settings opened:", alert.id);
                    setShowInput(true);
                    setIsEditingAlert(true);
                    setEditAlertId(alert.id ?? null);
                    setType(alert.type ?? "price");
                    setAsset(alert.asset ?? "");
                    setTargetAsset(alert.targetAsset ?? "");
                    setCondition(alert.condition ?? "above");
                    setThreshold((alert as any).threshold ?? "");
                    setEditIsActive(!!alert.isActive);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">
                  {alerts.filter((a) => a.isActive).length} Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-300">
                  {alerts.filter((a) => !a.isActive).length} Inactive
                </span>
              </div>
            </div>
            <span className="text-gray-400">Total: {alerts.length} alerts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(Alert);
