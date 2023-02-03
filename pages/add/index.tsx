import { FC } from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import Edit from "../../components/edit";

import "firebase/firestore";

const Add: FC = (props: any) => {
  return (
    <Layout>
      <Head title={"登録画面|コード練習アプリ"} />
      <Edit />
    </Layout>
  );
};

export default Add;
