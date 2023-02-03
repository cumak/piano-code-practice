// @ts-ignore
import { User } from 'firebase'
import { FC, createContext, useEffect, useState } from 'react'
import { auth } from '../utils/firebase'//firebaseのauthシステムをインポート

// currentUser変数。firebaseから取ってきた現在のユーザーかnullかundefinedが入る
type AuthContextProps = {
  currentUser: User | null | undefined
}

// React.createContextを使ってAuthのAPIを作る。Contextは、propsとは別の方法でコンポーネントに動的に値を渡す、React純正のAPI。作成されるコンテキストオブジェクトは、こんな感じのもの。ProviderとConsumerというコンポーネントを所持しています。
// {
//   Provider: <>...<>,
//   Consumer: <>...<>,
//   ...
// }
const AuthContext = createContext<AuthContextProps>(
  { currentUser: undefined }
)
// FCはReact.FunctionComponentという型。useStateは、stateを作れる（useと書いてあるが、イメージ的にはstateのcurrentUserにundefindeをセットしてる）。useStateが、現在の state と、「それを更新するための関数」とを、ペアにして返します。その関数がsetCurrentUser。つまりこの関数はuseStateによって勝手に作られたもの。
const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  )

  // useEffectで包むとDOM構築後の処理になる。auth.onAuthStateChangedはfirebaseから現在サインインしてるuserの情報を取得。さっき作ったsetCurrentUser関数でそれをcurrentUserにセットしてる。
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    // Providerコンポーネントで包むことによって、Provider配下のコンテキストを決定する。Provider配下のコンテキスト（つまりchildren=各ページ）では、その値をConsumerコンポーネントから受け取ることができるようになる。
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}


export { AuthContext, AuthProvider }