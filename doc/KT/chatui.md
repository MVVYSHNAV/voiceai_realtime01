# Floating Support Widget Documentation

## 1. Introduction

This document outlines the structure and functionality of the Floating Support Widget, a React component designed to provide a multi-modal support experience (chat and simulated voice call) on a web page. It features "Fathima" as the AI support agent.

The widget is designed to be easily integrated into a Next.js application using Tailwind CSS for styling and shadcn/ui components.

## 2. Functionalities

The widget provides the following key features:

*   **Floating Bubble:**
    *   A circular button fixed to the bottom-right of the screen.
    *   Displays a message icon when closed and an 'X' icon when open.
    *   Toggles the visibility of the main widget panel.
*   **Widget Panel:**
    *   A card that slides up from the bubble anchor.
    *   Constrained dimensions, responsive for mobile and desktop.
*   **Welcome Screen (Initial View):**
    *   Appears when the widget is first opened.
    *   Presents the user with options to "Start Voice Call" (recommended) or "Start Chat".
    *   Features Fathima's avatar and a welcoming message.
    *   Includes a close button in the header.
*   **Chat Panel:**
    *   Accessible from the Welcome Screen or after a call ends.
    *   **Header:** Displays Fathima's avatar, name ("Fathima - Support"), and a close button.
    *   **Message Area:** Scrollable area displaying chat history with user and bot (Fathima) messages.
    *   **Quick Actions:** A row of buttons for common queries (e.g., "Track my order").
    *   **Input Area:** Text input for user messages, a send button, and a dedicated "Call" button (phone icon) to escalate to a voice call.
    *   Simulated bot replies with `setTimeout`.
*   **Call Overlay (Simulated Voice Call):**
    *   Accessible from the Welcome Screen or the Chat Panel's "Call" button.
    *   Replaces the current panel view (Welcome or Chat) within the same widget container.
    *   **Header:** Displays Fathima's avatar (with a pulsing animation), name ("Fathima - AI Assistant"), an elapsed call timer, and a close/end call button.
    *   **Central Area (Dynamic Panels):**
        *   Default view: Animated waveform with "Fathima is listening..." caption.
        *   Scripted panels appear over time:
            *   **t=5s:** Product Carousel (horizontal scroll of product cards with "Add" buttons). User action leads to a toast message.
            *   **t=10s:** OTP Input (4-digit input, "Submit" button). Hardcoded OTP "1234". User action leads to a "Verified" badge.
            *   **t=15s:** Rating Prompt (5-star rating input, "Send" button). User action leads to a thank-you toast.
        *   Panels use fade-in/slide-up transitions. Only one panel is visible at a time.
    *   **Footer Bar:** Controls for Mic Mute/Unmute, Keypad (non-functional), Speaker Toggle, and a prominent "End Call" button.
*   **State Management:**
    *   Manages modes: `closed`, `welcome`, `chat`, `call`.
    *   Tracks chat history, call elapsed time, current call panel, mic/speaker states.
*   **Notifications:** Uses `sonner` for toast notifications (e.g., "Item added", "Thank you for rating").
*   **Styling:**
    *   Mobile-first, responsive design.
    *   Soft shadows, rounded corners.
    *   Uses Tailwind CSS and shadcn/ui components.

## 3. File Structure (within `components/support-widget/`)

```
components/
└── support-widget/
    ├── index.tsx               # Main widget component, state management
    ├── welcome-screen.tsx      # Initial screen with call/chat choice
    ├── chat-panel.tsx          # Chat interface component
    ├── call-overlay.tsx        # Simulated voice call interface
    ├── waveform.tsx            # Animated waveform for listening state
    └── panels/
        ├── product-carousel.tsx
        ├── otp-input-fields.tsx # Helper for OTP
        ├── otp-input.tsx
        └── rating-prompt.tsx
lib/
└── format-time.ts              # Utility for formatting hh:mm:ss
public/
└── fathima-avatar.png          # Agent's avatar image
app/
└── globals.css                 # Global styles, including animations
```

## 4. Code Files

Below are the code files required to build the Floating Support Widget.

---
### 4.1. Asset: `public/fathima-avatar.png`

This image should be placed in the `public` directory of your Next.js project.
*   **Source URL:** `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ai-fathima-PDfPw3KgU7Q5gmjEWNFEZ8pT59vY1y.png`
*   **File Name:** `fathima-avatar.png`

---
### 4.2. Global Styles: `app/globals.css`

These styles should be included in your global stylesheet. Ensure Tailwind CSS is set up.

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Define your CSS variables for light/dark themes if not already present */
    /* Example for light theme (shadcn/ui default) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    /* Define your dark theme variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark theme variables */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: sans-serif; /* Or your preferred font */
  }
}

