"use client";

import { useState, useTransition, useEffect, useCallback, lazy, Suspense } from "react";
import type { Product } from "@/lib/types";
import { analyzeProductImage } from "@/ai/flows/analyze-product-image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { ProductCard } from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { Scale, Bot, Loader2 } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from "@/hooks/use-auth";

const ProductDetailsDialog = lazy(() => import('@/components/product-details-dialog').then(module => ({ default: module.ProductDetailsDialog })));
const ProductComparisonDialog = lazy(() => import('@/components/product-comparison-dialog').then(module => ({ default: module.ProductComparisonDialog })));

export function ProductUploader() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comparisonProducts, setComparisonProducts] = useState<string[]>([]);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const { toast } = useToast();

  const getProductsCollection = useCallback(() => {
    if (!user) return null;
    return collection(db, 'users', user.uid, 'products');
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = getProductsCollection();
      if (!productsCollection) {
        setProducts([]);
        setIsDataLoading(false);
        return;
      }

      setIsDataLoading(true);
      try {
        const q = query(productsCollection, orderBy('createdAt', 'desc'));
        const productSnapshot = await getDocs(q);
        const productList = productSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: (data.createdAt as Timestamp)?.toDate()
          } as Product;
        });
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Could not retrieve your saved products. Please try again later.",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (!authLoading) {
      fetchProducts();
    }
  }, [user, authLoading, getProductsCollection, toast]);


  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async (files: File[]) => {
    const productsCollection = getProductsCollection();
    if (files.length === 0 || !productsCollection) return;

    startAnalyzing(async () => {
      toast({
        title: "Analyzing Products...",
        description: `Processing ${files.length} image(s). This may take a moment.`,
      });

      const newProducts: Product[] = [];
      const analysisPromises = files.map(async (file) => {
        try {
          const photoDataUri = await readFileAsDataURL(file);
          const result = await analyzeProductImage({ photoDataUri });
          const productData = {
            ...result,
            image: photoDataUri,
            createdAt: Timestamp.now(),
          };
          const docRef = await addDoc(productsCollection, productData);
          newProducts.push({ ...productData, id: docRef.id, createdAt: productData.createdAt.toDate() });

        } catch (error) {
          console.error("Error analyzing product:", error);
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: `Could not analyze ${file.name}. Please try again.`,
          });
        }
      });

      await Promise.all(analysisPromises);

      setProducts((prev) => [...newProducts, ...prev]);

      if (newProducts.length > 0) {
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed and saved ${newProducts.length} new product(s).`,
        });
      }
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    const productsCollection = getProductsCollection();
    if (!productsCollection) return;
    try {
      await deleteDoc(doc(productsCollection, productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setComparisonProducts((prev) => prev.filter((id) => id !== productId));
      toast({
        title: "Product Deleted",
        description: "The product has been removed from your list.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the product. Please try again.",
      });
    }
  };

  const handleToggleComparison = (productId: string, isSelected: boolean) => {
    if (isSelected) {
      if (comparisonProducts.length < 4) {
        setComparisonProducts((prev) => [...prev, productId]);
      } else {
        toast({
          variant: "destructive",
          title: "Comparison Limit Reached",
          description: "You can compare a maximum of 4 products at a time.",
        });
      }
    } else {
      setComparisonProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const getComparisonProducts = () => {
    return products.filter(p => comparisonProducts.includes(p.id));
  }

  return (
    <div className="w-full">
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-primary to-accent/80 text-transparent bg-clip-text">Unlock Product Secrets with AI</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a product image to get a deep analysis of its ingredients, safety, and user sentiment.
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <ImageUploader onUpload={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      <Separator className="my-12" />

      {comparisonProducts.length >= 2 && (
        <div className="flex justify-center mb-6 sticky top-20 z-30">
          <Suspense fallback={<Button size="lg" disabled>Loading Comparison...</Button>}>
            <ProductComparisonDialog products={getComparisonProducts()}>
              <Button size="lg" className="shadow-lg animate-in fade-in-0 zoom-in-95">
                <Scale className="mr-2 h-5 w-5" />
                Compare {comparisonProducts.length} items
              </Button>
            </ProductComparisonDialog>
          </Suspense>
        </div>
      )}

      {isDataLoading ? (
        <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">Your Analyzed Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => handleSelectProduct(product)}
                onDelete={() => handleDeleteProduct(product.id)}
                onToggleCompare={(isSelected) => handleToggleComparison(product.id, isSelected)}
                isComparing={comparisonProducts.includes(product.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        !isAnalyzing && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/20">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your product dashboard is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload product images to begin your analysis.
            </p>
          </div>
        )
      )}

      {selectedProduct && (
        <Suspense fallback={null}>
            <ProductDetailsDialog
              product={selectedProduct}
              open={!!selectedProduct}
              onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}
            />
        </Suspense>
      )}
    </div>
  );
}
