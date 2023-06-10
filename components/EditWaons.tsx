import { CategoryOption } from "@components/CategoryOption";
import { ModalNewGroup } from "@components/ModalNewGroup";
import type { Firestore } from "firebase/firestore";
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { WaonGroup } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";
import { playWaon } from "@/assets/js/playWaon";
import { ADD_ONPU_HEONKIGOU, ADD_ONPU_TOONKIGOU } from "@/constants";
import { auth } from "@/utils/firebase";

// Firestore のインスタンスを初期化
const db: Firestore = getFirestore();

type Props = {
  isEditMode?: boolean;
  fetchedWGProps?: FetchedWGProps;
};

type SelectedWaon = {
  code?: string;
  index: number;
  isSelected?: boolean;
  notes?: {
    num: number;
    flat: boolean;
    sharp: boolean;
    isSelected?: boolean;
  }[];
};

export type FetchedWGProps = {
  canEdit?: boolean;
  canPlay?: boolean;
  waonAreaSelect?: boolean;
  waonGroup?: WaonGroup;
};

export const Edit: FC<Props> = ({ isEditMode = false, fetchedWGProps }) => {
  const router = useRouter();
  const routeId = router.query.id;
  const [selectedWaons, setSelectedWaons] = useState<SelectedWaon[]>([]);
  const [selectedCateId, setSelectedCateId] = useState<string>(fetchedWGProps?.waonGroup?.category);

  useEffect(() => {
    if (isEditMode && fetchedWGProps?.waonGroup?.waons) {
      const createSetData = () => {
        const waons = fetchedWGProps.waonGroup.waons;
        const forSetData: SelectedWaon[] = [];
        waons.forEach((theWaon) => {
          forSetData.push({
            code: theWaon.code,
            index: theWaon.index,
            isSelected: false,
            notes: theWaon.notes,
          });
        });
        return forSetData;
      };
      setSelectedWaons([...createSetData()]);
    }
  }, []);

  useEffect(() => {
    onpuSlide();
  }, [selectedWaons]);

  // 「和音追加」押下
  function addWaonArea() {
    // コード4つ以上になってないか
    if (selectedWaons.length >= 4) {
      alert("登録できるのは4つまでです。");
      return false;
    }
    const newSelectedWaons = selectedWaons.map((selectedWaon) => {
      selectedWaon.isSelected = false;
      selectedWaon.notes.forEach((note) => {
        note.isSelected = false;
      });
      return selectedWaon;
    });
    setSelectedWaons([
      ...indexReNumber(newSelectedWaons),
      { index: selectedWaons.length, isSelected: true, notes: [] },
    ]);
  }

  // 上の音符を選んだとき
  function onpuSelected(target) {
    const targetnum = target.closest(".selectOnpuTama-one").dataset.num;

    const selectedItem = selectedWaons.find((selectedWaon) => {
      return selectedWaon.isSelected === true;
    });

    // 追加先が選択されてなかったら終了
    if (!selectedItem && selectedWaons.length) {
      alert("追加先のエリアを選択してください。");
      return false;
    }

    const isFirst = !selectedWaons.length ? true : false;

    // 同じものをクリックしたら追加しない
    const isExistTama = selectedItem?.notes?.some((item) => {
      return item.num === targetnum;
    });
    if (isExistTama) {
      return false;
    }

    const addNotes = {
      num: targetnum,
      flat: false,
      sharp: false,
      isSelected: false,
    };
    if (isFirst) {
      setSelectedWaons([
        {
          code: "",
          index: 0,
          isSelected: true,
          notes: [addNotes],
        },
      ]);
    } else {
      const newState = selectedWaons.map((waon) => {
        if (waon.isSelected) {
          waon.notes.push(addNotes);
          sortNotes(waon.notes);
          waon.notes.forEach((e) => {
            return (e.isSelected = false);
          });
          return waon;
        } else {
          return waon;
        }
      });
      setSelectedWaons([...newState]);
    }
  }

  // 和音削除ボタン押下
  function eraseWaon(waonIndex) {
    const filterdArr = selectedWaons.filter((_e, index) => {
      return index !== waonIndex;
    });
    if (filterdArr.length === selectedWaons.length) {
      alert("削除したい和音を選択してください");
      return false;
    }
    setSelectedWaons([...indexReNumber(filterdArr)]);
  }

  // 音符削除ボタン押下
  function eraseOnpu() {
    const newSelectedWaons = selectedWaons.map((selectedWaon) => {
      const filterdNote = selectedWaon.notes.filter((note) => {
        return !note.isSelected;
      });
      selectedWaon.notes = filterdNote;
      return selectedWaon;
    });
    setSelectedWaons([...newSelectedWaons]);
  }

  // シャープ追加ボタン押下
  function addSharp() {
    const newSelectedWaons = selectedWaons.map((selectedWaon) => {
      const customNote = selectedWaon.notes.map((note) => {
        if (note.isSelected) {
          note.sharp = !note.sharp;
        }
        return note;
      });
      selectedWaon.notes = customNote;
      return selectedWaon;
    });
    setSelectedWaons([...newSelectedWaons]);
  }

  // フラット追加ボタン押下
  function addFlat() {
    const newSelectedWaons = selectedWaons.map((selectedWaon) => {
      const customNote = selectedWaon.notes.map((note) => {
        if (note.isSelected) {
          note.flat = !note.flat;
        }
        return note;
      });
      selectedWaon.notes = customNote;
      return selectedWaon;
    });
    setSelectedWaons([...newSelectedWaons]);
  }

  // 登録ボタン押した時の入力チェック
  function checkInput(items, codeInput, onpuTamas) {
    // コード名の確認
    const codeVal = codeInput.value;
    if (!codeVal) {
      alert("コード名を全て入力してください。");
      return false;
    }
    // 音符が入力されているか
    const isExist = [...onpuTamas].every((e) => {
      return e.hasChildNodes();
    });
    if (!isExist) {
      alert("両手分の音符を入力してください。");
      return false;
    }
  }

  // 登録ボタン押下
  function register(e) {
    // 登録するものがあるかチェック
    const onpuContainer = document.querySelector(".addMain .onpuContainer");
    if (!onpuContainer.hasChildNodes()) {
      alert("和音を入力してください。");
      e.preventDefault();
      return false;
    }

    const addMain = document.querySelector(".addMain .onpuContainer");
    const items = addMain.childNodes;
    const isCheckNG = [...items].some((item: HTMLElement) => {
      const onpuTamas = item.querySelectorAll(".onpuTama");
      const codeInput = item.querySelector(".onpuContainer-item-opt-code input");
      // 入力チェック
      return checkInput(items, codeInput, onpuTamas) === false;
    });
    if (isCheckNG) {
      e.preventDefault();
      return false;
    } else {
      if (window.confirm("登録しますか？")) {
        addWaonToDb();
      } else {
        e.preventDefault();
        return false;
      }
    }
  }

  // DBに登録する
  async function addWaonToDb() {
    const items = document.querySelectorAll(".addMain .onpuContainer-item");

    const user = auth.currentUser;

    const waonObj = [];
    items.forEach((item, index) => {
      const notes = [];
      const one = item.querySelectorAll(".onpuTama-one");
      const code: HTMLInputElement = item.querySelector(".onpuContainer-item-opt-code input");
      one.forEach((tama: HTMLElement) => {
        const dataNumber = parseInt(tama.dataset.num);
        const isSharp = tama.classList.contains("is-sharp") ? true : false;
        const isFlat = tama.classList.contains("is-flat") ? true : false;
        notes.push({
          num: dataNumber,
          sharp: isSharp,
          flat: isFlat,
        });
      });
      waonObj.push({
        index: index,
        code: code.value,
        notes,
      });
    });
    const newWaonGroup = {
      waons: [...waonObj],
      modifiedAt: serverTimestamp(),
      category: selectedCateId,
    };
    if (!isEditMode) {
      newWaonGroup["createdAt"] = serverTimestamp();
    }
    const wgCollection = collection(db, "user", user.email, "waonGroup");
    if (isEditMode) {
      await updateDoc(doc(wgCollection, routeId as string), {
        waons: waonObj,
        modifiedAt: serverTimestamp(),
        category: selectedCateId,
      });
    } else {
      await addDoc(wgCollection, {
        waons: waonObj,
        modifiedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        category: selectedCateId,
      });
    }
    alert("和音を追加しました。");
    // 新規追加モードなら登録後クリアする
    if (!isEditMode) {
      setSelectedWaons([]);
    }
  }

  function indexReNumber(arr: SelectedWaon[]) {
    return arr.map((e, i) => {
      e.index = i;
      return e;
    });
  }

  function sortNotes(notes) {
    return notes.sort((a, b) => {
      if (Number(a["num"]) > Number(b["num"])) return 1;
      if (Number(a["num"]) < Number(b["num"])) return -1;
      return 0;
    });
  }

  function selectToggleWaonArea(currentWaon) {
    const newSelectedWaons = selectedWaons.map((e, i) => {
      if (currentWaon.index === i) {
        e.isSelected = !e.isSelected;
      } else {
        e.isSelected = false;
      }
      return e;
    });
    setSelectedWaons([...newSelectedWaons]);
  }

  function toggleNoteSelect(event, noteIndex, currentWaon) {
    event.stopPropagation();
    const newSelectedWaon = selectedWaons.map((selectedWaon, i) => {
      if (i === currentWaon.index) {
        const newNotes = selectedWaon.notes.map((note, j) => {
          if (j === noteIndex) {
            note.isSelected = !note.isSelected;
          }
          return note;
        });
        selectedWaon.notes = newNotes;
      }
      return selectedWaon;
    });
    setSelectedWaons([...newSelectedWaon]);
  }

  return (
    <main className="main">
      <form action="">
        <div className="mainWrapper">
          <h1 className="title-l">問題登録</h1>
          <div className="selectGosenContainer">
            <div className="selectGosenContainer-gosen">
              <Image src="/img/gosen-long.svg" alt="" fill />
            </div>
            <div className="selectOnpuContainer">
              <div className="selectOnpuContainer-item">
                <div className="selectOnpuContainer-item-main">
                  <div className="selectOnpuContainer-item-main-parts is-righthand">
                    <div className="selectOnpuTama">
                      {ADD_ONPU_TOONKIGOU.map((onpu) => {
                        return (
                          <button
                            key={onpu.dataNum}
                            className="selectOnpuTama-one"
                            data-num={onpu.dataNum}
                            type="button"
                            onClick={(e) => {
                              return onpuSelected(e.target);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                return onpuSelected(e.target);
                              }
                            }}
                          >
                            <Image src="/img/onpu.svg" alt={onpu.onpuName} fill />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="selectOnpuContainer-item-main-parts is-lefthand">
                    <div className="selectOnpuTama">
                      {ADD_ONPU_HEONKIGOU.map((onpu) => {
                        return (
                          <button
                            key={onpu.dataNum}
                            className="selectOnpuTama-one"
                            type="button"
                            data-num={onpu.dataNum}
                            onClick={(e) => {
                              return onpuSelected(e.target);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                return onpuSelected(e.target);
                              }
                            }}
                          >
                            <Image src="/img/onpu.svg" alt={onpu.onpuName} fill />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottomArea">
            <div className="bottomArea-l">
              <div className="addMain">
                <div className="addMain-inner">
                  <div className="addMain-gosen">
                    <Image src="/img/gosen-add.svg" alt="" fill />
                  </div>
                  {/* 決定した和音 */}
                  <div className="onpuContainer">
                    {selectedWaons.map((waon) => {
                      return (
                        <div key={waon.index} className={`onpuContainer-item ${waon.isSelected && "is-select"}`}>
                          <div
                            role="button"
                            tabIndex={0}
                            className="onpuContainer-item-main"
                            onClick={() => {
                              return selectToggleWaonArea(waon);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace") {
                                eraseWaon(waon.index);
                              }
                              if (e.key === "Enter") {
                                selectToggleWaonArea(waon);
                              }
                            }}
                          >
                            <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                              <div className="onpuTama">
                                {waon.notes?.map((onpu, noteIndex) => {
                                  return (
                                    onpu.num <= 18 && (
                                      <button
                                        key={onpu.num}
                                        type="button"
                                        className={`onpuTama-one js-onpuslide-one ${
                                          onpu.isSelected ? "is-select" : ""
                                        } ${onpu.sharp ? "is-sharp" : ""} ${onpu.flat ? "is-flat" : ""}`}
                                        tabIndex={0}
                                        data-num={onpu.num}
                                        onClick={(e) => {
                                          toggleNoteSelect(e, noteIndex, waon);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Backspace") {
                                            e.stopPropagation();
                                            eraseOnpu();
                                          }
                                          if (e.key === "Enter") {
                                            toggleNoteSelect(e, noteIndex, waon);
                                          }
                                        }}
                                      >
                                        <Image src="/img/onpu.svg" alt="" fill />
                                      </button>
                                    )
                                  );
                                })}
                              </div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                            <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                              <div className="onpuTama">
                                {waon.notes?.map((onpu, noteIndex) => {
                                  return (
                                    onpu.num >= 19 && (
                                      <button
                                        key={onpu.num}
                                        type="button"
                                        className={`onpuTama-one js-onpuslide-one ${
                                          onpu.isSelected ? "is-select" : ""
                                        } ${onpu.sharp ? "is-sharp" : ""} ${onpu.flat ? "is-flat" : ""}`}
                                        tabIndex={0}
                                        data-num={onpu.num}
                                        onClick={(e) => {
                                          toggleNoteSelect(e, noteIndex, waon);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Backspace") {
                                            eraseOnpu();
                                          }
                                          if (e.key === "Enter") {
                                            toggleNoteSelect(e, noteIndex, waon);
                                          }
                                        }}
                                      >
                                        <Image src="/img/onpu.svg" alt="" fill />
                                      </button>
                                    )
                                  );
                                })}
                              </div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                          </div>
                          <div className="onpuContainer-item-opt">
                            <button type="button" className="onpuContainer-item-opt-sound" onClick={playWaon}>
                              <span className="onpuContainer-item-opt-sound-btn">♪</span>
                            </button>
                            <div className="onpuContainer-item-opt-code">
                              <input type="text" name="code" defaultValue={waon.code} />
                            </div>
                          </div>
                          <div className="onpuContainer-item-delete">
                            <button
                              className="onpuContainer-item-delete-btn"
                              type="button"
                              onClick={() => {
                                eraseWaon(waon.index);
                              }}
                            >
                              <Image src="/img/icon-trash.svg" alt="削除する" width="20" height="25" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="editBtns">
                <button type="button" className="editBtns-item" onClick={addWaonArea}>
                  <Image src="/img/icon-square-plus.svg" alt="和音追加" width="20" height="20" />
                  <span className="editBtns-item-label">枠追加</span>
                </button>
                <button type="button" className="editBtns-item is-copy" onClick={eraseOnpu}>
                  <Image src="/img/icon-remove-onpu.svg" alt="音符削除" width="20" height="20" />
                  <span className="editBtns-item-label">音符削除</span>
                </button>
                <div className="editBtns-item is-culumn">
                  <div className="editBtns-item-one">
                    <button
                      className="editBtns-item-one-kigouBtn"
                      onClick={addSharp}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addSharp;
                        }
                      }}
                      type="button"
                    >
                      <span className="editBtns-item-one-kigouBtn-imgWrap">
                        <Image src="/img/sharp.svg" alt="シャープ" fill />
                      </span>
                    </button>
                  </div>
                  <div className="editBtns-item-one">
                    <button
                      className="editBtns-item-one-kigouBtn"
                      onClick={addFlat}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addFlat;
                        }
                      }}
                      type="button"
                    >
                      <span className="editBtns-item-one-kigouBtn-imgWrap">
                        <Image src="/img/flat.svg" alt="フラット" fill />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="actionArea">
              <div className="actionBtns">
                <div className="actionBtns-row">
                  <div className="editDescription">
                    <p>上段の音符をクリックして、和音を作ってください。</p>
                  </div>
                </div>
                <div className="actionBtns-row is-group">
                  <section className="actionBtns-row-group">
                    <h2 className="actionBtns-row-group-title">カテゴリー</h2>
                    <CategoryOption setSelectedCateId={setSelectedCateId} defaultId={selectedCateId} />
                    <div className="actionBtns-row-group-newBtn">
                      <button className="btn-plus" data-micromodal-trigger="modal-1" type="button">
                        +
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          <div className="registerBtn">
            <input className="btn-big is-blue" type="button" value="登録する" onClick={register} />
          </div>
        </div>
      </form>
      <ModalNewGroup
        callbackAfterCreate={(id) => {
          return setSelectedCateId(id);
        }}
      />
    </main>
  );
};
