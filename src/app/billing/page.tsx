import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
  import { Button } from "@/components/ui/button";;
  import { unstable_noStore as noStore, unstable_noStore } from "next/cache";
import prisma from "@/lib/db";
import { CreateStripeAccountLink, GetStripeDashboardLink } from "../action";
import { Submitbutton } from "../components/SubmitButton";

  
  async function getData(userId: string) {
    unstable_noStore();
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeConnectedLinked: true,
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
  
    const data = await getData(user.id);
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
            {data?.stripeConnectedLinked === false && (
              <form action={CreateStripeAccountLink}>
                <Submitbutton title="Link your Accout to stripe" />
              </form>
            )}
  
            {data?.stripeConnectedLinked === true && (
              <form action={GetStripeDashboardLink}>
                <Submitbutton title="View Dashboard" />
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }