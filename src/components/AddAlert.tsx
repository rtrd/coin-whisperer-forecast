import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import axios from "axios";
import { useAllTokens } from "@/api/getAllTokens";

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

interface AddAlertProps {
  type: string;
  setType: (v: string) => void;
  asset: string;
  setAsset: (v: string) => void;
  targetAsset: string;
  setTargetAsset: (v: string) => void;
  condition: string;
  setCondition: (v: string) => void;
  threshold: number | "";
  setThreshold: (v: number | "") => void;

  isEditingAlert: boolean;
  editAlertId: string | null;
  editIsActive: boolean;
  setEditIsActive: (v: boolean) => void;
  setIsEditingAlert: (v: boolean) => void;
  setEditAlertId: (v: string | null) => void;

  walletAddress: string | null;
  chainId: string | null;
  setAlerts: (alerts: AlertItem[]) => void;

  setShowInput: (v: boolean) => void;
  fetchAlerts: (address: string) => Promise<void>;
}

const selectOptions = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const selectStyles: ReactSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#111826",
    color: "#fff",
    borderColor: "#333",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#111826",
    color: "#fff",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#333"
      : state.isFocused
      ? "#111"
      : "#111826",
    color: "#fff",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#aaa",
  }),
};

const typeOptions = [
  { value: "price", label: "Price Alert" },
  { value: "volume", label: "Volume Alert" },
  { value: "pair", label: "Pair Alert" },
  { value: "portfolio", label: "Portfolio Alert" },
];

const conditionOptions = [
  { value: "above", label: "Above (≥)" },
  { value: "below", label: "Below (≤)" },
  { value: "equals", label: "Equals (=)" },
];

const activeOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

const AddAlert: React.FC<AddAlertProps> = ({
  type,
  setType,
  asset,
  setAsset,
  targetAsset,
  setTargetAsset,
  condition,
  setCondition,
  threshold,
  setThreshold,
  isEditingAlert,
  editAlertId,
  editIsActive,
  setEditIsActive,
  setIsEditingAlert,
  setEditAlertId,
  walletAddress,
  chainId,
  setAlerts,
  setShowInput,
  fetchAlerts,
}) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useAllTokens(
    { search: "" }
  );

  const tokens = data?.pages.flatMap((page) => page?.data) ?? [];

  const tokenOptions = useMemo(() => {
    if (!tokens?.length) return [];
    const mapped = tokens.flatMap((page) =>
      page?.data?.map((i: any) => ({
        label: `${i?.name} (${i?.symbol})`,
        value: i?.symbol,
      }))
    );
    return Array.from(new Map(mapped.map((obj) => [obj.value, obj])).values());
  }, [tokens]);

  const handleSaveAlert = async () => {
    if (!asset) return;

    let msg = "";
    if (type === "price") {
      msg = `${asset} price ${condition} $${threshold}`;
    } else if (type === "volume") {
      msg = `${asset} volume ${condition} $${threshold}`;
    } else if (type === "pair") {
      msg = `${asset} price ${condition} ${targetAsset}`;
    } else if (type === "portfolio") {
      msg = `Portfolio ${condition} ${threshold}%`;
    } else {
      msg = `Custom alert for ${asset}`;
    }

    await axios.post(`${BASE_URL}/saveAlert`, {
      type,
      asset,
      targetAsset,
      condition,
      threshold,
      message: msg,
      isActive: isEditingAlert ? editIsActive : true,
      walletAddress,
      chainId,
      createdAt: new Date().toISOString(),
      id: isEditingAlert ? editAlertId : undefined,
    });

    setAsset("");
    setTargetAsset("");
    setThreshold(0);
    setCondition("above");
    setType("price");
    setIsEditingAlert(false);
    setEditAlertId(null);
    setEditIsActive(true);
    setShowInput(false);

    // fetch alerts after saving
    fetchAlerts(walletAddress);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded bg-gray-800 border border-gray-600">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 rounded bg-gray-900 text-white border border-gray-600"
      >
        {typeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {type !== "portfolio" && (
        <Select
          styles={selectStyles}
          options={tokenOptions.filter((opt) => opt.value !== targetAsset)}
          placeholder="Price Asset (e.g. BTC)"
          value={tokenOptions.find((opt) => opt.value === asset) || null}
          onChange={(selected) => setAsset(selected?.value || "")}
          onMenuScrollToBottom={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      )}

      {type === "pair" && (
        <Select
          options={tokenOptions.filter((opt) => opt.value !== asset)}
          styles={selectStyles}
          placeholder="Target Asset (e.g. DAI)"
          value={tokenOptions.find((opt) => opt.value === targetAsset) || null}
          onChange={(selected) => setTargetAsset(selected?.value || "")}
          onMenuScrollToBottom={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      )}
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className="p-2 rounded bg-gray-900 text-white border border-gray-600"
      >
        {conditionOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {type !== "pair" && (
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          placeholder="Threshold (e.g. 45000)"
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />
      )}

      {isEditingAlert && (
        <select
          value={editIsActive ? "active" : "inactive"}
          onChange={(e) => setEditIsActive(e.target.value === "active")}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        >
          {activeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <Button
        className="bg-green-600 hover:bg-green-700 text-white text-sm"
        onClick={handleSaveAlert}
      >
        Save
      </Button>
    </div>
  );
};

export default React.memo(AddAlert);
