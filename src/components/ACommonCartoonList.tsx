import { FC, useState } from "react"
import ACartoonImage from "./ACartoonImage"
import { ConfirmDialog } from "./dialogimpls"
import { Skeleton } from "@nextui-org/react"

export type singleCartoon = {
  hat: number,
  head: number,
  eyes: number,
  clothes: number,
  hand: [number, number],
  pants: number,
  shoes: number,
  logo: number,
}

export type cartoonType = {
  one?: singleCartoon
  two?: singleCartoon
  name?: string
}

type commonCartoontype = {
  cartoonList: cartoonType[]
  loading?: boolean
  showEmpty?: boolean
}
const ACommonCartoonList: FC<commonCartoontype> = ({ cartoonList, loading, showEmpty }) => {
  const [userClickedCartoon, setUserClickedCartoon] = useState<{ value?: cartoonType, isOpen: boolean }>({ value: undefined, isOpen: false })
  const onShowOne = (item: cartoonType) => {
    setUserClickedCartoon({ value: item, isOpen: true })
  }

  return <div className="w-full">
    {(!cartoonList || cartoonList.length == 0) && !loading && showEmpty && <div className=" text-xl w-full text-center flex justify-center ">Oops! Nothing here yet.</div>}
    <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] w-full gap-5">
      {
        cartoonList && cartoonList.map((item, index) => {
          return <div key={`cartoon_${index}`} className="flex-wrap flex-col items-center justify-center gap-5 flex  w-full  bg-[#7E7E7E] cursor-pointer rounded-3xl" onClick={() => onShowOne(item)} >
            <span className="text-xl pt-5">{item.name}</span>
            <div className="flex gap-5 flex-nowrap">
              {item.one && <ACartoonImage data={item.one} size={100} />}
              {item.two && <ACartoonImage data={item.two} size={100} />}
            </div>
          </div>
        })
      }
      {
        loading && <>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
          <Skeleton className="rounded-2xl"><div className="h-[18.3125rem] rounded-3xl"></div></Skeleton>
        </>
      }
      {
        userClickedCartoon.isOpen &&
        <ConfirmDialog
          tit=""
          msg={
            <div className="w-full flex justify-center items-center gap-5 flex-col px-5">
              <span className="text-xl">{userClickedCartoon.value?.name}</span>
              <div className="flex gap-5 flex-nowrap">
                {userClickedCartoon.value?.one && <ACartoonImage data={userClickedCartoon.value?.one} />}
                {userClickedCartoon.value?.two && <ACartoonImage data={userClickedCartoon.value?.two} />}
              </div>

            </div>
          }
          className=" p-[1rem] w-[37.5rem] max-w-2xl"
          confirmText={null}
          cancelColor='default'
          cancelText={
            null
          }
          isOpen={userClickedCartoon.isOpen}
          onCancel={() => setUserClickedCartoon({ value: undefined, isOpen: false })}
        />
      }
    </div >
  </div>
}

export default ACommonCartoonList