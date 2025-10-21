import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { CreateStripeAccountLink, GetStripeDashboardLink } from "../action";
import { Submitbutton } from "../components/SubmitButton";
import { checkStripeAccountStatus } from "@/lib/checkStripeAccountStatus";

// Separate function to get user data without redirect logic
async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeConnectedLinked: true,
      connectedAccountId: true,
    },
  });

  return data;
}

export default async function BillingRoute() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let data = await getUserData(user.id);
  
  // If we have a connected account but status is false, check manually
  if (data?.connectedAccountId && data.stripeConnectedLinked === false) {
    const isActive = await checkStripeAccountStatus(data.connectedAccountId);
    if (isActive) {
      // Update the local data object
      data = {
        ...data,
        stripeConnectedLinked: true
      };
    }
  }

  // Add logging to see what's happening
  console.log('User stripe status:', {
    userId: user.id,
    connectedAccountId: data?.connectedAccountId,
    stripeConnectedLinked: data?.stripeConnectedLinked
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Find all your details regarding your payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!data?.stripeConnectedLinked ? (
            <form action={CreateStripeAccountLink}>
              <Submitbutton title="Link your Account to stripe" />
            </form>
          ) : (
            <form action={GetStripeDashboardLink}>
              <Submitbutton title="View Dashboard" />
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}