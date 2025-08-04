import React, { useState } from "react";
import apiService from "../../services/apiService";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { PlusCircle } from "lucide-react";

const CreateApiKeyForm = ({ onKeyCreated }) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyCategories, setNewKeyCategories] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    const categories = newKeyCategories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    if (!newKeyName || categories.length === 0) {
      toast.error("名称和类别不能为空");
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.createApiKey({
        name: newKeyName,
        categories,
      });
      toast.success("API Key 创建成功!");
      onKeyCreated(response.data);
      setNewKeyName("");
      setNewKeyCategories("");
    } catch (err) {
      toast.error("创建API Key失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle size={20} />
          创建新的API Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleCreateKey}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <Input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="名称 (例如: '我的温度传感器')"
            className="md:col-span-1"
          />
          <Input
            value={newKeyCategories}
            onChange={(e) => setNewKeyCategories(e.target.value)}
            placeholder="数据类别 (逗号分隔)"
            className="md:col-span-1"
          />
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "创建中..." : "创建"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateApiKeyForm;
