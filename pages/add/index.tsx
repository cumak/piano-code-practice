import "firebase/firestore";

import { Edit } from "components/Edit";
import { Layout } from "components/layout";
import type { FC } from "react";

const Add: FC = () => {
  return (
    <Layout>
      <Edit />
    </Layout>
  );
};

export default Add;
