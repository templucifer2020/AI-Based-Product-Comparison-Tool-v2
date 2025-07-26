
"use client";

import Image from "next/image";
import type { Product, SafetyRating } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface ProductComparisonDialogProps {
  products: Product[];
  children: React.ReactNode;
}

const SafetyBadge = ({ rating, className }: { rating: SafetyRating, className?: string }) => {
  const styles = {
    Safe: { variant: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
    Caution: { variant: "warning", icon: <AlertTriangle className="h-3 w-3" /> },
    Warning: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  } as const;

  const { variant, icon } = styles[rating];

  return (
    <Badge variant={variant} className={cn("flex items-center gap-1.5 capitalize text-xs", className)}>
      {icon}
      {rating}
    </Badge>
  );
};

const IngredientList = ({ingredients}: {ingredients: Product['ingredientAnalysis']}) => {
    const [isOpen, setIsOpen] = useState(false);
    const topIngredients = ingredients.slice(0, 5);
    const otherIngredients = ingredients.slice(5);

    return (
        <div>
            <ul className="space-y-1">
                {topIngredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs">
                        <span className="truncate pr-2">{ing.name}</span>
                        <SafetyBadge rating={ing.safetyRating} />
                    </li>
                ))}
            </ul>
            {otherIngredients.length > 0 && (
                 <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                           {isOpen ? "Show Less" : `Show ${otherIngredients.length} more`}
                           {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ul className="space-y-1 mt-2">
                            {otherIngredients.map((ing, idx) => (
                                <li key={idx} className="flex items-center justify-between text-xs">
                                    <span className="truncate pr-2">{ing.name}</span>
                                    <SafetyBadge rating={ing.safetyRating} />
                                </li>
                            ))}
                        </ul>
                    </CollapsibleContent>
                 </Collapsible>
            )}
        </div>
    )
}

const features = [
    { name: "Brand", getValue: (p: Product) => p.productDetails.brand },
    { name: "Category", getValue: (p: Product) => p.productDetails.category },
    { name: "Overall Safety", getValue: (p: Product) => <SafetyBadge rating={p.safetyAssessment.overallRating} /> },
    { name: "Top Ingredients", getValue: (p: Product) => <IngredientList ingredients={p.ingredientAnalysis} /> },
    { name: "Pros", getValue: (p: Product) => <p className="text-sm">{p.userSentimentAnalysis.pros}</p> },
    { name: "Cons", getValue: (p: Product) => <p className="text-sm">{p.userSentimentAnalysis.cons}</p> },
    { name: "Recommendations", getValue: (p: Product) => <p className="text-sm">{p.recommendations}</p> },
  ];

const ProductInfoCard = ({product}: {product: Product}) => (
    <Card className="border-0 shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-4 gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                <Image src={product.image} alt={product.productDetails.name} fill className="object-contain" data-ai-hint="product image" />
            </div>
            <div className="text-center">
                <h3 className="font-semibold text-lg">{product.productDetails.name}</h3>
                <p className="text-sm text-muted-foreground">{product.productDetails.brand}</p>
            </div>
        </CardContent>
    </Card>
);


export function ProductComparisonDialog({ products, children }: ProductComparisonDialogProps) {
  if (!products.length) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Product Comparison</DialogTitle>
          <DialogDescription>
            A side-by-side look at your selected products.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
                {/* Mobile View */}
                <div className="md:hidden">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {products.map(product => (
                                <CarouselItem key={product.id}>
                                    <div className="p-1">
                                        <ProductInfoCard product={product} />
                                         <Table className="mt-4">
                                            <TableBody>
                                                {features.map(feature => (
                                                    <TableRow key={feature.name}>
                                                        <TableCell className="font-semibold w-1/3 py-3 align-top">{feature.name}</TableCell>
                                                        <TableCell className="py-3">{feature.getValue(product)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         <CarouselPrevious className="ml-10" />
                        <CarouselNext className="mr-10" />
                    </Carousel>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[15%]"></TableHead>
                            {products.map((product) => (
                            <TableHead key={product.id} className="w-[28%]">
                                <ProductInfoCard product={product} />
                            </TableHead>
                            ))}
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {features.map((feature) => (
                            <TableRow key={feature.name} className="hover:bg-muted/20">
                            <TableCell className="font-semibold align-top">{feature.name}</TableCell>
                            {products.map((product) => (
                                <TableCell key={product.id} className="align-top">
                                    {feature.getValue(product)}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
