import { NextRequest } from "next/server";
import { PayoutService } from "@/server/services/payout.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError, ValidationError } from "@/server/api/errors";
import { getSessionFromCookies } from "@/server/auth/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromCookies();
    const adminUserId = session?.user?.id || "usr_admin_01";

    const body = await request.json();
    const { decision, referenceId, notes } = body;

    if (!decision || (decision !== "APPROVE" && decision !== "REJECT")) {
      throw new ValidationError("Valid decision ('APPROVE' or 'REJECT') is required.");
    }

    const payout = await PayoutService.decidePayout(
      id,
      adminUserId,
      decision,
      referenceId,
      notes
    );

    return apiSuccess({ payout }, { message: `Payout request ${decision.toLowerCase()}d successfully.` });
  } catch (error) {
    return handleApiError(error);
  }
}
