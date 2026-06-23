"use client";

import { useState, useEffect } from "react";
import { 
  useGetLegalByTypeQuery, 
  useCreateOrUpdateLegalMutation 
} from "@/redux/features/legal/legalApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Save, 
  FileText, 
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export default function LegalDocumentsPage() {
  const [selectedTab, setSelectedTab] = useState("TERMS_AND_CONDITIONS");
  const [content, setContent] = useState("");

  const { data: documentResponse, isLoading, refetch } = useGetLegalByTypeQuery(selectedTab, {
    refetchOnMountOrArgChange: true,
  });

  const [saveDocument, { isLoading: isSaving }] = useCreateOrUpdateLegalMutation();

  const doc = documentResponse?.data;

  // Sync content state when data loads or selectedTab changes
  useEffect(() => {
    if (doc?.content) {
      setContent(doc.content);
    } else {
      setContent("");
    }
  }, [doc, selectedTab]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Document content cannot be empty");
      return;
    }

    try {
      await saveDocument({ type: selectedTab, content }).unwrap();
      toast.success("Legal document updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save document");
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "TERMS_AND_CONDITIONS":
        return "Terms & Conditions";
      case "PRIVACY_POLICY":
        return "Privacy Policy";
      case "ABOUT_US":
        return "About Us";
      default:
        return "Document";
    }
  };

  const formatLastSync = (dateStr?: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Legal Documents</h1>
        <p className="text-gray-500 mt-1">Manage app terms, privacy policies, and description contents visible in the mobile application.</p>
      </div>

      <Tabs 
        defaultValue="TERMS_AND_CONDITIONS" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        {/* Tab Headers */}
        <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex-col sm:flex-row gap-4">
          <TabsList className="bg-gray-100 rounded-xl p-1 gap-1">
            <TabsTrigger 
              value="TERMS_AND_CONDITIONS"
              className="rounded-lg font-bold text-xs px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger 
              value="PRIVACY_POLICY"
              className="rounded-lg font-bold text-xs px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger 
              value="ABOUT_US"
              className="rounded-lg font-bold text-xs px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              About Us
            </TabsTrigger>
          </TabsList>

          <Button 
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 px-6 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Tab Contents */}
        <TabsContent value={selectedTab} className="focus-visible:outline-none">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-gray-50 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {getTabLabel(selectedTab)} Editor
              </CardTitle>
              {doc?.updatedAt && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last updated: {formatLastSync(doc.updatedAt)}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="font-semibold text-sm">Loading document editor...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-[13px] text-blue-700 font-medium leading-relaxed">
                    💡 <strong>Pro-Tip:</strong> HTML formatting is supported (e.g. <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>). The mobile app will parse this content directly into styled paragraphs.
                  </div>
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Write the content of ${getTabLabel(selectedTab)} here...`}
                    className="min-h-[450px] font-mono text-sm leading-relaxed p-6 rounded-2xl border-gray-100 bg-gray-50/30 focus-visible:ring-blue-100 focus-visible:bg-white transition-all shadow-inner"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
