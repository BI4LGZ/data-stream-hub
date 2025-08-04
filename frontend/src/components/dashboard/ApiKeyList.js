import React from "react";
import toast from "react-hot-toast";
import apiService from "../../services/apiService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { KeyRound, Copy, Trash2, Loader2 } from "lucide-react";

const ApiKeyList = ({
  apiKeys,
  selectedKey,
  onSelectKey,
  onKeyDeleted,
  loading,
}) => {
  const handleDeleteKey = async (e, id) => {
    e.stopPropagation(); // Prevent li onClick from firing

    // Custom confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-2">
          <span className="text-center">
            确定要删除这个API Key吗? 所有相关数据都将被删除。
          </span>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                performDelete(id);
                toast.dismiss(t.id);
              }}
            >
              确认删除
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.dismiss(t.id)}
            >
              取消
            </Button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const performDelete = async (id) => {
    try {
      await apiService.deleteApiKey(id);
      toast.success("API Key 已删除");
      onKeyDeleted(id);
    } catch (err) {
      toast.error("删除API Key失败");
    }
  };

  const copyToClipboard = (e, text) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("API Key 已复制");
      },
      () => {
        toast.error("复制失败");
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound size={20} />
          我的API Keys
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <ul className="space-y-2">
            {apiKeys.map((key) => (
              <li
                key={key.id}
                onClick={() => onSelectKey(key)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedKey?.id === key.id
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "hover:bg-primary/5"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="overflow-hidden">
                    <p className="font-semibold text-card-foreground truncate">
                      {key.name}
                    </p>
                    <p
                      className="text-sm text-secondary truncate"
                      title={key.key}
                    >
                      {key.key}
                    </p>
                  </div>
                  <div className="flex items-center shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => copyToClipboard(e, key.key)}
                      title="复制Key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteKey(e, key.id)}
                      className="hover:text-red-500"
                      title="删除Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyList;
