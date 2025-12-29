import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Video, FileText, X, Loader2 } from 'lucide-react';

export default function MediaUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return {
          name: file.name,
          url: file_url,
          type: file.type,
          size: file.size
        };
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...uploaded]);
      if (onUploadComplete) onUploadComplete(uploaded);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          uploading ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/20 hover:border-cyan-400/50 hover:bg-white/5'
        }`}>
          <input
            type="file"
            multiple
            accept="video/*,audio/*,image/*,.pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm text-white/60">Uploading media...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-white font-medium">Upload Media</p>
                <p className="text-xs text-white/50 mt-1">Video, Audio, Images, PDF</p>
              </div>
            </div>
          )}
        </div>
      </label>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-white/60">Uploaded Files</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                {file.type.startsWith('video/') ? (
                  <Video className="w-4 h-4 text-cyan-400" />
                ) : (
                  <FileText className="w-4 h-4 text-cyan-400" />
                )}
                <div>
                  <p className="text-sm text-white">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="text-white/40 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}