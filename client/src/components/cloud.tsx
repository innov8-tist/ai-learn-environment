import { useEffect, useState } from "react"
import { FileText, Image, File, FileCode, FileAudio, FileVideo, FileArchive } from 'lucide-react';
import type { Theme } from "../types/theme"
import { saveAs } from 'file-saver';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Download, Upload } from "lucide-react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { fetchFilesByAuthor, uploadFileToCloud } from "@/apis/cloud"
import { Cloud } from "../types/Cloud"
import { useToast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import instance from "@/axios/axios.config";
import { ChatInputCloud } from "./ui/chatInputCloud";

const fileTypeIcons: { [key: string]: JSX.Element } = {
    'pdf': <FileText className="h-12 w-12 text-red-500 " />,
    'docx': <FileText className="h-12 w-12 text-blue-500" />,
    'png': <Image className="h-12 w-12 text-green-500" />,
    'jpeg': <Image className="h-12 w-12 text-green-500" />,
    'plain': <File className="h-12 w-12 text-gray-500" />,
    'html': <FileCode className="h-12 w-12 text-orange-500" />,
    'mpeg': <FileAudio className="h-12 w-12 text-purple-500" />,
    'mp4': <FileVideo className="h-12 w-12 text-red-500" />,
    'zip': <FileArchive className="h-12 w-12 text-yellow-500" />,
};

interface CloudProps {
    currentTheme: Theme
}
export function CloudPage({ currentTheme }: CloudProps) {
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<Cloud[]>([]);
    const { user } = useAuth()
    const { toast } = useToast()

    // Check if user is defined
    if (!user) {
        return null; // or return a loading spinner or message
    }

    const fetchFiles = async () => {
        try {
            const data = await fetchFilesByAuthor(user.id);
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleDownload = async (fileId: string, fileName: string,fileExt:string) => {
        try {
            const response = await instance.get(`/cloud/download/${fileName}.${fileExt}`, {
                responseType: 'blob', 
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            saveAs(blob, `${fileName}.${fileExt}`);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast({
                title: "Download failed",
                description: "Unable to download the file. Please try again later.",
            });
        }
    };

    useEffect(() => {
        if (user.id == null || user.id == undefined) {
            window.location.href = '/login'; // Redirect to login page
            return;
        }
        fetchFiles();
    }, [user.id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };
    const getFileExtension = (file: File): string => {
        const parts = file.name.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1].toLowerCase();
        }
        return '';
    };

    const handleSubmit = async () => {
        if (!file || !title || !category) {
            alert("Please fill all fields before submitting.");
            return;
        }

        const formData = new FormData();

        formData.append('file', file);
        formData.append('section', category);
        formData.append('filetype', getFileExtension(file));
        formData.append('title', title);
        formData.append('description', description || "");
        formData.append('fileSize', file.size.toString());
        formData.append('path', `/uploads/${file.name}`);
        console.log(formData)
        try {
            const response = await uploadFileToCloud(formData);

            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "File and metadata uploaded successfully!",
                });
                await fetchFiles()
                setOpen(false)
            } else {
                toast({
                    title: "Upload failed.",
                });
            }
        } catch (error) {
            console.error("Error uploading file and metadata:", error);
        }
    };

    return (
        <div className={`${currentTheme} min-h-screen bg-background text-foreground p-8 flex flex-col`}>
            <div className="space-y-8 flex-grow">
                {["Technology", "Economics","Youtube"].map((category) => (
                    <div key={category} className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {files
                                .filter((file) => file.section.toLowerCase() === category.toLowerCase())
                                .map((file) => (
                                    <Card key={file.id} className="bg-background border-border/50">
                                        <CardContent className="p-5">
                                            <div className="aspect-square bg-secondary/30 flex items-center justify-center">
                                                {fileTypeIcons[file.filetype] || <File className="h-10 w-10 text-gray-500" />}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center p-3">
                                            <p className="text-sm font-medium truncate">{file.title}</p>
                                            <Button onClick={()=>handleDownload(file.title,file.title,file.filetype)} size="icon" variant="ghost" className="h-8 w-8">
                                                <Download  className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-16 right-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full h-12 w-12">
                            <Upload className="h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
                        <DialogHeader>
                            <DialogTitle>Upload Content</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="bg-background text-foreground">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="economics">Economics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" type="file" onChange={handleFileChange} className="bg-background text-foreground" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title will appear when file is selected"
                                    className="bg-background text-foreground"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                    className="bg-background text-foreground"
                                />
                            </div>
                        </div>
                        <Button onClick={handleSubmit} className="mt-4">
                            Submit
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <ChatInputCloud currentTheme={currentTheme} />
        </div>
    )
}

