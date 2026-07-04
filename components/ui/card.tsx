import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

interface PersonCardProps {
  name: string;
  message?: string;
  photoUrl?: string;
}

interface PersonCardProps {
  name: string;
  message?: string;
  photoUrl?: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ name, photoUrl, message }) => {
  return (
    // ~30% larger than original (original w-96 = 24rem, now ~31rem; height 28rem -> 36rem)
    <div className="w-[31rem] max-w-full h-[36rem] bg-white shadow-lg rounded-xl overflow-hidden p-7 flex flex-col">
      {/* Name */}
      <h2 className="text-3xl font-bold mb-5 text-center">{name}</h2>

      {/* Photo */}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          className="w-60 h-60 object-cover rounded-full mx-auto mb-5"
        />
      )}

      {/* Message */}
      {message && (
        <div className="flex-1 overflow-y-auto text-gray-800 text-lg leading-relaxed pr-1 whitespace-pre-line">
          {message}
        </div>
      )}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PersonCard,
};
