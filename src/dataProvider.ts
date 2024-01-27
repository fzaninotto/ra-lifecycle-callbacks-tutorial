import fakeRestProvider from "ra-data-fakerest";
import { DataProvider, Identifier, withLifecycleCallbacks } from "react-admin";
import { data } from "./data";

let productsToUpdate: string[] = [];

const updateProductAverageNote = async (productId: Identifier, dataProvider: DataProvider) => {
  const { data, total } = await dataProvider.getList("reviews", {
    filter: { product_id: productId },
    pagination: { page: 1, perPage: 100 },
    sort: { field: "date", order: "DESC" },
  });
  const averageNote = data.reduce(
    (acc: number, review: any) => acc + review.rating,
    0
  ) / total!;
  await dataProvider.update("products", {
    id: productId,
    data: { average_note: averageNote  },
    previousData: {},
  });
}

export const dataProvider = withLifecycleCallbacks(
  fakeRestProvider(data, true),
  [
    {
      resource: 'reviews',
      afterSave: async (data: any, dataProvider) => {
        await updateProductAverageNote(data.product_id, dataProvider);
        return data;
      }
    },
    {
      resource: "reviews",
      afterDelete: async (result: any, dataProvider) => {
        await updateProductAverageNote(result.data.product_id, dataProvider);
        return result;
      },
    },
    {
      resource: "reviews",
      beforeDeleteMany: async (params: any, dataProvider) => {
        const { data } = await dataProvider.getList("reviews", {
          filter: { id: params.ids },
          pagination: { page: 1, perPage: 100 },
          sort: { field: "id", order: "ASC" },
        });
        productsToUpdate = Object.keys(
          data.reduce((acc: any, review: any) => {
            acc[review.product_id] = true;
            return acc;
          }, {})
        );
        return params;
      },
    },
    {
      resource: "reviews",
      afterDeleteMany: async (result: any, dataProvider) => {
        // Update products average note
        for (const productId of productsToUpdate) {
          await updateProductAverageNote(productId, dataProvider);
        }
        return result;
      },
    },
  ]
);
