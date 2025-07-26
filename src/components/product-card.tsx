"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
  onDelete: () => void;
  onToggleCompare: (isSelected: boolean) => void;
  isComparing: boolean;
}

export function ProductCard({
  product,
  onSelect,
  onDelete,
  onToggleCompare,
  isComparing
}: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-border/80 hover:border-primary/50">
      <CardHeader className="p-4">
        <CardTitle className="truncate text-lg">{product.productDetails.name}</CardTitle>
        <CardDescription>{product.productDetails.brand}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4">
        <div className="relative w-full h-48 cursor-pointer" onClick={onSelect}>
          <Image
            src={product.image}
            alt={product.productDetails.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="product image"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-4 bg-muted/30">
        <Button onClick={onSelect} className="w-full">
          View Details
        </Button>
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
                 <Checkbox 
                    id={`compare-${product.id}`} 
                    checked={isComparing}
                    onCheckedChange={(checked) => onToggleCompare(!!checked)}
                />
                <Label htmlFor={`compare-${product.id}`} className="text-sm font-medium cursor-pointer">
                    Compare
                </Label>
            </div>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete product">
            <Trash2 className="h-5 w-5 text-muted-foreground transition-colors hover:text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
