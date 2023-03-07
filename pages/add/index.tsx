import "firebase/firestore";

import { Layout } from "@components/Layout";
import { Edit } from "components/Edit";
import type { FC } from "react";

const Add: FC = () => {
  return (
    <Layout>
      <Edit />
    </Layout>
  );
};

export default Add;
