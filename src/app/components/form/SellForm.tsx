"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { X, File, Image, Upload } from "lucide-react";
import { SelectCategory } from "../SelectCategory";
import { TipTapEditor } from "../Editor";
import { type JSONContent } from "@tiptap/react";
import { SellProduct } from "@/app/action";
import { useFormState } from "react-dom";
import { Submitbutton } from "../SubmitButton";

export default function SellForm() {
  const [state, formAction] = useFormState(SellProduct, {
    message: "",
    status: undefined,
    errors: {}
  });
  
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, setProductFile] = useState<null | string>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.zip')) {
        toast.error("Please select a ZIP file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }

      // For now, we'll use a placeholder - you'll need to implement actual file upload
      setProductFile(URL.createObjectURL(file));
      toast.success("ZIP file selected successfully!");
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (images) {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      setImages(updatedImages);
    }
  };

  const removeProductFile = () => {
    setProductFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Sell your product with ease</CardTitle>
          <CardDescription>
            Please describe your product here in detail so that it can be sold
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-y-10">
          {/* Name */}
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Name of your Product"
              required
              minLength={3}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-y-2">
            <Label>Category</Label>
            <SelectCategory />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-y-2">
            <Label>Price</Label>
            <Input
              placeholder="29$"
              type="number"
              name="price"
              required
              min={1}
            />
          </div>

          {/* Small Description */}
          <div className="flex flex-col gap-y-2">
            <Label>Small Summary</Label>
            <Textarea
              name="smallDescription"
              placeholder="Please describe your product shortly right here..."
              required
              minLength={10}
            />
          </div>

          {/* Description with TipTap Editor */}
          <div className="flex flex-col gap-y-2">
            <input
              type="hidden"
              name="description"
              value={JSON.stringify(json)}
            />
            <Label>Description</Label>
            <TipTapEditor json={json} setJson={setJson} />
          </div>

          {/* Images Upload */}
          <div className="flex flex-col gap-y-2">
            <input type="hidden" name="images" value={JSON.stringify(images)} />
            <Label>Product Images</Label>
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImages(res.map((item) => item.url));
                toast.success("Your images have been uploaded");
              }}
              onUploadError={(error: Error) => {
                toast.error("Something went wrong, try again");
              }}
            />
            
            {/* Image Previews */}
            {images && images.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Uploaded Images:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product File Upload */}
          <div className="flex flex-col gap-y-2">
            <input type="hidden" name="productFile" value={productFile || ""} />
            <Label>Product File (ZIP)</Label>
            
            {/* File Input Area */}
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!productFile ? (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <p className="font-medium text-sm">Click to upload your product file</p>
                    <p className="text-sm text-muted-foreground">ZIP format only, max 50MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <File className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">product-file.zip</p>
                    <p className="text-sm text-muted-foreground">Ready to upload</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Preview */}
            {productFile && (
              <div className="mt-4 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                <div className="flex items-center gap-4">
                  <File className="w-10 h-10 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-base">product-file.zip</p>
                    <p className="text-sm text-muted-foreground">
                      File selected and ready
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeProductFile}
                    className="text-destructive hover:text-destructive/80 p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-5">
         <Submitbutton title="Create your Product" />
        </CardFooter>
      </Card>
    </form>
  );
}