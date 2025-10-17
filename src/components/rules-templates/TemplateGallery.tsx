"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Users, Eye, Copy, Download, Clock, Tag, Zap, Loader2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: "simple" | "intermediate" | "advanced";
  usageCount: number;
  rating: number;
  tags: string[];
  preview: string;
}

interface TemplateGalleryProps {
  templates: Template[];
  searchTerm: string;
  filterCategory: string;
  getComplexityBadge: (complexity: string) => JSX.Element;
  isLoading?: boolean;
}

export function TemplateGallery({ templates, searchTerm, filterCategory, getComplexityBadge, isLoading }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "name">("popular");

  // Filter templates based on search term and category
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = filterCategory === "all" || template.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort templates
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.usageCount - a.usageCount);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "newest":
        // For demo, we'll sort by name as a proxy for "newest"
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [templates, searchTerm, filterCategory, sortBy]);

  const handleUseTemplate = (template: Template) => {
    // TODO: Navigate to rule builder with template pre-filled
    console.log("Use template:", template.id);
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-200 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }

    return stars;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
          ) : (
            `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} found`
          )}
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <p>No templates found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getComplexityBadge(template.complexity)}
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{template.usageCount} uses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(template.rating)}
                    <span className="ml-1">({template.rating})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePreview(template)}
                    title="Preview Template"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedTemplate.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {getComplexityBadge(selectedTemplate.complexity)}
                    <Badge variant="outline">{selectedTemplate.category}</Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Usage Count</h4>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{selectedTemplate.usageCount} times</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Rating</h4>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedTemplate.rating)}
                    <span className="ml-1">({selectedTemplate.rating}/5)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="bg-gray-50 p-3 rounded-md text-sm font-mono">
                  {selectedTemplate.preview}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUseTemplate(selectedTemplate)}>
                  <Zap className="mr-2 h-4 w-4" />
                  Use This Template
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
