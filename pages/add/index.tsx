import "firebase/firestore";

import { Edit } from "@components/Edit";
import { Layout } from "@components/Layout";
import type { FC } from "react";

const Add: FC = () => {
  return (
    <Layout>
      <Edit />
    </Layout>
  );
};

export default Add;
