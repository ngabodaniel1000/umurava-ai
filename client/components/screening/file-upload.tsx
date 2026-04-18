'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
    onUpload: (files: File[]) => void;
    isLoading?: boolean;
}

export function FileUpload({ onUpload, isLoading }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (files.length > 0) {
            onUpload(files);
        }
    };

    return (
        <div className="space-y-6">
            <div
                className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 text-center ${dragActive
                        ? "border-accent bg-accent/5 scale-[1.01]"
                        : "border-border bg-card hover:border-accent/40"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.csv,.xlsx"
                />
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Drop CVs or Data Files Here</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Upload PDF resumes, Excel sheets, or CSV files from external job boards
                    </p>
                    <Button type="button" variant="outline" className="border-border">
                        Select Files
                    </Button>
                </div>
            </div>

            {files.length > 0 && (
                <Card className="p-4 bg-card border-border overflow-hidden">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-accent" />
                            Selected Files ({files.length})
                        </h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => setFiles([])}
                        >
                            Clear All
                        </Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-background flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[400px]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="p-1 rounded-full hover:bg-background text-muted-foreground hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Button
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 font-bold shadow-lg shadow-accent/20"
                            onClick={handleUpload}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing Documents...
                                </>
                            ) : (
                                "Start Bulk AI Screening"
                            )}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
