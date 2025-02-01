import { useState } from "react"
import type { Theme } from "../types/theme"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Download, Upload } from "lucide-react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { uploadFileToCloud } from "@/apis/cloud"
import { CloudUpload } from "@/types/Cloud"
import { useToast } from "@/hooks/use-toast"

interface CloudProps {
    currentTheme: Theme
}
export function Cloud({ currentTheme }: CloudProps) {
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast()

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

    const handleSubmit = async () => {
        if (!file || !title || !category) {
            alert("Please fill all fields before submitting.");
            return;
        }

        // Create a FormData object
        const formData = new FormData();

        // Append the file
        formData.append('file', file);

        formData.append('section', category);
        formData.append('filetype', file.type);
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


    const files = [
        { id: 1, title: "Tech Report 2023", category: "Technology" },
        { id: 2, title: "AI Trends", category: "Technology" },
        { id: 3, title: "Q2 Financial Analysis", category: "Economics" },
        { id: 4, title: "Market Forecast", category: "Economics" },
        { id: 5, title: "Investment Strategies", category: "Economics" },
        { id: 6, title: "Economic Indicators", category: "Economics" },
    ]

    return (
        <div className={`${currentTheme} min-h-screen bg-background text-foreground p-8`}>
            <div className="fixed bottom-4 right-4">
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

            <div className="space-y-8">
                {["Technology", "Economics"].map((category) => (
                    <div key={category} className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {files
                                .filter((file) => file.category === category)
                                .map((file) => (
                                    <Card key={file.id} className="bg-background border-border/50">
                                        <CardContent className="p-4">
                                            <div className="aspect-square bg-secondary/30 flex items-center justify-center text-4xl font-bold text-secondary-foreground">
                                                {file.title.charAt(0)}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center p-4">
                                            <p className="text-sm font-medium truncate">{file.title}</p>
                                            <Button size="icon" variant="ghost">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

