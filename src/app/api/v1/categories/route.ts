import { TaxonomyService } from "@/server/services/taxonomy.service";
import { apiSuccess } from "@/server/api/response";
import { handleApiError } from "@/server/api/errors";

export async function GET() {
  try {
    const categories = await TaxonomyService.listTaxonomy();
    return apiSuccess({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}
