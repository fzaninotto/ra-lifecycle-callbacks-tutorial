import { Admin, EditGuesser, ListGuesser, Resource } from "react-admin";

import { dataProvider } from "./dataProvider";
import { ProductList } from "./products/ProductList";
import { ProductShow } from "./products/ProductShow";

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="products"
      list={ProductList}
      show={ProductShow}
      recordRepresentation="reference"
    />
    <Resource name="reviews" list={ListGuesser} edit={EditGuesser} />
    <Resource
      name="customers"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation={(record) =>
        `${record.first_name} ${record.last_name}`
      }
    />
    <Resource
      name="commands"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="reference"
      options={{ label: "Orders" }}
    />
    <Resource name="categories" recordRepresentation="name" />
  </Admin>
);
