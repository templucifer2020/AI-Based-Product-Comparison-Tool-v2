"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { CheckCircle, Eye, FlaskConical, BarChart2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: <Eye className="h-8 w-8 text-primary" />,
    title: "Instant Product Recognition",
    description: "Upload any product image and our AI will instantly identify it, providing you with its name, brand, and category.",
  },
  {
    icon: <FlaskConical className="h-8 w-8 text-primary" />,
    title: "In-Depth Ingredient Analysis",
    description: "Get a full breakdown of the product's ingredients, including their purpose, benefits, and potential side effects.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Comprehensive Safety Assessment",
    description: "Our AI evaluates the overall safety of the product and flags any potential warnings you should be aware of.",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: "User Sentiment Analysis",
    description: "We analyze thousands of user reviews to give you a clear summary of the product's pros, cons, and overall perception.",
  },
];

const productImages = [
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
  "https://placehold.co/400x400.png",
];


export default function LandingPage() {
    const { user } = useAuth();
  
    return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">ProductInsight AI</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href={user ? "/dashboard" : "/login"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-green-100/10 to-blue-100/10 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent/80 text-transparent bg-clip-text">
                See Beyond the Label
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                ProductInsight AI instantly decodes product labels for you. Just snap a photo to reveal ingredients, safety ratings, and real user feedback.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href={user ? "/dashboard" : "/login"}>Get Started for Free</Link>
                    </Button>
                </div>
            </div>
        </section>

        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-96 overflow-hidden rounded-lg border bg-background shadow-lg">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background/80 backdrop-blur-sm">
                         <h2 className="text-3xl font-bold tracking-tight">See It in Action</h2>
                        <p className="mt-2 text-muted-foreground max-w-lg">
                            Watch as our AI analyzes products in real-time, pulling out key insights to help you make informed decisions.
                        </p>
                    </div>
                     <div className="absolute top-0 left-0 w-max flex animate-slide">
                        {[...productImages, ...productImages].map((src, index) => (
                        <div key={index} className="w-64 h-64 p-4 flex-shrink-0">
                           <Image 
                             src={src} 
                             alt={`Product example ${index + 1}`} 
                             width={400} 
                             height={400} 
                             className="w-full h-full object-contain rounded-lg shadow-md bg-white"
                             data-ai-hint="cosmetic product"
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Know, in One Place</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    From complex chemical compounds to confusing marketing claims, we cut through the noise to deliver clear, actionable insights.
                </p>
                </div>
                <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <div key={index} className="text-center p-6 border border-transparent hover:border-primary/20 hover:bg-muted/30 rounded-lg transition-all duration-300">
                        <div className="inline-block p-4 bg-primary/10 rounded-full">
                           {feature.icon}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                        <p className="mt-2 text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>

        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Become a Smarter Shopper?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Take control of your purchases. Start analyzing products today and never be fooled by a label again.
                </p>
                <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href={user ? "/dashboard" : "/login"}>Analyze Your First Product</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <footer className="bg-background border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ProductInsight AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
