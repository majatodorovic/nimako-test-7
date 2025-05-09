import { get, fetch } from "@/app/api/api";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { getRobots, handleCategoryRobots } from "@/_functions";
import CategoryPage from "@/app/kategorije/[...path]/page";
import ProductPage from "@/app/proizvod/[...path]/page";

const getBodyForHandleData = () => {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  let pathname = headersList.get("x-pathname") || "/";

  if (pathname.match(/\.(css|js|map|mjs|json)$/)) {
    return null;
  }
  if (pathname.startsWith("http")) {
    pathname = new URL(pathname).pathname;
  }
  let fullUrl;
  if (process.env.NEXT_PUBLIC_URL_STRUCTURE_MODE === "test") {
    if (pathname.startsWith("/")) {
      pathname = pathname.slice(1);
    }
    fullUrl = pathname;
  } else {
    fullUrl = `${protocol}://${host}${pathname}`;
  }

  return { absolute_link: fullUrl };
};

const handleData = async (body) => {
  return await fetch(`/slugs/identify-route`, { ...body })
    .then((res) => {
      return res?.payload;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const fetchCategorySEO = async (slug) => {
  return await get(`/categories/product/single/seo/${slug}`).then(
    (response) => {
      return response?.payload;
    }
  );
};

const getProductSEO = async (id) => {
  return await get(`/product-details/seo/${id}`).then((response) => {
    return response?.payload;
  });
};

const defaultMetadata = {
  title: "Početna | Nimaco",
  description: "Dobrodošli na Nimaco Online Shop",

  robots: "index, follow",
  openGraph: {
    title: "Početna | Nimaco",
    description: "Dobrodošli na Nimaco Online Shop",
    type: "website",
    url: "https://nimaco.rs",
    image:
      "https://api.nimaco.croonus.com/croonus-uploads/config/b2c/logo-a52ac5760506f881ac0049dc792c92b8.webp",
    site_name: "nimaco.rs",
    locale: "sr_RS",
  },
};

export async function generateMetadata({
  searchParams: { filteri, sort, viewed, strana },
}) {
  const headersList = headers();
  let canonical = headersList?.get("x-pathname");

  const fullUrl = getBodyForHandleData();

  if (!fullUrl) {
    return null;
  }

  const data = await handleData(fullUrl);

  switch (true) {
    case data?.status === false &&
      data?.type === null &&
      data?.id === null &&
      data?.redirect_url === false:
      return defaultMetadata;

    case data?.type === "category" &&
      data?.status &&
      data?.redirect_url === false: {
      const category = await fetchCategorySEO(data?.id);

      if (category) {
        const {
          meta_title: title,
          meta_keywords: keywords,
          meta_description: description,
          meta_image: image,
          meta_canonical_link: canonical_link,
          meta_robots: robots,
          social: { share_title, share_description, share_image } = {},
        } = category;

        return {
          title: title ?? "",
          description: description ?? "",
          keywords: keywords ?? "",
          image: image ?? "",
          alternates: {
            canonical: canonical_link ?? canonical,
          },
          openGraph: {
            title: share_title || "",
            description: share_description || "",
            images: [
              {
                url: share_image || "",
                width: 800,
                height: 600,
                alt: share_description || "",
                title: share_title || "",
                description: share_description || "",
              },
            ],
          },
          robots: handleCategoryRobots(strana, filteri, sort, viewed, robots),
        };
      } else {
        return defaultMetadata;
      }
    }

    case data?.type === "product" &&
      data?.status &&
      data?.redirect_url === false: {
      const productSEO = await getProductSEO(data?.id);

      const robots = getRobots(productSEO?.meta_robots);

      const image =
        convertHttpToHttps(productSEO?.meta_image) ||
        "https://api.nimaco.croonus.com/croonus-uploads/config/b2c/logo-a52ac5760506f881ac0049dc792c92b8.webp";

      if (productSEO) {
        return {
          alternates: {
            canonical: productSEO?.meta_canonical_link || canonical,
          },
          description: `${productSEO?.meta_title || ""} - ${
            productSEO?.meta_description || ""
          }`,
          keywords: productSEO?.meta_keywords || "",
          openGraph: {
            title: productSEO?.meta_title || "",
            description: productSEO?.meta_description || "",
            type: "website",
            images: [
              {
                url: image,
                width: 800,
                height: 800,
                alt: productSEO?.meta_title || productSEO?.meta_description,
              },
            ],
          },
          robots: robots,
          title: productSEO?.meta_title || "",
        };
      } else {
        return defaultMetadata;
      }
    }

    default:
      return defaultMetadata;
  }
}

const CategoryProduct = async ({
  params: { slug_path: path },
  params,
  searchParams,
}) => {
  const fullUrl = getBodyForHandleData();

  if (!fullUrl) {
    return null;
  }

  const data = await handleData(fullUrl);

  if (data?.status === false) {
    console.error(`Something went wrong! Status is false.`, data);
    return notFound();
  }

  if (fullUrl.absolute_link === data?.redirect_url) {
    console.error(`Something went wrong! Same absolute_link and redirect_url.`);
    return notFound();
  }

  const headersList = headers();
  let canonical = headersList?.get("x-pathname");

  switch (data?.code) {
    case 308:
      return permanentRedirect(`${data?.redirect_url}`);
    case 200:
      switch (data?.type) {
        case "category":
          return (
            <CategoryPage
              params={params}
              searchParams={searchParams}
              category_id={data?.id}
            />
          );
        case "product":
          return (
            <ProductPage
              id={data?.id}
              path={path}
              category_id={path?.[path?.length - 2] ?? "*"}
              canonical={canonical}
            />
          );
      }
      break;
  }
  return notFound();
};

export default CategoryProduct;
