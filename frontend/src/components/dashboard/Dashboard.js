import React, { useState, useEffect, useCallback } from "react";
import apiService from "../../services/apiService";
import CreateApiKeyForm from "./CreateApiKeyForm";
import ApiKeyList from "./ApiKeyList";
import CategoryChart from "./CategoryChart";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await apiService.getApiKeys();
      setApiKeys(response.data);
      if (response.data.length > 0 && !selectedKey) {
        setSelectedKey(response.data[0]);
      }
    } catch (err) {
      // Error handled by toast in the component
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    fetchApiKeys();
  }, []); // Run only once on mount

  const handleKeyCreated = (newKey) => {
    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    setSelectedKey(newKey);
  };

  const handleKeyDeleted = (deletedKeyId) => {
    const updatedKeys = apiKeys.filter((key) => key.id !== deletedKeyId);
    setApiKeys(updatedKeys);
    if (selectedKey && selectedKey.id === deletedKeyId) {
      setSelectedKey(updatedKeys.length > 0 ? updatedKeys[0] : null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <CreateApiKeyForm onKeyCreated={handleKeyCreated} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-3">
          <ApiKeyList
            apiKeys={apiKeys}
            selectedKey={selectedKey}
            onSelectKey={setSelectedKey}
            onKeyDeleted={handleKeyDeleted}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {selectedKey ? (
              <motion.div
                key={selectedKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {selectedKey.categories.map((category) => (
                  <CategoryChart
                    key={category}
                    apiKey={selectedKey}
                    category={category}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-key-selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] bg-card rounded-lg shadow-sm p-6"
              >
                <BarChart3 size={48} className="text-secondary mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground">
                  仪表盘
                </h3>
                <p className="text-secondary mt-2">
                  请从左侧选择或创建一个API Key来查看数据
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