/* Waveform animation */
@keyframes waveform-bar-animation {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}
.animate-waveform-bar {
  animation: waveform-bar-animation 1.2s ease-in-out infinite;
  transform-origin: bottom;
}

/* Scrollbar styles (optional, for better aesthetics in product carousel) */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground)) hsl(var(--muted)); /* Adjust colors as needed */
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground));
  border-radius: 3px;
  border: 1px solid hsl(var(--muted));
}
```

---
### 4.3. Utility: `lib/format-time.ts`

```typescript
// lib/format-time.ts
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
```

---
### 4.4. Utility: `lib/utils.ts` (for `cn` function)

This is a standard utility from shadcn/ui. If you don't have it, you can install `clsx` and `tailwind-merge`.

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---
### 4.5. Component: `components/support-widget/waveform.tsx`

```typescriptreact
// components/support-widget/waveform.tsx
export const Waveform = () => (
  <div className="flex items-end justify-center space-x-1 h-10">
    {[0.4, 0.7, 1, 0.6, 0.3, 0.8, 0.5].map((_, i) => (
      <div
        key={i}
        className="w-1.5 h-full bg-blue-500 rounded-full animate-waveform-bar"
        style={{
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);
```

---
### 4.6. Panel Component: `components/support-widget/panels/otp-input-fields.tsx`

```typescriptreact
// components/support-widget/panels/otp-input-fields.tsx
"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui Input

interface OtpInputFieldsProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OtpInputFields: React.FC<OtpInputFieldsProps> = ({
  length = 4,
  onComplete,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last digit if multiple entered
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (pasteData.length === length) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      onComplete(newOtp.join(""));
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex space-x-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-xl font-semibold"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
```

---
### 4.7. Panel Component: `components/support-widget/panels/product-carousel.tsx`

```typescriptreact
// components/support-widget/panels/product-carousel.tsx
"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
}

const DUMMY_PRODUCTS: Product[] = [
  { id: "1", name: "Wireless Headphones", image: "/placeholder.svg?width=150&height=120" },
  { id: "2", name: "Smart Thermostat", image: "/placeholder.svg?width=150&height=120" },
  { id: "3", name: "Coffee Maker", image: "/placeholder.svg?width=150&height=120" },
  { id: "4", name: "Fitness Tracker", image: "/placeholder.svg?width=150&height=120" },
];

interface ProductCarouselProps {
  onComplete: (toastMessage: string | null, delay: number) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  onComplete,
}) => {
  const handleAddProduct = (productName: string) => {
    onComplete(`"${productName}" added to cart!`, 2000);
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Recommended Products
      </h3>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin">
        {DUMMY_PRODUCTS.map((product) => (
          <Card key={product.id} className="min-w-[180px] flex-shrink-0">
            <CardHeader className="p-2">
              <div className="relative w-full h-[100px]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-md"
                />
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <CardTitle className="text-sm font-medium truncate">
                {product.name}
              </CardTitle>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleAddProduct(product.name)}
              >
                Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---
### 4.8. Panel Component: `components/support-widget/panels/otp-input.tsx`

```typescriptreact
// components/support-widget/panels/otp-input.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from 'lucide-react';
import { OtpInputFields } from "./otp-input-fields"; // Relative path

interface OtpInputProps {
  onComplete: (toastMessage: string | null, delay: number) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ onComplete }) => {
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (otp === "1234") {
      setIsVerified(true);
      setTimeout(() => {
        onComplete(null, 0); // Dismiss panel immediately after verified badge
      }, 1000); // Show verified badge for 1s
    } else {
      setError("Invalid OTP. Please try again.");
      // Consider clearing OTP fields here if OtpInputFields supports it
    }
  };

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <Badge
          variant="default"
          className="bg-green-500 text-white text-lg px-4 py-2"
        >
          Verified
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-card text-card-foreground rounded-lg shadow-md max-w-sm mx-auto">
      <h3 className="text-xl font-semibold">Enter OTP</h3>
      <p className="text-sm text-muted-foreground text-center">
        A One-Time Password has been sent. (Hint: 1234).
      </p>
      <OtpInputFields length={4} onComplete={setOtp} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleSubmit}
        disabled={otp.length !== 4}
        className="w-full"
      >
        Submit OTP
      </Button>
    </div>
  );
};
```

---
### 4.9. Panel Component: `components/support-widget/panels/rating-prompt.tsx`

```typescriptreact
// components/support-widget/panels/rating-prompt.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

interface RatingPromptProps {
  onComplete: (toastMessage: string | null, delay: number) => void;
}

export const RatingPrompt: React.FC<RatingPromptProps> = ({ onComplete }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitRating = () => {
    if (rating > 0) {
      onComplete(`Thank you for your ${rating}-star rating!`, 2000);
    } else {
      onComplete("Rating submitted.", 1500); // Fallback
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-card text-card-foreground rounded-lg shadow-md max-w-sm mx-auto">
      <h3 className="text-xl font-semibold">Rate your experience</h3>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className="focus:outline-none"
          >
            <Star
              size={36}
              className={`cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-neutral-300 dark:text-neutral-600"
              }`}
            />
          </button>
        ))}
      </div>
      <Button
        onClick={handleSubmitRating}
        disabled={rating === 0}
        className="w-full"
      >
        Send Feedback
      </Button>
    </div>
  );
};
```

---
### 4.10. Component: `components/support-widget/welcome-screen.tsx`

```typescriptreact
// components/support-widget/welcome-screen.tsx
"use client";

import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Phone, MessageCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStartCall: () => void;
  onStartChat: () => void;
  onClose: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartCall,
  onStartChat,
  onClose,
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-background">
      <header className="flex items-center justify-start p-3 border-b bg-neutral-50 dark:bg-neutral-800 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close support"
          className="mr-2"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="/fathima-avatar.png" // Path to public asset
              alt="Fathima - Support Agent"
              className="object-cover"
            />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <p className="font-semibold">Fathima - Support</p>
        </div>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative">
          <Avatar className="w-16 h-16 relative z-10">
            <AvatarImage
              src="/fathima-avatar.png" // Path to public asset
              alt="Fathima - AI Assistant"
              className="object-cover"
            />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 rounded-full bg-sky-400 animate-ping"></span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Hi! I'm Fathima</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            I'm here to help you with any questions or concerns. Choose your
            preferred way to connect with me.
          </p>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <div className="relative">
            <Button
              onClick={onStartCall}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Start Voice Call
            </Button>
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Recommended
            </div>
          </div>

          <Button
            onClick={onStartChat}
            variant="outline"
            className="w-full h-12"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Chat
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Voice calls provide faster, more personalized support
        </p>
      </div>
    </div>
  );
};
```

---
### 4.11. Component: `components/support-widget/chat-panel.tsx`

```typescriptreact
// components/support-widget/chat-panel.tsx
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Phone } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // Assumes lib/utils.ts exists

export type Message = {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
};

interface ChatPanelProps {
  chatHistory: Message[];
  onSendMessage: (text: string) => void;
  onStartCall: () => void;
  onClose: () => void;
}

const QuickActions = ({
  onAction,
}: {
  onAction: (text: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 p-2">
    {["Track my order", "Return an item", "Shipping policy"].map((action) => (
      <Button
        key={action}
        variant="outline"
        size="sm"
        onClick={() => onAction(action)}
      >
        {action}
      </Button>
    ))}
  </div>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chatHistory,
  onSendMessage,
  onStartCall,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "div[data-radix-scroll-area-viewport]" // Specific selector for shadcn/ui ScrollArea viewport
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-background">
      <header className="flex items-center justify-start p-3 border-b bg-neutral-50 dark:bg-neutral-800 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close chat"
          className="mr-2"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="/fathima-avatar.png" // Path to public asset
              alt="Fathima - Support Agent"
              className="object-cover"
            />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <p className="font-semibold">Fathima - Support</p>
        </div>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                msg.from === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.from === "bot" && (
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src="/fathima-avatar.png" // Path to public asset
                    alt="Fathima"
                    className="object-cover"
                  />
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow",
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-2 flex-shrink-0">
        <QuickActions onAction={(text) => onSendMessage(text)} />
        <div className="flex items-center gap-2 p-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow"
          />
          <Button onClick={handleSend} size="icon" aria-label="Send message">
            <Send className="w-4 h-4" />
          </Button>
          <Button
            onClick={onStartCall}
            size="icon"
            variant="secondary"
            aria-label="Start a voice call with Fathima"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---
### 4.12. Component: `components/support-widget/call-overlay.tsx`

```typescriptreact
// components/support-widget/call-overlay.tsx
"use client";

import type React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Mic, MicOff, PhoneOff, Volume2, VolumeX, GripHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { formatTime } from "@/lib/format-time"; // Relative path
import { Waveform } from "./waveform"; // Relative path
import { ProductCarousel } from "./panels/product-carousel"; // Relative path
import { OtpInput } from "./panels/otp-input"; // Relative path
import { RatingPrompt } from "./panels/rating-prompt"; // Relative path

export type PanelType = "carousel" | "otp" | "rating" | null;

interface CallOverlayProps {
  elapsedTime: number;
  currentPanel: PanelType;
  onEndCall: () => void;
  onPanelComplete: (toastMessage: string | null, delay: number) => void;
  micMuted: boolean;
  toggleMic: () => void;
  speakerOn: boolean;
  toggleSpeaker: () => void;
}

const panelAnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const listeningAnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  transition: { duration: 0.3, ease: "easeInOut" },
};

export const CallOverlay: React.FC<CallOverlayProps> = ({
  elapsedTime,
  currentPanel,
  onEndCall,
  onPanelComplete,
  micMuted,
  toggleMic,
  speakerOn,
  toggleSpeaker,
}) => {
  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden">
      <header className="flex items-center justify-start p-3 border-b bg-neutral-50 dark:bg-neutral-800 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEndCall}
          aria-label="End call and return to chat"
          className="mr-2"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Avatar className="w-8 h-8 relative z-10">
              <AvatarImage
                src="/fathima-avatar.png" // Path to public asset
                alt="Fathima - AI Assistant"
                className="object-cover"
              />
              <AvatarFallback>F</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 rounded-full bg-sky-400 animate-ping"></span>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Fathima - AI Assistant</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatTime(elapsedTime)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-grow relative flex flex-col items-stretch justify-center bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPanel === "carousel" && (
            <motion.div
              key="carousel"
              {...panelAnimationProps}
              className="w-full h-full overflow-y-auto"
            >
              <ProductCarousel onComplete={onPanelComplete} />
            </motion.div>
          )}
          {currentPanel === "otp" && (
            <motion.div
              key="otp"
              {...panelAnimationProps}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <OtpInput onComplete={onPanelComplete} />
            </motion.div>
          )}
          {currentPanel === "rating" && (
            <motion.div
              key="rating"
              {...panelAnimationProps}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <RatingPrompt onComplete={onPanelComplete} />
            </motion.div>
          )}
          {!currentPanel && (
            <motion.div
              key="listening"
              {...listeningAnimationProps}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <Waveform />
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                Fathima is listening...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-around p-3 border-t bg-neutral-50 dark:bg-neutral-800 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMic}
          aria-label={micMuted ? "Unmute" : "Mute"}
        >
          {micMuted ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Keypad (disabled)">
          <GripHorizontal className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSpeaker}
          aria-label={speakerOn ? "Speaker off" : "Speaker on"}
        >
          {speakerOn ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full w-12 h-12"
          onClick={onEndCall}
          aria-label="End call"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
      </footer>
    </div>
  );
};
```

---
### 4.13. Main Widget Component: `components/support-widget/index.tsx`

```typescriptreact
// components/support-widget/index.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X } from 'lucide-react';
import { Toaster, toast } from "sonner"; // For notifications
import { WelcomeScreen } from "./welcome-screen"; // Relative path
import { ChatPanel, type Message } from "./chat-panel"; // Relative path
import { CallOverlay, type PanelType } from "./call-overlay"; // Relative path
import { formatTime } from "@/lib/format-time"; // Assumes lib/format-time.ts

const widgetVariants = {
  closed: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const bubbleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { delay: 0.5, duration: 0.3 } },
};

export function SupportWidget() {
  const [mode, setMode] = useState<"closed" | "welcome" | "chat" | "call">(
    "closed"
  );
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "1",
      from: "bot",
      text: "Hello! I'm Fathima, your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);

  // Call state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const panelTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllCallTimers = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    panelTimeoutsRef.current.forEach(clearTimeout);
    timerIntervalRef.current = null;
    panelTimeoutsRef.current = [];
  }, []);

  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, newUserMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: `Thanks for your message: "${text}". I'm here to help! You can also start a voice call for more personalized assistance.`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const handleStartCall = () => {
    setMode("call");
    setElapsedTime(0);
    setCurrentPanel(null);
    setMicMuted(false);
    setSpeakerOn(true);

    timerIntervalRef.current = setInterval(
      () => setElapsedTime((t) => t + 1),
      1000
    );
    panelTimeoutsRef.current.push(
      setTimeout(() => setCurrentPanel("carousel"), 5000),
      setTimeout(() => setCurrentPanel("otp"), 10000),
      setTimeout(() => setCurrentPanel("rating"), 15000)
    );
  };

  const handleStartChat = () => {
    setMode("chat");
  };

  const handleEndCall = () => {
    const callDuration = formatTime(elapsedTime);
    clearAllCallTimers();
    setMode("chat"); // Return to chat after call
    const endCallMessage: Message = {
      id: Date.now().toString(),
      from: "bot",
      text: `Call with Fathima ended. Duration: ${callDuration}. Is there anything else I can help you with?`,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, endCallMessage]);
  };

  const handlePanelComplete = (
    toastMessage: string | null,
    delay: number
  ) => {
    if (toastMessage)
      toast.success(toastMessage, { duration: Math.max(delay, 2000) });
    if (delay > 0) {
      setTimeout(() => setCurrentPanel(null), delay);
    } else {
      setCurrentPanel(null);
    }
  };

  const handleOpenWidget = () => {
    if (mode === "closed") {
      setMode("welcome"); // Start with welcome screen
    } else {
      setMode("closed");
    }
  };

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => clearAllCallTimers();
  }, [clearAllCallTimers]);

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <div className="fixed bottom-4 right-4 z-[9999]">
        {" "}
        {/* High z-index */}
        <AnimatePresence>
          {mode !== "closed" && (
            <motion.div
              variants={widgetVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="w-[calc(100vw-32px)] h-[70vh] max-w-[360px] max-h-[520px] bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <AnimatePresence mode="wait">
                {mode === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <WelcomeScreen
                      onStartCall={handleStartCall}
                      onStartChat={handleStartChat}
                      onClose={() => setMode("closed")}
                    />
                  </motion.div>
                )}
                {mode === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <ChatPanel
                      chatHistory={chatHistory}
                      onSendMessage={handleSendMessage}
                      onStartCall={handleStartCall}
                      onClose={() => setMode("closed")}
                    />
                  </motion.div>
                )}
                {mode === "call" && (
                  <motion.div
                    key="call"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <CallOverlay
                      elapsedTime={elapsedTime}
                      currentPanel={currentPanel}
                      onEndCall={handleEndCall}
                      onPanelComplete={handlePanelComplete}
                      micMuted={micMuted}
                      toggleMic={() => setMicMuted((p) => !p)}
                      speakerOn={speakerOn}
                      toggleSpeaker={() => setSpeakerOn((p) => !p)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-0 right-0"
        >
          <Button
            onClick={handleOpenWidget}
            className="w-14 h-14 rounded-full shadow-lg"
            aria-label={mode === "closed" ? "Open support" : "Close support"}
          >
            <AnimatePresence mode="wait">
              {mode === "closed" ? (
                <motion.div
                  key="open-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <MessageSquare className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="close-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </>
  );
}
```

## 5. Dependencies

To use this widget, you'll need the following dependencies in your project:

*   **React & Next.js** (Assumed base framework)
*   **Tailwind CSS:** For styling.
*   **shadcn/ui components:** (or implement your own versions)
    *   `Button`
    *   `Avatar`, `AvatarImage`, `AvatarFallback`
    *   `Input`
    *   `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`
    *   `Badge`
    *   `ScrollArea`
    *   `Toaster` (from `sonner`)
*   **`lucide-react`:** For icons.
*   **`framer-motion`:** For animations.
*   **`sonner`:** For toast notifications.
*   **`clsx` & `tailwind-merge`:** For the `cn` utility (if using shadcn/ui `utils.ts`).

Example `package.json` dependencies:
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-dialog": "latest", // (or other primitives used by shadcn/ui)
    "@radix-ui/react-scroll-area": "latest",
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest",
    "sonner": "latest",
    "tailwind-merge": "latest",
    "tailwindcss-animate": "latest"
  }
}
```

## 6. Setup and Integration

1.  **Install Dependencies:** Ensure all listed dependencies are installed.
2.  **Set up Tailwind CSS:** Follow the official Tailwind CSS guide for Next.js.
3.  **Install shadcn/ui components:** Use the shadcn/ui CLI to add the necessary components (Button, Avatar, etc.) or provide your own implementations.
4.  **Place Files:** Copy the provided code files into your project, maintaining the suggested directory structure (`components/support-widget/`, `lib/`, `public/`).
5.  **Import Global CSS:** Ensure `app/globals.css` is imported in your `app/layout.tsx`.
6.  **Mount the Widget:** Import and render the `SupportWidget` component in your main page layout or a specific page where you want it to appear. Typically, this would be in `app/layout.tsx` or your root `app/page.tsx` to make it available globally.

    ```typescriptreact
    // Example: app/layout.tsx or app/page.tsx
    import { SupportWidget } from '@/components/support-widget'; // Adjust path as needed

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>
            {children}
            <SupportWidget /> {/* Mount the widget here */}
          </body>
        </html>
      );
    }
    ```

This documentation should provide a comprehensive guide for a developer to understand, implement, and customize the Floating Support Widget.