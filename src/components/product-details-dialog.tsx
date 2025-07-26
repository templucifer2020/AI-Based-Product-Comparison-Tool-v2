"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product, Ingredient, SafetyRating } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, XCircle, ThumbsUp, ThumbsDown, Info, FlaskConical, Users, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";

interface ProductDetailsDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SafetyBadge = ({ rating, className }: { rating: SafetyRating, className?: string }) => {
  const styles = {
    Safe: { variant: "success", icon: <CheckCircle2 className="h-4 w-4" /> },
    Caution: { variant: "warning", icon: <AlertTriangle className="h-4 w-4" /> },
    Warning: { variant: "destructive", icon: <XCircle className="h-4 w-4" /> },
  } as const;

  const { variant, icon } = styles[rating];

  return (
    <Badge variant={variant} className={cn("flex items-center gap-1.5 capitalize text-sm", className)}>
      {icon}
      {rating}
    </Badge>
  );
};

const IngredientCard = ({ingredient}: {ingredient: Ingredient}) => {
    return (
        <div className="p-4 border rounded-lg bg-card/50">
            <div className="flex justify-between items-center mb-3">
                <h5 className="font-semibold">{ingredient.name}</h5>
                <SafetyBadge rating={ingredient.safetyRating} />
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Function:</strong> {ingredient.function}</p>
                <p><strong>Benefits:</strong> {ingredient.benefits}</p>
                {ingredient.sideEffects && <p><strong>Side Effects:</strong> {ingredient.sideEffects}</p>}
                {ingredient.quantity && <p><strong>Quantity:</strong> {ingredient.quantity}</p>}
            </div>
        </div>
    )
}

export function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const topIngredients = product.ingredientAnalysis.slice(0, 5);
  const otherIngredients = product.ingredientAnalysis.slice(5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-2xl font-bold">{product.productDetails.name}</DialogTitle>
          <DialogDescription className="text-md">
            {product.productDetails.brand} - {product.productDetails.category}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border">
            <div className="relative w-full h-64">
              <Image
                src={product.image}
                alt={product.productDetails.name}
                fill
                sizes="33vw"
                className="object-contain"
                data-ai-hint="product image"
              />
            </div>
          </div>
          <div className="md:col-span-2 min-h-0">
            <ScrollArea className="h-full pr-3">
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ingredients"><FlaskConical className="w-4 h-4 mr-2" />Ingredients</TabsTrigger>
                  <TabsTrigger value="safety"><ShieldCheck className="w-4 h-4 mr-2"/>Safety</TabsTrigger>
                  <TabsTrigger value="sentiment"><Users className="w-4 h-4 mr-2"/>Sentiment</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients" className="mt-4">
                    <h4 className="font-semibold text-xl mb-4">Ingredient Analysis</h4>
                    <div className="space-y-3">
                        {topIngredients.map((ingredient, index) => (
                            <IngredientCard key={index} ingredient={ingredient} />
                        ))}
                    </div>
                    
                    {otherIngredients.length > 0 && (
                        <Collapsible open={showAllIngredients} onOpenChange={setShowAllIngredients} className="mt-4">
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    {showAllIngredients ? 'Show Less' : `Show ${otherIngredients.length} More Ingredients`}
                                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllIngredients && "rotate-180"}`} />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4 space-y-3 animate-in fade-in-0">
                                {otherIngredients.map((ingredient, index) => (
                                     <IngredientCard key={index} ingredient={ingredient} />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </TabsContent>
                <TabsContent value="safety" className="mt-4 space-y-4">
                    <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-semibold text-lg mb-3 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-primary"/>Overall Safety Assessment</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <span>Overall Rating:</span>
                            <SafetyBadge rating={product.safetyAssessment.overallRating} />
                        </div>
                        {product.safetyAssessment.warnings && <p className="text-sm text-destructive-foreground bg-destructive/80 p-3 rounded-md">{product.safetyAssessment.warnings}</p>}
                    </div>
                     <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-semibold text-lg mb-3 flex items-center"><Info className="w-5 h-5 mr-2 text-primary" />Usage & Recommendations</h4>
                        <p className="text-sm"><strong>Usage Instructions:</strong> {product.usageInstructions}</p>
                        <p className="text-sm mt-2"><strong>Recommendations:</strong> {product.recommendations}</p>
                        {product.expiryInformation && <p className="text-sm mt-2"><strong>Expiry Info:</strong> {product.expiryInformation}</p>}
                    </div>
                </TabsContent>
                <TabsContent value="sentiment" className="mt-4 space-y-4">
                     <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-semibold text-lg mb-3">User Sentiment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 p-3 rounded-md bg-success/10 border border-success/20">
                                <h5 className="font-medium flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-success" />Pros</h5>
                                <p className="text-sm text-muted-foreground">{product.userSentimentAnalysis.pros}</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                <h5 className="font-medium flex items-center gap-2"><ThumbsDown className="w-5 h-5 text-destructive" />Cons</h5>
                                <p className="text-sm text-muted-foreground">{product.userSentimentAnalysis.cons}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-card/50">
                        <h4 className="font-semibold text-lg mb-3">Review Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{product.userSentimentAnalysis.reviewSummary}</p>
                    </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
