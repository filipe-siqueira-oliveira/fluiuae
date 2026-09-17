import { CategoriesView } from "@/features/categories/categories_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_categories } from "@/server/services/category_service";

const CategoriesPage = async () => {
  const context = await require_authenticated_context();
  const categories = await list_categories(context.workspace.id);

  return <CategoriesView categories={categories} can_write={can_write_data(context.role)} />;
};

export default CategoriesPage;
