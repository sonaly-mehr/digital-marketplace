// import { BuyButton } from "@/app/components/SubmitButtons";
// import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import ProductDetails from "@/app/components/ProductDetails";

async function getData(id: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      category: true,
      description: true,
      smallDescription: true,
      name: true,
      images: true,
      price: true,
      createdAt: true,
      id: true,
      User: {
        select: {
          profileImage: true,
          firstName: true,
        },
      },
    },
  });
  return data;
}

export default async function ProductPage({
  params
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  return (
    <ProductDetails data={data}/>
  );
}
