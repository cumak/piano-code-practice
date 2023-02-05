// @ts-ignore
import { User } from "firebase";
import { FC, createContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";

type AuthContextProps = {
  currentUser: User | null | undefined;
};

// React.createContextを使ってAuthのAPIを作る。Contextは、propsとは別の方法でコンポーネントに動的に値を渡す、React純正のAPI。作成されるコンテキストオブジェクトは、こんな感じのもの。ProviderとConsumerというコンポーネントを所持しています。
// {
//   Provider: <>...<>,
//   Consumer: <>...<>,
//   ...
// }
const AuthContext = createContext<AuthContextProps>({ currentUser: undefined });

type Props = {
  children?: React.ReactNode;
};
const AuthProvider: FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    // Providerコンポーネントで包むことによって、Provider配下のコンテキストを決定する。Provider配下のコンテキスト（つまりchildren=各ページ）では、その値をConsumerコンポーネントから受け取ることができるようになる。
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
