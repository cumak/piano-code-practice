function toggleBtn(props) {
  const clickEvent = (e) => {
    const checkValue = e.target.checked;
    props.propsFunc(checkValue);
    return;
  };
  return (
    <>
      <div className="mt-android">
        <input id="tgl" type="checkbox" onChange={clickEvent} />
        <label htmlFor="tgl"></label>
      </div>
      <style jsx>
        {`
          @mixin wrapper {
            display: inline-block;
            box-sizing: border-box;
          }

          @mixin input-checkbox {
            position: absolute;
            box-sizing: border-box;
            height: 0;
            width: 0;
            font-size: inherit;
            margin: 0;
            border: none;
            z-index: 1;
            cursor: pointer;
            -moz-appearance: none;
            -webkit-appearance: none;
            &:focus {
              outline: none;
            }
          }

          @mixin label {
            display: inline-block;
            position: relative;
            box-sizing: border-box;
            cursor: pointer;
          }

          @mixin before-after {
            content: "";
            display: block;
            position: absolute;
          }

          .mt-android {
            @include wrapper;
            label {
              // background
              @include label;
              width: 4em;
              height: 1.75em;
              border-radius: 0.875em;
              background-image: linear-gradient(
                to right,
                #848484 0%,
                #848484 50%,
                #7cbcbf 50%,
                #7cbcbf 100%
              );
              background-size: 8em 1.7em;
              transition: all 0.3s ease;
              &:before {
                // circle
                @include before-after;
                width: 2.25em;
                height: 2.25em;
                top: -0.25em;
                left: 0;
                border-radius: 2em;
                background: #fff;
                transition: 0.3s ease;
                box-shadow: 0 0.125em 0.375em rgba(0, 0, 0, 0.5);
              }
            }
            input {
              @include input-checkbox;
            }
            input:checked + label {
              // background
              background-position: -100%;
              &:before {
                // circle
                transform: translateX(1.75em);
              }
            }
            input:disabled {
              & + label {
                // background
                background: #ccc !important;
                cursor: not-allowed !important;
                &:before {
                  // circle
                  background: #ccc !important;
                  box-shadow: 0 0.125em 0.375em rgba(0, 0, 0, 0.5) !important;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
}

export default toggleBtn;
