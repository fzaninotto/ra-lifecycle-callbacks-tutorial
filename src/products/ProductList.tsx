import {
  Datagrid,
  List,
  NumberField,
  ImageField,
  ReferenceField,
  TextField,
} from "react-admin";

export const ProductList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="reference" />
      <ImageField source="thumbnail" />
      <TextField source="description" />
      <ReferenceField source="category_id" reference="categories" />
      <NumberField
        source="price"
        options={{
          style: "currency",
          currency: "EUR",
        }}
      />
      <NumberField
        source="average_note"
        options={{
          maximumFractionDigits: 1,
        }}
      />
    </Datagrid>
  </List>
);
