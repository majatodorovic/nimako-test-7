import { get, list } from "@/app/api/api";
import ProductDetailsPage from "@/components/ProductDetailsPage/ProductDetailsPage";

const getProduct = async (id) => {
  return await get(`/product-details/basic-data/${id}`).then(
    (response) => response?.payload
  );
};

const getProductImages = async (id) => {
  return await get(`/product-details/gallery/${id}`).then(
    (response) => response?.payload?.gallery
  );
};

const getBadge = async (id) => {
  return await get(`/product-details/gallery/${id}`).then(
    (response) => response?.payload?.stickers
  );
};

const getSpecification = async (id) => {
  return await get(`/product-details/specification/${id}`).then(
    (response) => response?.payload
  );
};
const tehnicalDocList = async (id) => {
  return await list(`/product-details/technical-doc/${id}`).then(
    (response) => response?.payload
  );
};

const getProductDesc = async (id) => {
  return await get(`/product-details/description/${id}`).then(
    (response) => response?.payload
  );
};

const getProductBreadcrumbs = async (slug, categoryId) => {
  return await get(
    `/product-details/breadcrumbs/${slug}?categoryId=${categoryId}`
  ).then((response) => response?.payload);
};

const ProductPage = async ({ id, path, category_id, canonical }) => {
  const productId = id;
  const [
    product,
    gallery,
    badge,
    specification,
    productsDesc,
    technicalDoc,
    breadcrumbs,
  ] = await Promise.all([
    getProduct(productId),
    getProductImages(productId),
    getBadge(productId),
    getSpecification(productId),
    getProductDesc(productId),
    tehnicalDocList(productId),
    getProductBreadcrumbs(productId, category_id),
  ]);

  return (
    <>
      <ProductDetailsPage
        gallery={gallery}
        badge={badge}
        specification={specification}
        products={product}
        productsDesc={productsDesc}
        tehnicalDoc={technicalDoc}
        breadcrumbs={breadcrumbs}
        canonical={canonical}
      />
    </>
  );
};

export default ProductPage;
