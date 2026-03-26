import prisma from "@/lib/prisma/client";
import { PromptsList } from "@/components/marketplace/prompts-list";

export default async function PromptsPage() {
  const prompts = await prisma.promptListing.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-6">
       <PromptsList initialPrompts={prompts} />
    </div>
  );
}
