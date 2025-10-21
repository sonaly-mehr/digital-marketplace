import { Card } from "@/components/ui/card";
import React from "react";
import SellForm from "../components/form/SellForm";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { checkStripeAccountStatus } from "@/lib/checkStripeAccountStatus";

async function checkUserAccess(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeConnectedLinked: true,
      connectedAccountId: true,
    },
  });

  // If we have a connected account but status is false, check manually
  if (data?.connectedAccountId && data.stripeConnectedLinked === false) {
    const isActive = await checkStripeAccountStatus(data.connectedAccountId);
    if (isActive) {
      return; // User is allowed to access sell page
    }
  }

  if (data?.stripeConnectedLinked === false) {
    redirect("/billing");
  }
}

const SellPage = async () => {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
  
  await checkUserAccess(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
        <SellForm />
      </Card>
    </section>
  );
};

export default SellPage;