import type { FC } from "react";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

export const WaonGroupLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="waonGroup">
        <div className="waonGroup-inner">
          <div className="waonGroup-gosen">
            <Image src="/img/gosen-add.svg" alt="" fill />
          </div>
          {children}
        </div>
      </div>
      <style jsx>
        {`
          .waonGroup {
            flex: 1;
            max-width: 1000px;
            margin: 0 auto;
            &-inner {
              position: relative;
            }
            &-gosen {
              aspect-ratio: 2.146;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        `}
      </style>
    </>
  );
};
