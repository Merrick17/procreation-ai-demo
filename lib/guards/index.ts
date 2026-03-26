import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getCreditCost } from "@/lib/x402";

export type AuthenticatedRequest = Request & {
  session: SessionData;
  userId: string;
};

export type GuardedHandler = (req: AuthenticatedRequest) => Promise<Response | NextResponse>;

export type GuardedHandlerWithParams<T extends Record<string, unknown> = Record<string, unknown>> = (
  req: AuthenticatedRequest,
  params: { params: Promise<T> }
) => Promise<Response | NextResponse>;

export function withAuth<T extends Record<string, unknown> = Record<string, unknown>>(
  handler: GuardedHandler | GuardedHandlerWithParams<T>
) {
  return async (req: Request, context?: { params: Promise<T> }) => {
    try {
      const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
      if (!session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const authReq = req as AuthenticatedRequest;
      authReq.session = session;
      authReq.userId = session.userId;

      if (context?.params) {
        return await (handler as GuardedHandlerWithParams<T>)(authReq, { params: context.params });
      }
      return await (handler as GuardedHandler)(authReq);
    } catch (error) {
      console.error("Auth Guard Error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export function withCredits(resource: string, modelId?: string, minCreditsOverride?: number) {
  return function (handler: GuardedHandler): (req: AuthenticatedRequest) => Promise<Response | NextResponse> {
    return async (req: AuthenticatedRequest) => {
      try {
        const cost = minCreditsOverride || getCreditCost(resource, modelId);
        
        const user = await prisma.user.findUnique({
          where: { id: req.userId },
          select: { credits: true }
        });

        if (!user || user.credits < cost) {
          return NextResponse.json({ 
            error: "Insufficient credits", 
            required: cost, 
            current: user?.credits || 0,
            priceUSD: cost / 100,
            resource,
            modelId
          }, { status: 402 });
        }

        return await handler(req);
      } catch (error) {
        console.error("Credit Guard Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    };
  };
}

export async function deductCredits(userId: string, resource: string, modelId?: string) {
  const cost = getCreditCost(resource, modelId);
  
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: cost } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -cost,
      type: "SPEND",
    },
  });

  return cost;
}

export function withX402Payment(resource: string) {
  return function (handler: GuardedHandler) {
    return async (req: AuthenticatedRequest) => {
      const paymentHeader = req.headers.get("x402-payment");
      
      if (!paymentHeader) {
        return NextResponse.json(
          {
            error: "Payment required",
            resource,
            x402Version: 2,
            accepts: [
              {
                scheme: "exact",
                price: getCreditCost(resource) / 100,
              },
            ],
          },
          { 
            status: 402,
            headers: {
              "X-402-Version": "2",
              "X-402-Resource": resource,
            },
          }
        );
      }

      return await handler(req);
    };
  };
}