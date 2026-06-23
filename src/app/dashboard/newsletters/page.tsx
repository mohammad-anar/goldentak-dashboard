"use client";

import { useState } from "react";
import { 
  useGetNewslettersQuery, 
  useCreateNewsletterMutation, 
  useUpdateNewsletterMutation, 
  useDeleteNewsletterMutation 
} from "@/redux/features/newsletter/newsletterApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Newspaper,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function NewslettersPage() {
  const { data: response, isLoading, refetch } = useGetNewslettersQuery({});
  const [createNewsletter, { isLoading: isCreating }] = useCreateNewsletterMutation();
  const [updateNewsletter, { isLoading: isUpdating }] = useUpdateNewsletterMutation();
  const [deleteNewsletter, { isLoading: isDeleting }] = useDeleteNewsletterMutation();

  const newsletters = response?.data || [];

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Delete State
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setEditId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description);
    setImageFile(null);
    setEditId(item.id);
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ title, description }));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await updateNewsletter({ id: editId, formData }).unwrap();
        toast.success("Newsletter updated successfully!");
      } else {
        await createNewsletter(formData).unwrap();
        toast.success("Newsletter created successfully!");
      }
      
      setIsOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteNewsletter(deleteId).unwrap();
      toast.success("Newsletter deleted successfully!");
      setIsConfirmDeleteOpen(false);
      setDeleteId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Deletion failed");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    // Serve from the local backend upload assets path
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
    return `${backendBase}${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-gray-500 font-medium">Loading newsletters...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:py-10 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Newsletter & Announcements</h1>
          <p className="text-gray-500 mt-1">Publish and manage system updates, blog entries, and race bulletins.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-[#006841] hover:bg-[#006841]/90 text-white rounded-xl py-6 px-6 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Announcement
        </Button>
      </div>

      {/* Main Grid View */}
      {newsletters.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto w-full">
          <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
            <Newspaper className="w-10 h-10 text-gray-300" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900">No newsletters published</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              Click the "Add Announcement" button above to publish your first update.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((item: any) => {
            const displayImage = getImageUrl(item.image);
            return (
              <Card key={item.id} className="border-none shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between bg-white group hover:shadow-md transition-all duration-200">
                <div>
                  {/* Image/Placeholder */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden flex items-center justify-center text-gray-400">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-10 h-10 stroke-1" />
                        <span className="text-xs font-semibold uppercase tracking-wider">No Cover Image</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 flex gap-3 border-t border-gray-50/50 mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 rounded-xl text-gray-700 border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 h-11"
                  >
                    <Edit3 className="w-4.5 h-4.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleOpenDelete(item.id)}
                    className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2 h-11 px-4"
                    title="Delete"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl rounded-2xl border-none shadow-2xl bg-white p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editId ? "Edit Announcement" : "Create New Announcement"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Announcement Title</label>
              <Input 
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="py-6 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Announcement Content</label>
              <Textarea 
                placeholder="Write your news post here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[160px] rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-blue-100 p-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Cover Image</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="rounded-xl flex-1 py-5"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex-1 py-5 flex items-center justify-center gap-2"
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl bg-white p-8">
          <DialogHeader className="flex flex-col items-center">
            <div className="p-3 bg-red-50 text-red-500 rounded-full w-fit mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 text-center">
              Are you absolutely sure?
            </DialogTitle>
            <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
              This action cannot be undone. This newsletter announcement will be permanently removed from the database and mobile clients.
            </p>
          </DialogHeader>

          <DialogFooter className="pt-6 flex gap-3 w-full sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="rounded-xl flex-1 py-5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1 py-5 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Announcement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
