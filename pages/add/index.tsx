import "firebase/firestore";

import { Edit } from "@components/EditWaons";
import { Layout } from "@components/Layout";
import type { FC } from "react";

const Add: FC = () => {
  return (
    <Layout pageTitle="和音作成">
      <Edit />
    </Layout>
  );
};

export default Add;
