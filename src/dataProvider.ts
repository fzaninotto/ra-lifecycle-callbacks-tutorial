import fakeRestProvider from "ra-data-fakerest";
import { withLifecycleCallbacks } from "react-admin";
import { data } from "./data";

let productsToUpdate: string[] = [];

export const dataProvider = withLifecycleCallbacks(
  fakeRestProvider(data, true),
  [
    {
      resource: "reviews",
      afterDelete: async (result: any, dataProvider) => {
        // update the product average note
        const { data: reviews } = await dataProvider.getList("reviews", {
          filter: { product_id: result.data.product_id },
          pagination: { page: 1, perPage: 100 },
          sort: { field: "date", order: "DESC" },
        });
        const average_note =
          reviews.reduce((avg: number, review: any) => avg + review.rating, 0) /
          reviews.length;
        await dataProvider.update("products", {
          id: result.data.product_id,
          data: { average_note },
          previousData: undefined,
        });
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
        for (const product of productsToUpdate) {
          const { data } = await dataProvider.getList("reviews", {
            filter: { product_id: product },
            pagination: { page: 1, perPage: 100 },
            sort: { field: "id", order: "ASC" },
          });
          const averageNote = data.reduce(
            (acc: number, review: any) => acc + review.rating,
            0
          );
          await dataProvider.update("products", {
            id: product,
            data: { average_note: averageNote / data.length },
            previousData: {},
          });
        }
        return result;
      },
    },
  ]
);
