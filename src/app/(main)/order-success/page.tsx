import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-20">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
            <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-fit">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold mt-4">Order Placed!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-foreground mb-8">
            Your order is in queue. Our team will contact you shortly to take your order and confirm the details.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account">View Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
