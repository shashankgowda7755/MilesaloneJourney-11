import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Edit3, Save, X, Plus, Trash2, GripVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InlineEditorProps {
  content: string;
  field: string;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
  onSave: (value: string) => void;
  className?: string;
  multiline?: boolean;
  deletable?: boolean;
  onDelete?: () => void;
}

export function InlineEditor({ 
  content, 
  field, 
  type = "text", 
  placeholder, 
  onSave, 
  className = "",
  multiline = false,
  deletable = false,
  onDelete 
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== "number") {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        <div className="flex items-center gap-2">
          {multiline ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[100px] resize-none"
              rows={4}
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={className}
            />
          )}
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative cursor-pointer transition-all duration-200 ${
        isHovered ? "ring-2 ring-blue-300 ring-opacity-50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
    >
      {/* Content */}
      <div className={`${className} ${!content ? "text-gray-400 italic" : ""}`}>
        {content || placeholder || "Click to edit"}
      </div>
      
      {/* Edit Controls */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          <Button 
            size="sm" 
            className="h-6 w-6 p-0 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          {deletable && onDelete && (
            <Button 
              size="sm" 
              variant="destructive"
              className="h-6 w-6 p-0 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface EditableSection {
  id: string;
  title: string;
  content: any;
  deletable?: boolean;
}

interface EditableContainerProps {
  sections: EditableSection[];
  onUpdateSection: (id: string, content: any) => void;
  onDeleteSection?: (id: string) => void;
  onAddSection?: () => void;
  title: string;
}

export function EditableContainer({ 
  sections, 
  onUpdateSection, 
  onDeleteSection, 
  onAddSection, 
  title 
}: EditableContainerProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-brown">{title}</h3>
        {onAddSection && (
          <Button onClick={onAddSection} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        )}
      </div>
      
      <div 
        className={`space-y-4 transition-colors ${
          isDragOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
      >
        {sections.map((section, index) => (
          <div key={section.id} className="relative group">
            <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            </div>
            <div className="ml-6">
              {Object.entries(section.content).map(([key, value]) => (
                <InlineEditor
                  key={`${section.id}-${key}`}
                  content={String(value)}
                  field={key}
                  multiline={key.includes("description") || key.includes("content")}
                  placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  onSave={(newValue) => {
                    onUpdateSection(section.id, {
                      ...section.content,
                      [key]: newValue
                    });
                  }}
                  deletable={section.deletable}
                  onDelete={onDeleteSection ? () => onDeleteSection(section.id) : undefined}
                  className="mb-2"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface InlineEditModeProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function InlineEditMode({ enabled, onToggle }: InlineEditModeProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => onToggle(!enabled)}
        className={`gap-2 shadow-lg ${
          enabled 
            ? "bg-orange-500 hover:bg-orange-600 text-white" 
            : "bg-white hover:bg-gray-100 text-gray-700 border"
        }`}
      >
        <Edit3 className="h-4 w-4" />
        {enabled ? "Exit Edit Mode" : "Edit Mode"}
      </Button>
    </div>
  );
}